import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginationMeta, RequestData, TableConfig } from './table.config';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: any[] = [];
  @Input() config!: TableConfig;
  @Input() meta!: PaginationMeta;
  @Output() requestData = new EventEmitter<RequestData>();
  @Output() selectionChange = new EventEmitter<any[]>();
  protected selectedRows: Set<any> = new Set();

  protected filters: { [key: string]: FormControl } = {};
  protected subscriptions: Subscription[] = [];

  protected page = 1;
  protected sortKey = '';
  protected sortDirection: 'asc' | 'desc' | '' = '';

  protected filteredData: any[] = [];
  protected keySelectable = 'selectable';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.addSelectableColumnIfItIs(); // Añade la columna de selección si está habilitada
    this.initFilters(); // Inicializa filtros y suscripciones a cambios
    this.loadFiltersFromUrl(); // Carga los filtros persistidos desde la URL

    if (this.config.serverSide) {
      this.emitRequest(); // En modo servidor, emite la primera petición de datos
    } else {
      this.applyClientFilteringSortAndPagination(); // En modo cliente, aplica filtros, orden y paginación
    }
  }

  //Añade una columna al principio para checkboxes de selección si la tabla es seleccionable.
  addSelectableColumnIfItIs(): void {
    if (this.config.selectable) {
      this.config.columns.unshift({
        key: this.keySelectable,
        label: 'Pick',
        type: 'text',
      });
    }
  }

  //Elimina todas las suscripciones al destruirse el componente para evitar fugas de memoria.
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {
    //// Aplica filtrado/paginación si llegan nuevos datos y es modo cliente
    if (changes['data'] && !this.config?.serverSide) {
      this.applyClientFilteringSortAndPagination();
    }

    //// Si hay selección por valores predefinidos, actualiza `selectedRows`
    if (changes['data'] && this.config?.selectable && typeof this.config.selectable === 'object') {
      const { key, selectedValues } = this.config.selectable;
      if (key && Array.isArray(selectedValues)) {
        this.selectedRows = new Set(this.data.filter((row) => selectedValues.includes(row[key])));
        this.selectionChange.emit(Array.from(this.selectedRows));
      }
    }
  }

  //Crea controles reactivos para los filtros y suscribe a sus cambios.
  initFilters(): void {
    this.config.columns.forEach((col) => {
      if (col.filterable) {
        const control = new FormControl('');
        this.filters[col.key] = control;
        // Suscribirse a cambios de valor en cada filtro
        this.subscriptions.push(
          control.valueChanges.subscribe(() => {
            this.meta.page = 1; // Resetea a primera página al cambiar filtro
            if (this.config.serverSide) {
              this.emitRequest();
            } else {
              this.applyClientFilteringSortAndPagination();
            }
            if (this.config.persistFilters) {
              this.updateQueryParams(); // Guarda filtros en URL
            }
          })
        );
      }
    });
  }

  //Carga valores de filtros desde los parámetros de la URL, si está habilitada la persistencia.
  loadFiltersFromUrl(): void {
    if (!this.config.persistFilters) return;

    this.route.queryParams.subscribe((params) => {
      for (const key of Object.keys(this.filters)) {
        const namespacedKey = `${this.config.tableName}${key}`;
        if (params[namespacedKey]) {
          this.filters[key].setValue(params[namespacedKey], { emitEvent: false });
        }
      }
    });
  }

  //Actualiza la URL con los filtros actuales para que puedan persistir entre navegaciones.
  updateQueryParams(): void {
    const queryParams: any = {};
    for (const key in this.filters) {
      const val = this.filters[key].value;
      if (val) queryParams[`${this.config.tableName}${key}`] = val;
    }
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  //Aplica filtrado, ordenación y paginación en cliente, modificando filteredData.
  applyClientFilteringSortAndPagination(): void {
    if (!this.meta) return;

    let filtered = [...this.data];

    // Aplica filtros
    for (const key of Object.keys(this.filters)) {
      const val = this.filters[key].value;
      if (val) {
        filtered = filtered.filter((item) => item[key]?.toString().toLowerCase().includes(val.toLowerCase()));
      }
    }

    // Aplica ordenación
    if (this.sortKey) {
      filtered.sort((a, b) => {
        const valA = a[this.sortKey];
        const valB = b[this.sortKey];
        if (valA == null) return 1;
        if (valB == null) return -1;

        if (this.sortDirection === 'asc') {
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else if (this.sortDirection === 'desc') {
          return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
        return 0;
      });
    }

    // Actualizar total filtrados
    this.meta.total = filtered.length;

    // Paginación: asegurarse de que page es válida
    const totalPages = Math.max(1, Math.ceil(this.meta.total / this.meta.pageSize));
    if (this.meta.page > totalPages) this.meta.page = totalPages;
    if (this.meta.page < 1) this.meta.page = 1;

    // Aplica paginación
    const start = (this.meta.page - 1) * this.meta.pageSize;
    this.filteredData = filtered.slice(start, start + this.meta.pageSize);
  }

  //Emite un evento con la configuración actual de paginación, filtros y orden para pedir datos al servidor.
  emitRequest(): void {
    this.requestData.emit({
      page: this.meta?.page || 1,
      pageSize: this.meta?.pageSize || 10,
      filters: Object.fromEntries(Object.entries(this.filters).map(([k, v]) => [k, v.value])),
      sort: { key: this.sortKey, direction: this.sortDirection },
    });
  }

  //Cambia el criterio y dirección de ordenación al hacer clic en el encabezado de columna.
  changeSort(key: string): void {
    if (key === this.keySelectable) {
      // No se ordena por columna de selección
      return;
    } else if (this.sortKey !== key || this.sortDirection === 'desc') {
      this.sortKey = key;
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = '';
    }

    if (this.config.serverSide) {
      this.emitRequest();
    } else {
      this.applyClientFilteringSortAndPagination();
    }
  }

  //Cambia de página si el número es válido, tanto en modo cliente como servidor.
  changePage(newPage: number) {
    if (!this.meta) return;

    const totalPages = Math.max(1, Math.ceil(this.meta.total / this.meta.pageSize));
    if (newPage < 1 || newPage > totalPages) return;

    this.meta.page = newPage;

    if (this.config.serverSide) {
      this.emitRequest();
    } else {
      this.applyClientFilteringSortAndPagination();
    }
  }

  //Añade o quita una fila seleccionada cuando el usuario marca/desmarca el checkbox. Emite el listado actualizado.
  toggleRowSelection(row: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedRows.add(row);
    } else {
      this.selectedRows.delete(row);
    }
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  //Verifica si una fila está actualmente seleccionada (checkbox activo).
  isSelected(row: any): boolean {
    return this.selectedRows.has(row);
  }
}

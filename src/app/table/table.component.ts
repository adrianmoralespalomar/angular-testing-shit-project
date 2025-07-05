import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginationMeta, TableConfig } from './table.config';

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
  @Output() requestData = new EventEmitter<{
    page: number;
    pageSize: number;
    filters: any;
    sort: { key: string; direction: 'asc' | 'desc' | '' };
  }>();

  filters: { [key: string]: FormControl } = {};
  subscriptions: Subscription[] = [];

  page = 1;
  sortKey = '';
  sortDirection: 'asc' | 'desc' | '' = '';

  filteredData: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.initFilters();
    this.loadFiltersFromUrl();

    if (this.config.serverSide) {
      this.emitRequest();
    } else {
      this.applyClientFilteringSortAndPagination();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !this.config?.serverSide) {
      this.applyClientFilteringSortAndPagination();
    }
  }

  initFilters() {
    this.config.columns.forEach((col) => {
      if (col.filterable) {
        const control = new FormControl('');
        this.filters[col.key] = control;
        this.subscriptions.push(
          control.valueChanges.subscribe(() => {
            this.meta.page = 1; // Resetea a primera página al cambiar filtro
            if (this.config.serverSide) {
              this.emitRequest();
            } else {
              this.applyClientFilteringSortAndPagination();
            }
            if (this.config.persistFilters) {
              this.updateQueryParams();
            }
          })
        );
      }
    });
  }

  loadFiltersFromUrl() {
    if (!this.config.persistFilters) return;

    this.route.queryParams.subscribe((params) => {
      for (const key of Object.keys(this.filters)) {
        if (params[key]) {
          this.filters[key].setValue(params[key], { emitEvent: false });
        }
      }
    });
  }

  updateQueryParams() {
    const queryParams: any = {};
    for (const key in this.filters) {
      const val = this.filters[key].value;
      if (val) queryParams[key] = val;
    }
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  applyClientFilteringSortAndPagination() {
    if (!this.meta) return;

    let filtered = [...this.data];

    // Filtros
    for (const key of Object.keys(this.filters)) {
      const val = this.filters[key].value;
      if (val) {
        filtered = filtered.filter((item) => item[key]?.toString().toLowerCase().includes(val.toLowerCase()));
      }
    }

    // Ordenación
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

    const start = (this.meta.page - 1) * this.meta.pageSize;
    this.filteredData = filtered.slice(start, start + this.meta.pageSize);
  }

  emitRequest() {
    this.requestData.emit({
      page: this.meta?.page || 1,
      pageSize: this.meta?.pageSize || 10,
      filters: Object.fromEntries(Object.entries(this.filters).map(([k, v]) => [k, v.value])),
      sort: { key: this.sortKey, direction: this.sortDirection },
    });
  }

  changeSort(key: string) {
    if (this.sortKey !== key) {
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
}

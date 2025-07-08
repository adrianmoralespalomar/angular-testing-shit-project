import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TableComponent } from './table.component';
import { PaginationMeta, RequestData, TableConfig } from './table.config';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  constructor(private http: HttpClient) {}

  getPokemonList(offset = 0, limit = 10): Observable<{ data: any[]; page: number; pageSize: number; total: number }> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`).pipe(
      map((response) => {
        const data = response.results.map((p: any, i: number) => ({
          nombre: p.name,
          url: p.url,
          id: offset + i + 1,
        }));

        return {
          data,
          page: offset / limit + 1,
          pageSize: limit,
          total: response.count,
        };
      })
    );
  }
}
@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}
  private readonly url = 'https://dummyjson.com/products';

  getProductList(search: string | undefined = undefined, offset = 0, limit = 10, sortBy: string | undefined = undefined, order: string | undefined = undefined): Observable<{ data: any[]; page: number; pageSize: number; total: number }> {
    return this.http.get<any>(`${this.url}/search?q=${search}&skip=${offset}&limit=${limit}&sortBy=${sortBy}&order=${order}`).pipe(
      map((response) => {
        const data = response.products.map((p: any, i: number) => ({
          title: p.title,
          url: p.description,
          id: offset + i + 1,
        }));
        return {
          data,
          page: offset / limit + 1,
          pageSize: limit,
          total: response.total,
        };
      })
    );
  }
}

@Component({
  template: `
    <section class="tables-section">
      <app-table [data]="dataPersons" [config]="tableConfigPersons" [meta]="linksPersonas" class="parenttable" />
      <app-table [data]="dataPokemon" [config]="tableConfigPokemon" [meta]="linksPokemon" (requestData)="loadPokemons($event)" class="parenttable" />
      <app-table [data]="dataProduct" [config]="tableConfigProduct" [meta]="linksProduct" (requestData)="loadProduct($event)" class="parenttable" />
      <div>
        <app-table [data]="dataCities" [config]="tableConfigCities" [meta]="linksCities" (selectionChange)="this.selectedCities = $event" />
        <pre>{{ this.selectedCities | json }}</pre>
      </div>
    </section>
  `,
  styles: [
    `
      section.tables-section {
        display: flex;
        gap: 1rem;
        flex-wrap: nowrap;
        height: 100%;
        app-table.parenttable {
          flex: 1 0 0;
          min-width: 0;
          max-width: 25%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
      }
    `,
  ],
  standalone: true,
  imports: [TableComponent, JsonPipe],
})
export class TableTestComponent {
  dataPersons = [
    { nombre: 'Juan', edad: 25, pais: 'España' },
    { nombre: 'María', edad: 30, pais: 'Francia' },
    { nombre: 'Pedro', edad: 40, pais: 'España' },
    { nombre: 'Lucía', edad: 35, pais: 'Italia' },
    { nombre: 'Luis', edad: 28, pais: 'Francia' },
    { nombre: 'Ana', edad: 22, pais: 'España' },
    { nombre: 'Tomás', edad: 31, pais: 'Italia' },
    { nombre: 'Sofía', edad: 27, pais: 'Francia' },
    { nombre: 'Carlos', edad: 36, pais: 'España' },
    { nombre: 'Elena', edad: 29, pais: 'Italia' },
    { nombre: 'Josefina', edad: 71, pais: 'Francia' },
  ];

  tableConfigPersons: TableConfig = {
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', sortable: true, filterable: true },
      { key: 'edad', label: 'Edad', type: 'number', sortable: true, filterable: true },
      {
        key: 'pais',
        label: 'País',
        type: 'select',
        sortable: true,
        filterable: true,
        options: ['España', 'Francia', 'Italia'],
      },
    ],
    tableName: 'tableConfigPersons',
    serverSide: false,
    persistFilters: true,
  };

  linksPersonas: PaginationMeta = {
    page: 1,
    pageSize: 10,
    total: 0,
  };

  protected pokemonService = inject(PokemonService);
  dataPokemon: any[] = [];
  tableConfigPokemon: TableConfig = {
    columns: [
      { key: 'id', label: 'ID', type: 'number', sortable: true },
      { key: 'nombre', label: 'Nombre Pokemon', type: 'text', filterable: true },
      { key: 'url', label: 'URL', type: 'text' },
    ],
    tableName: 'tableConfigPokemon',
    serverSide: true,
    persistFilters: false,
  };

  linksPokemon: PaginationMeta = {
    page: 1,
    pageSize: 10,
    total: 0,
  };

  loadPokemons(event: RequestData) {
    const offset = (event.page - 1) * event.pageSize;

    this.pokemonService.getPokemonList(offset, event.pageSize).subscribe((res) => {
      this.dataPokemon = res.data;
      this.linksPokemon = {
        page: res.page,
        pageSize: res.pageSize,
        total: res.total,
      };
    });
  }

  protected productService = inject(ProductService);
  dataProduct: any[] = [];
  tableConfigProduct: TableConfig = {
    columns: [
      { key: 'id', label: 'ID', type: 'number', sortable: true },
      { key: 'title', label: 'Nombre Product', type: 'text', filterable: true },
      { key: 'url', label: 'URL', type: 'text' },
    ],
    tableName: 'tableConfigProduct',
    serverSide: true,
    persistFilters: true,
  };

  linksProduct: PaginationMeta = {
    page: 1,
    pageSize: 10,
    total: 0,
  };

  loadProduct(event: RequestData) {
    const offset = (event.page - 1) * event.pageSize;
    this.productService.getProductList(event.filters.title, offset, event.pageSize, event.sort.key, event.sort.direction).subscribe((res) => {
      this.dataProduct = res.data;
      this.linksProduct = {
        page: res.page,
        pageSize: res.pageSize,
        total: res.total,
      };
    });
  }

  dataCities = [
    { nombre: 'Madrid', pais: 'España', isSelected: true },
    { nombre: 'Sevilla', pais: 'España', isSelected: false },
    { nombre: 'Murcia', pais: 'España', isSelected: false },
    { nombre: 'Barcelona', pais: 'España', isSelected: true },
  ];

  selectedCities: any[] = [];

  tableConfigCities: TableConfig = {
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', sortable: true, filterable: true },
      {
        key: 'pais',
        label: 'País',
        type: 'select',
        sortable: true,
        filterable: true,
        options: ['España', 'Francia', 'Italia'],
      },
    ],
    tableName: 'tableConfigCities',
    serverSide: false,
    persistFilters: true,
    selectable: {
      key: 'nombre', // Key to indicate wt its already selected
      selectedValues: this.dataCities.filter((x) => x.isSelected).map((x) => x.nombre), // values that are already selected
    },
  };

  linksCities: PaginationMeta = {
    page: 1,
    pageSize: 2,
    total: 0,
  };
}

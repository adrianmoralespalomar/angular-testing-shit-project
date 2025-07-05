import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TableComponent } from './table.component';
import { PaginationMeta, TableConfig } from './table.config';

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

@Component({
  template: `
    <app-table [data]="dataPersons" [config]="tableConfigPersons" [meta]="linksPersonas" />
    <app-table [data]="dataPokemon" [config]="tableConfigPokemon" [meta]="linksPokemon" (requestData)="loadPokemons($event)" />
    <app-table [data]="dataCities" [config]="tableConfigCities" [meta]="linksCities" (selectionChange)="this.selectedCities = $event" />
    <pre>{{ this.selectedCities | json }}</pre>
  `,
  styleUrls: ['./table.component.css'],
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
      { key: 'nombre', label: 'Nombre', type: 'text', filterable: true },
      { key: 'url', label: 'URL', type: 'text' },
    ],
    serverSide: true,
    persistFilters: false,
  };

  linksPokemon: PaginationMeta = {
    page: 1,
    pageSize: 10,
    total: 0,
  };

  loadPokemons(event: any) {
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

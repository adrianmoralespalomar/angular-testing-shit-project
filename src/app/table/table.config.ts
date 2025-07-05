export interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: any[]; // Para dropdowns si es 'select'
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableConfig {
  columns: TableColumn[];
  serverSide?: boolean;
  persistFilters?: boolean;
  selectable?: {
    key: string; // Propiedad por la que identificar la fila (ej: "nombre", "id", etc.)
    selectedValues?: any[]; // Valores que indican qué filas vienen preseleccionadas
  };
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  next?: string;
  previous?: string;
}

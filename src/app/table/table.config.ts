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
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  next?: string;
  previous?: string;
}

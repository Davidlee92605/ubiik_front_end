
export interface BackendQueryParams {
  query: string;
  sortField: string;
  sortDirection: 'asc' | 'desc' | '';
  pageIndex: number;
  pageSize: number;
}

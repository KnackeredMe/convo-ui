export interface IProductFilters {
  itemsPerPage: number,
  pageNumber: number,
  productNameSearch: string,
  productTypeIds: number[] | null,
  sortBy: string,
  sortOrder: string
}

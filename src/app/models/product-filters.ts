export interface IProductFilters {
  pageNumber: number,
  productNameSearch: string,
  productTypeIds: number[] | null,
  sortBy: string,
  sortOrder: string
}

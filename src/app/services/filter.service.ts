import { Injectable } from '@angular/core';
import {IProductFilters} from "../models/product-filters";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  public filters: IProductFilters = {
    itemsPerPage: 6,
    pageNumber: 0,
    productNameSearch: '',
    productTypeIds: null,
    sortBy: '',
    sortOrder: ''
  };

  public clearFiltersSubject: Subject<void> = new Subject<void>();
  public updateFiltersSubject: Subject<void> = new Subject<void>();
  constructor() { }

  public clearFilters() {
    this.filters = {
      itemsPerPage: this.filters.itemsPerPage,
      pageNumber: 0,
      productNameSearch: '',
      productTypeIds: null,
      sortBy: '',
      sortOrder: ''
    };
    this.clearFiltersSubject.next();
  }
}

import { Injectable } from '@angular/core';
import {IProductFilters} from "../models/product-filters";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  public filters: IProductFilters = {
    pageNumber: 0,
    productNameSearch: '',
    productTypeIds: null,
    sortBy: '',
    sortOrder: ''
  };

  public searchEventSubject: Subject<void> = new Subject<void>();
  public clearFiltersSubject: Subject<void> = new Subject<void>();
  constructor() { }

  public clearFilters() {
    this.filters = {
      pageNumber: 0,
      productNameSearch: '',
      productTypeIds: null,
      sortBy: '',
      sortOrder: ''
    };
    this.clearFiltersSubject.next();
  }
}

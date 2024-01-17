import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {IProductType} from "../../models/product-type";
import {MatListOption} from "@angular/material/list";
import {FilterService} from "../../services/filter.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  private productTypesSubscription: Subscription;
  private clearFiltersSubscription: Subscription;
  private updateFiltersSubscription: Subscription;
  public productTypes: IProductType[] | undefined;
  @ViewChild('filter') filter: any;
  @ViewChild('sort') sort: any;

  constructor(private productService: ProductService,
              public filterService: FilterService) { }

  ngOnInit(): void {
    this.productTypesSubscription = this.productService.getProductTypes().subscribe({
        next: res => {
          this.productTypes = res;
          if (this.filterService.filters.productTypeIds?.length) {
            setTimeout(() => this.filterService.updateFiltersSubject.next());
          }
        }
      }
    )
    this.clearFiltersSubscription = this.filterService.clearFiltersSubject.subscribe({
      next: () => {
        this.filter.deselectAll();
      }
    })
    this.updateFiltersSubscription = this.filterService.updateFiltersSubject.subscribe({
      next: () => {
        if (!this.filterService.filters.productTypeIds?.length) {
          this.filter.deselectAll();
        }
        const optionsToSelect = this.filter.options.filter((option: any) => {
          return this.filterService.filters.productTypeIds?.includes(option.value.id);
        });
        this.filter.selectedOptions.select(...optionsToSelect);
      }
    })
  }

  ngOnDestroy() {
    if(this.productTypesSubscription) {
      this.productTypesSubscription.unsubscribe();
    }
    if(this.clearFiltersSubscription) {
      this.productTypesSubscription.unsubscribe();
    }
    if(this.updateFiltersSubscription) {
      this.updateFiltersSubscription.unsubscribe();
    }
  }

  updateProducts() {
    if (!this.filter) return;
    this.filterService.filters.productTypeIds = this.filter.selectedOptions.selected.map((product: MatListOption) => product.value.id);
    this.filterService.filters.pageNumber = 0;
    this.productService.getProductsEventSubject.next(null);
  }

  clearFilters() {
    this.filterService.clearFilters();
    this.updateProducts();
  }

  changeSort(value: string) {
    this.filterService.filters.sortBy = value;
    this.filterService.filters.pageNumber = 0;
    this.productService.getProductsEventSubject.next(null);
  }

  changeSortOrder() {
    if (this.filterService.filters.sortOrder === '' || this.filterService.filters.sortOrder === 'asc') {
      this.filterService.filters.sortOrder = 'desc';

    } else if (this.filterService.filters.sortOrder === 'desc') {
      this.filterService.filters.sortOrder = 'asc';
    }
    this.filterService.filters.pageNumber = 0;
    this.productService.getProductsEventSubject.next(null);
  }
}

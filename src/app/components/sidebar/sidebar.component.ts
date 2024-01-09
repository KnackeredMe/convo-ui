import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {IProductType} from "../../models/product-type";
import {MatListOption} from "@angular/material/list";
import {FilterService} from "../../services/filter.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public productTypes: IProductType[] | undefined;
  @ViewChild('filter') filter: any;

  constructor(private productService: ProductService,
              public filterService: FilterService) { }

  ngOnInit(): void {
    this.productService.getProductTypes().subscribe({
        next: res => {
          this.productTypes = res;
        }
      }
    )
    this.filterService.clearFiltersSubject.subscribe({
      next: () => {
        this.filter.deselectAll();
      }
    })
    this.filterService.updateFiltersSubject.subscribe({
      next: () => {
        this.filter.deselectAll();
        const optionsToSelect = this.filter.options.filter((option: any) => {
          return this.filterService.filters.productTypeIds?.includes(option.value.id);
        });
        this.filter.selectedOptions.select(...optionsToSelect);
      }
    })
  }

  updateProducts() {
    if (!this.filter) return;
    this.filterService.filters.productTypeIds = this.filter.selectedOptions.selected.map((product: MatListOption) => product.value.id);
    this.productService.getProductsEventSubject.next(null);
  }

  clearFilters() {
    this.filterService.clearFilters();
    this.updateProducts();
  }

}

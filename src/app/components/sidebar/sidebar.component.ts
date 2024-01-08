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
  }

  updateProducts() {
    if (!this.filter) return;
    this.filterService.filters.productTypeIds = this.filter.selectedOptions.selected.map((product: MatListOption) => product.value.id);
    this.filterService.searchEventSubject.next();
  }

  clearFilters() {
    this.filterService.clearFilters();
    this.updateProducts();
  }

}

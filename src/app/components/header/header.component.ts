import { Component, OnInit } from '@angular/core';
import {FilterService} from "../../services/filter.service";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public searchText: string = '';
  constructor(private filterService: FilterService,
              private productService: ProductService) { }

  ngOnInit(): void {
    this.filterService.clearFiltersSubject.subscribe({
      next: () => {
        this.searchText = '';
      }
    })
  }

  search() {
    this.filterService.filters.productNameSearch = this.searchText;
    this.productService.getProductsEventSubject.next(null);
  }

}

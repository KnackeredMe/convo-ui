import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {IProduct} from "../../models/product";
import {FilterService} from "../../services/filter.service";
import {Router} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {

  constructor(
    public productService: ProductService,
    public filterService: FilterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getProductsEventSubject.subscribe({
      next: () => {
        this.getProducts();
      }
    })
  }

  getProducts() {
    this.productService.getProducts(this.filterService.filters).subscribe({
      next: (res: IProduct[]) => {
        this.productService.products = res;
      }
    });
  }

  selectProduct(product: IProduct) {
    this.router.navigate(['products', product.name]).then();
  }

  changePage(pageEvent: PageEvent) {
    this.filterService.filters.pageNumber = pageEvent.pageIndex + 1;
    this.productService.getProductsEventSubject.next(null);
  }
}

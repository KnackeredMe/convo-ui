import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {IProduct} from "../../models/product";
import {FilterService} from "../../services/filter.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {

  constructor(
    public productService: ProductService,
    private filterService: FilterService,
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
}

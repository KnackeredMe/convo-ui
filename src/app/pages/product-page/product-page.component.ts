import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {FilterService} from "../../services/filter.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {IProduct} from "../../models/product";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit, OnDestroy {

  public product: IProduct | undefined;
  private productSubscription: Subscription | undefined;
  constructor(private productService: ProductService,
              private filterService: FilterService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params: Params) => {
        if (!this.productService.products) {
          this.filterService.clearFilters();
          this.filterService.filters.productNameSearch = params['name'];
          this.productSubscription = this.productService.getProducts(this.filterService.filters).subscribe({
            next: res => {
              this.productService.products = res;
              this.product = this.productService.products[0];
            }
          });
        } else {
          this.product = this.productService.products.find(product => product.name === params['name']);
        }
      }
    })
  }

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  goBack() {
    this.filterService.clearFilters();
    this.router.navigate(['products']);
  }
}

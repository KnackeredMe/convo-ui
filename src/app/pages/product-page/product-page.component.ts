import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {IProduct} from "../../models/product";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

  public product: IProduct | undefined;
  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params: Params) => {
        if (!this.productService.products) {
          this.productService.getProductById(params['id']).subscribe({
            next: res => {
              this.product = res;
            }
          })
        } else {
          this.product = this.productService.products.find(product => product.id.toString(10) === params['id']);
        }
      }
    })
  }

  goBack() {
    this.router.navigate(['products']).then();
  }
}

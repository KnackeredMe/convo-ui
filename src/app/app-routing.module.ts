import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductsPageComponent} from "./pages/products-page/products-page.component";
import {ProductPageComponent} from "./pages/product-page/product-page.component";

const routes: Routes = [
  {path: 'products', component: ProductsPageComponent},
  {path: 'products/:name', component: ProductPageComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

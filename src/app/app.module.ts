import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from "@angular/material/list";
import { AssistantComponent } from './components/assistant/assistant.component';
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import { ProductPageComponent } from './pages/product-page/product-page.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {CustomPaginator} from "./components/custom-paginator/custom-paginator";
import {MatSelectModule} from "@angular/material/select";
import { SceneContainer } from './components/threejs/scene-container.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsPageComponent,
    SidebarComponent,
    HeaderComponent,
    AssistantComponent,
    ProductPageComponent,
    CustomPaginator,
    SceneContainer
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

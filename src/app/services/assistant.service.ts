import { Injectable } from '@angular/core';
import {catchError} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "./error-handler.service";
import {environment} from "../../environments/environment";
import {IRecognizedFilters} from "../models/recognized-filters";
import {FilterService} from "./filter.service";
import {Router} from "@angular/router";
import {ProductService} from "./product.service";
import { SceneService } from './scene.service';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  private baseUrl: string = environment.baseUrl;
  private speechSynthesis: SpeechSynthesis = window.speechSynthesis;
  private voice: SpeechSynthesisVoice = this.speechSynthesis.getVoices()[17];
  public message: string;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private filterService: FilterService,
    private productService: ProductService,
    private router: Router,
    private scene: SceneService
  ) { }

  public recognition(query: string) {
    return this.http.post<any[]>( this.baseUrl + 'recognition', query)
      .pipe(catchError(this.errorHandler.handleError));
  }

  public processResponse(response: IRecognizedFilters[]) {
    let message;
    let isSuccess;
    let navigate = false;
    let updateFilters = false;
    response.forEach(filter => {
      const value = (filter.value).replace(/\s/g, "");
      const valueNum = Math.abs(parseInt(value, 10));
      switch (filter.key) {
        case 'error':
          isSuccess = false;
          message = filter.value;
          break;
        case 'exit':
          if (this.router.url === '/products') {
            isSuccess = false;
            message = "Sorry, but you can not exit from the product list page. Please try requesting something else."; break;
          }
          this.filterService.clearFilters();
          this.router.navigate(['products']).then();
          isSuccess = true;
          message = "Here you are.";
          break;
        case 'item':
          if (this.router.url === '/product') {
            isSuccess = false;
            message = "Sorry, but you can not select items on product page. Please try requesting something else.";
            break;
          }
          if (!this.productService.products?.length) {
            isSuccess = false;
            message = "Sorry, no items meet search or filter condition so I can not choose any."; break;
          }
          const minItems = 1;
          const maxItems = this.productService.products.length;

          if (value === 'last') {
            isSuccess = true;
            message = `Opening item ${maxItems}.`;
            this.router.navigate(['products', this.productService.products[maxItems - 1].name]).then();
            break;
          }
          if (isNaN(valueNum)) {
            isSuccess = false;
            message = `Sorry, but you requested to open an item that doesn't exist. There are only ${maxItems} items on the page`; break;
          }
          if (valueNum >= minItems && valueNum <= maxItems) {
            isSuccess = true;
            message = `Opening item ${valueNum}.`;
            this.router.navigate(['products', this.productService.products[valueNum - 1].name]).then();
            break;
          }
          isSuccess = false;
          message = "Sorry, something went wrong. Please try again."; break;
        case 'page':
          const minPages = 1;
          const maxPages = this.productService.products?.length ? this.productService.products[0].pagesTotal : 0;
          if (maxPages === 0) {
            isSuccess = false;
            message = "Sorry, I can not switch pages as there are no items that meet search or filter conditions."; break;
          }
          if (value === 'last') {
            isSuccess = true;
            message = `Opening page ${maxPages}.`;
            this.filterService.filters.pageNumber = maxPages;
            navigate = true;
            break;
          }
          if (this.productService.products && (value.charAt(0) === '+' && this.filterService.filters.pageNumber + valueNum > this.productService.products[0].pagesTotal) ||
            (value.charAt(0) === '-' && this.filterService.filters.pageNumber - valueNum < 0)) {
              isSuccess = false;
            message = `Sorry, but you requested to open a page that doesn't exist. There are only ${maxPages} pages for this search conditions`; break;
          }
          if (value.charAt(0) === '+' && this.productService.products && this.filterService.filters.pageNumber + valueNum <= this.productService.products[0].pagesTotal) {
            this.filterService.filters.pageNumber += this.filterService.filters.pageNumber === 0 ? valueNum + 1 : valueNum;
            isSuccess = true;
            message = `Going ${valueNum} pages forward`;
            navigate = true;
            break;
          }
          if (value.charAt(0) === '-' && this.productService.products && this.filterService.filters.pageNumber - valueNum > 0) {
            this.filterService.filters.pageNumber -= valueNum;
            isSuccess = true;
            message = `Going ${valueNum} pages backwards`;
            navigate = true;
            break;
          }
          if (valueNum >= minPages && valueNum <= maxPages) {
            isSuccess = true;
            message = `Opening page ${valueNum}.`;
            this.filterService.filters.pageNumber = valueNum;
            navigate = true;
            break;
          }
          isSuccess = false;
          message = "Sorry, something went wrong. Please try again."; break;
        case 'search':
          this.filterService.filters.productNameSearch = filter.value;
          isSuccess = true;
          message = "Here you are.";
          navigate = true;
          break;
        case 'sort':
          if (filter.value === '') {
            this.filterService.filters.sortBy = 'name';
            this.filterService.filters.sortOrder = 'asc';
            isSuccess = true;
            message = "Here you are.";
            navigate = true;
            break;
          }
          const sortArr = filter.value.trim().split(" ");
          if (sortArr.length === 2) {
            this.filterService.filters.sortBy = sortArr[0];
            this.filterService.filters.sortOrder = sortArr[1];
            isSuccess = true;
            message = "Here you are.";
            navigate = true;
            break;
          }
          isSuccess = false;
          message = "Sorry, something went wrong. Please try again."; break;
        case 'filter':
          updateFilters = true;
          if (value === "") {
            this.filterService.filters.productTypeIds = [];
            isSuccess = true;
            message = "Here you are.";
            navigate = true;
            break;
          }
          const numArray: number[] = [];
          const filterArr = value.split(",");
          filterArr.forEach(el => {
            const id = parseInt(el, 10);
            if (isNaN(id)) {
              isSuccess = false;
              message = "Sorry, something went wrong. Please try again.";
              return;
            }
            numArray.push(id);
          });
          this.filterService.filters.productTypeIds = numArray;
          navigate = true;
          isSuccess = true;
          message = "Here you are.";
          break;
        default:
          isSuccess = false;
          message = "Sorry, something went wrong. Please try again.";
      }
    })
    if(isSuccess) {
      this.scene.runAnimation('Success');
    } else {
      this.scene.runAnimation('Fail');
    }
    if (message) {
      this.message = message;
      this.announceMessage(message);
    }
    if (navigate) {
      if (this.router.url !== '/products') {
        this.router.navigate(['products']).then();
      }
      if (updateFilters) {
        this.filterService.updateFiltersSubject.next();
      } else {
        this.productService.getProductsEventSubject.next(null);
      }
    }
  }

  public announceMessage(message: string) {
    const speechUtterance = new SpeechSynthesisUtterance(message);
    speechUtterance.onend = () => {
      timer(2000).subscribe(() => {
        this.scene.runAnimation('Idle');
      })
    }
    speechUtterance.voice = this.voice;
    speechUtterance.pitch = 5;
    speechUtterance.rate = 1.3;
    this.speechSynthesis.speak(speechUtterance);
  }
}

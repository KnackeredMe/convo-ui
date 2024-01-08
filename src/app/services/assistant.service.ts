import { Injectable } from '@angular/core';
import {catchError} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "./error-handler.service";
import {environment} from "../../environments/environment";
import {IRecognizedFilters} from "../models/recognized-filters";
import {FilterService} from "./filter.service";
import {Router} from "@angular/router";
import {ProductService} from "./product.service";

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  private baseUrl: string = environment.baseUrl;
  private speechSynthesis: SpeechSynthesis = window.speechSynthesis;
  private voice: SpeechSynthesisVoice = this.speechSynthesis.getVoices()[17];

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private filterService: FilterService,
    private productService: ProductService,
    private router: Router
  ) { }

  public recognition(query: string) {
    return this.http.post<any[]>( this.baseUrl + 'recognition', query)
      .pipe(catchError(this.errorHandler.handleError));
  }

  public processResponse(response: IRecognizedFilters[]) {
    response.forEach((filter, index) => {
      let message;
      switch (filter.key) {
        case 'error':
          message = filter.value; break;
        case 'exit':
          if (this.router.url === '/products') {
            message = "Sorry, but you can not exit from the product list page. Please try requesting something else."; break;
          }
          this.filterService.clearFilters();
          this.router.navigate(['products']).then();
          message = "Here you are."; break;
        case 'item':
          if (this.router.url === '/product') {
            message = "Sorry, but you can not select items on product page. Please try requesting something else."; break;
          }
          if (!this.productService.products?.length) {
            message = "Sorry, no items meet search or filter condition so I can not choose any."; break;
          }
          const min = 1;
          const max = this.productService.products.length;
          const value = (filter.value).replace(/\s/g, "");
          const valueNum = parseInt(value, 10);
          if (value === 'last') {
            message = `Opening item ${max}.`;
            this.router.navigate(['products', this.productService.products[max - 1].name]).then();
            break;
          }
          if (isNaN(valueNum)) {
            message = `Sorry, but you requested to open an item that doesn't exist. There are only ${max} items on the page`; break;
          }
          if (valueNum >= min && valueNum <= max) {
            message = `Opening item ${valueNum}.`;
            this.router.navigate(['products', this.productService.products[valueNum - 1].name]).then();
            break;
          }
          message = "Sorry, something went wrong. Please try again."; break;
        case 'page':
          //TODO
        case 'search':
          //TODO
        case 'sort':
          //TODO
        case 'filter':
          //TODO

      }
      if (message) {
        this.announceMessage(message);
      }
    })
  }

  public announceMessage(message: string) {
    const speechUtterance = new SpeechSynthesisUtterance(message);
    speechUtterance.voice = this.voice;
    speechUtterance.pitch = 5;
    speechUtterance.rate = 1.3;
    this.speechSynthesis.speak(speechUtterance);
  }
}

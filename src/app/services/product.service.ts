import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {ErrorHandlerService} from "./error-handler.service";
import {environment} from "../../environments/environment";
import {IProductFilters} from "../models/product-filters";
import {IProduct} from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = environment.baseUrl;
  public products: IProduct[] | undefined;
  public getProductsEventSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getProducts(filters: IProductFilters): Observable<any[]> {
    const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    return this.http.post<any[]>( this.baseUrl + 'products', filters, {headers: headers})
      .pipe(catchError(this.errorHandler.handleError));
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>( this.baseUrl + 'products/' + id)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getProductTypes(): Observable<any[]> {
    return this.http.get<any[]>( this.baseUrl + 'prodtypes')
      .pipe(catchError(this.errorHandler.handleError));
  }
}

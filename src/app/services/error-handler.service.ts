import { Injectable } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  public handleError(error: HttpErrorResponse | any): Observable<any> {
    return throwError(error);
  }
}

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {ErrorService} from '../services/error.service';
import {ErrorResponse} from '@app/shared/models/error-response';

/**
 * Interceptor for managing the HTTP errors.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  /**
   * Constructor
   */
  constructor(private errorService: ErrorService) { }

  /**
   * This function intercepts the http request and do its job on the request
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Manage errors
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event;
        }
      }),
      catchError((errorHTTP: HttpErrorResponse) => {
        const data: ErrorResponse = {
          name: errorHTTP && errorHTTP.name ? errorHTTP.name : '',
          message: errorHTTP && errorHTTP.message ? errorHTTP.message : '',
          reason: errorHTTP && errorHTTP.statusText ? errorHTTP.statusText : '',
          status: errorHTTP.status
        };

        // const data: ErrorResponse = {
        //   reason: errorHTTP && errorHTTP.statusText ? errorHTTP.statusText : '',
        //   status: errorHTTP.status
        // };
        this.errorService.generateAlert(data);
        return throwError(errorHTTP);
      }));
  }

}

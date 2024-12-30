import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';

import { Observable } from 'rxjs';
import {retry} from 'rxjs/operators';

/**
 * Interceptor that allows to retry three times to execute the request if there are a problem.
 */
@Injectable()
export class RetryInterceptor implements HttpInterceptor {

  /**
   * Constructor
   */
  constructor() { }

  /**
   * This function intercepts the http request and do its job on the request
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Manage retry
    return next.handle(request).pipe(retry(3)); // Retry up to 3 times before failing
  }

}

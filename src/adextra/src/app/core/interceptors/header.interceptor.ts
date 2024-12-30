import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable} from 'rxjs';
/**
 * Interceptor for managing the adding of the common headers.
 */
@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  /**
   * This function intercepts the http request and do its job on the request
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Add configuration for accept and get data with json format
    if (!request.headers.has('Content-Type')) {
      if (request.url.includes('/upload') !== true) {
        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
      }
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request);
  }
}

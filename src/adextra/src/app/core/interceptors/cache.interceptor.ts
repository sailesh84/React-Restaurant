import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {CacheService} from '../services/cache.service';

/**
 * Interceptor for managing the data cache.
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  /**
   * Constructor
   */
  constructor(private cacheService: CacheService) { }

  /**
   * This function intercepts the http request and do its job on the request
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Nothing to do if the method is different of the GET method
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    // Reset cache if there are the reset-cache header
    if (request.headers.get('reset-cache')) {
      this.cacheService.delete(request.url);
    }

    // Apply cache only for the GET requests
    const cachedResponse = this.cacheService.get(request.url);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // Returns the modified request
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.set(request.url, event);
        }
      })
    );
  }
}

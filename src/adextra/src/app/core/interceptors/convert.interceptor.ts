import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { camelCase, mapKeys } from 'lodash';

/**
 * Interceptor for managing the JSON/JS conventions on the responses.
 */
@Injectable()
export class ConvertInterceptor implements HttpInterceptor {

  /**
   * This function intercepts the http request and do its job on the request
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     // If the backend doesn’t care about JSON/JS conventions we can use an interceptor to rename all the property names to camelCase.
    // ex : Title -> title
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const camelCaseObject = mapKeys(event.body, (v, k) => camelCase(k));
          return event.clone({body: camelCaseObject});
        }
      })
    );
  }
}

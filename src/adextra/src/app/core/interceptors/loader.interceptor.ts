import {Injectable, Injector} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoaderService} from '../services/loader.service';
import {delay, finalize} from 'rxjs/operators';

/**
 * Interceptor that allows to indicate if the loader must be showed or hidden.
 */
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  /**
   * Number of done request. We show the loader from one request and we hide it when there is no more requests.
   */
  requestCounter = 0;

  /**
   * Constructor
   */
  constructor(private injector: Injector) {}

  /**
   * This function intercepts the http request and do its job on the request
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loaderService = this.injector.get(LoaderService);

    this.requestCounter = Math.max(this.requestCounter, 0) + 1; // We increment the number of request
    if (this.requestCounter === 1) {
      loaderService.show(); // We show the loader from the first request
    }

    return next.handle(request).pipe(
      delay(0.001), // 0.001ms
      finalize(() => {
        this.requestCounter = Math.max(this.requestCounter, 1) - 1; // When a request finished, we remove it of the number of requests
        if (this.requestCounter === 0) { // We hide the loader when all requests finished
          loaderService.hide();
        }
      })
    );
  }
}

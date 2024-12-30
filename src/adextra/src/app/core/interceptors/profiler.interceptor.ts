import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {ProfilerService} from '@app/core/services/profiler.service';
import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

/**
 * Interceptor for the dev mode only. It indicate the time for each request.
 */
@Injectable()
export class ProfilerInterceptor implements HttpInterceptor {
  /**
   * Constructor
   */
  constructor(private profilerService: ProfilerService) {}

  /**
   * This function intercepts the http request and do its job on the request
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.profilerService.getIsProductionMode() === false) {
      console.warn('ProfilerInterceptor');

      const started = Date.now();
      let ok: string;

      return next.handle(req).pipe(
        tap(
          // Succeeds when there is a response; ignore other events
          (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              ok = 'succeeded';
            }
          },
          // Operation failed; error is an HttpErrorResponse
          error => (ok = 'failed')
        ),
        // Log when response observable either completes or errors
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
          this.profilerService.add(msg);
        })
      );
    }
    return next.handle(req);
  }
}

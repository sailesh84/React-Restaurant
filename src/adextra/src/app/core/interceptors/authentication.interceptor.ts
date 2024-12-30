import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, filter, finalize, map, switchMap, take, tap} from 'rxjs/operators';
import {AuthenticationService} from '@app/core/services/authentication.service';
import {Jwt} from '@app/shared/models/jwt';
import {Router} from '@angular/router';
import {ErrorResponse} from '@app/shared/models/error-response';
import {ToastrService} from 'ngx-toastr';

/**
 * Interceptor for managing the token user im the http request.
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  /**
   * NAme of header param in the request
   */
  private authHeader = 'Authorization';

  /**
   * Token to put in the previous header param
   */
  private token: Jwt;

  /**
   * Indicator that allows to know if the token is refreshed or not
   */
  // private refreshTokenInProgress = false;

  /**
   * Listener on the redoing of the token
   */
  // private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  /**
   * Constructor
   */
  constructor(private authService: AuthenticationService, private router: Router, private toastrService: ToastrService) {}

  /**
   * This function intercepts the http request and do its job on the request
   */
  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    if (req.url.includes('authenticate')) {
      return next.handle(req);
    }

    req = this.addAuthenticationToken(req);
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (this.authService.jwtExpired() === false) {
            return event;
          }
        }
      }),
      catchError((errorHTTP: HttpErrorResponse) => {
        if (errorHTTP && errorHTTP.status === 401) {
          this.authService.logout(true);
          localStorage.clear();
          this.router.navigate(['/login'], { queryParams: { returnUrl: '/' }});
        } else {
          return throwError(errorHTTP);
        }
      }));


    // return next.handle(req).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     if (error && error.status === 401) {
    //       // 401 errors are most likely going to be because we have an expired token that we need to refresh.
    //       if (this.refreshTokenInProgress) {
    //         // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
    //         // which means the new token is ready and we can retry the request again
    //         return this.refreshTokenSubject.pipe(
    //           filter(result => result !== null),
    //           take(1),
    //           switchMap(() => next.handle(this.addAuthenticationToken(req)))
    //         );
    //       } else {
    //         this.refreshTokenInProgress = true;
    //
    //         // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
    //         this.refreshTokenSubject.next(null);
    //
    //         return this.refreshAccessToken().pipe(
    //           switchMap((success: boolean) => {
    //             this.refreshTokenSubject.next(success);
    //             return next.handle(this.addAuthenticationToken(req));
    //           }),
    //           // When the call to refreshToken completes we reset the refreshTokenInProgress to false
    //           // for the next time the token needs to be refreshed
    //           finalize(() => (this.refreshTokenInProgress = false))
    //         );
    //       }
    //     } else {
    //       return throwError(error);
    //     }
    //   })
    // );
  }

  /**
   * This function launchs the redoing of the token
   */
  // private refreshAccessToken(): Observable<any> {
  //   return of('secret token'); // @TODO: ADD ROUTE ON SERVER SIDE FOR REFRESH TOKEN
  // }

  /**
   * This function add the token in the header of the request
   */
  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    if (this.authService.isLogged) {
      this.token = JSON.parse(localStorage.getItem('user-token'));
      if (this.token.expiresIn <= Date.now() + (1000 * 60 * 5)) {
        setTimeout(() => {
          this.authService.logout(true);
        }, 10000);
        this.toastrService.warning('Your session has expired. You will be logged out in 10 seconds. Please login again to continue ' +
          'working.', 'Session expired', {closeButton: true, positionClass: 'toast-top-full-width', timeOut: 10000});
        return request;
      }
      // console.log(this.token, 'expires at ', new Date(this.token.expiresIn).toUTCString());
      return request.clone({
        headers: request.headers.set(this.authHeader, `${this.token.tokenType} ${this.token.accessToken}`)
      });
    }

    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    if (!this.token) {
      return request;
    }
    // If you are calling an outside domain then do not add the token.
    if (!request.url.match(/localhost/) && !request.url.includes('10.146.18.139')
      && !request.url.includes('127.0.0.1')) {
      return request;
    }

    return request;
  }
}

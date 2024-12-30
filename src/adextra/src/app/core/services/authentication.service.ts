import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, share, takeUntil } from 'rxjs/operators';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { Log } from '@app/shared/models/log';
import { Login } from '@app/shared/models/login';
import { HttpResponse } from '@app/shared/models/http-response';
import { MsalService } from '@azure/msal-angular';

/**
 * This service is used to manage the user authentication of the users.
 */
@Injectable()
export class AuthenticationService implements OnDestroy {
  /**
   * This variable allows to listen the value change. We can know is the user is connected or not.
   */
  private isLoggedInSubject: BehaviorSubject<boolean>;

  /**
   * This variable contains the current value of the previous variable.
   */
  public isLoggedIn: Observable<boolean>;

  private isLogsDead$ = new Subject();

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * userSharingService allows to keep in memory the current user.
   * logsService allows to manage the action on the log objects.
   */
  constructor(private http: HttpClient, private userSharingService: UserSharingService, private logsService: LogsService,
    private authService: MsalService) {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('user-isLoggedIn'));
    this.isLoggedIn = this.isLoggedInSubject.asObservable().pipe(share());
  }

  /**
   * This method is a getter for know if the current user is logged in or logged out.
   */
  public get isLogged(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * This method allows to know if the current jwt is expired or not.
   */
  jwtExpired(): boolean {
    const token = JSON.parse(localStorage.getItem('user-token') || '{}');
    if (!token.expiresIn) {
      return true;
    } else {
      const diff = token.expiresIn - Date.now();
      return diff <= 0;
    }
  }

  /**
   * This method allows to a user to log in.
   *
   * The parameter `credentials` is an object that contains th username and the password for logging in.
   *
   * It returns an observable of type `HttpResponse`.
   */
  login(credentials: any): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}authenticate`, credentials).pipe(
      map((response => {
        if (response && response.success === true) {
          this.userSharingService.updateUser(response.data);

          localStorage.setItem('user-uid', response.data._id);
          localStorage.setItem('user-email', response.data.email);
          localStorage.setItem('user-isLoggedIn', 'true');
          localStorage.setItem('user-token', JSON.stringify(response.data.token));

          const log: Log = {
            _id: '-1',
            date: Date.now(),
            userAgent: '',
            severity: 0,
            user: (response.data.firstname + ' ' + response.data.lastname).trim(),
            sourceIP: '',
            message: 'Connection succeeded'
          };
          this.saveLog(log);

          this.isLoggedInSubject.next(true);
        }
        return response;
      }))
    );
  }

  /**
   * This method allows to a user to log out.
   */
  logout(sessionExpiration: boolean = false): void {
    if (sessionExpiration === false) {
      const user = this.userSharingService.currentUser;
      const log: Log = {
        _id: '-1',
        date: Date.now(),
        userAgent: '',
        severity: 0,
        user: (user.firstname + ' ' + user.lastname).trim(),
        sourceIP: '',
        message: 'Disconnection succeeded'
      };
      this.saveLog(log);
      this.userSharingService.updateUser(null);
    }

    localStorage.removeItem('user-uid');
    localStorage.removeItem('user-email');
    localStorage.removeItem('user-isLoggedIn');
    localStorage.removeItem('user-token');
    localStorage.clear();

    this.authService.logout();

    this.isLoggedInSubject.next(false);
  }

  /**
    * This method allows to a user to log out.
    *
    * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
    *
    * It returns an observable of type `HttpResponse`.
  */
  logoutNew(reset: boolean = false, sessionExpiration: boolean = false): Observable<HttpResponse> {

    
    let headers = new HttpHeaders();
    let token = JSON.parse(localStorage.getItem('user-token'));
    headers = headers.set('Authorization', `Bearer ${token.accessToken}`);

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.post<HttpResponse>(`${environment.api_server}authenticate/logout/`, null, { headers }).pipe(
      map((response => {
        if (response && response.success === true) {
          if (sessionExpiration === false) {
            const user = this.userSharingService.currentUser;
            const log: Log = {
              _id: '-1',
              date: Date.now(),
              userAgent: '',
              severity: 0,
              user: (user.firstname + ' ' + user.lastname).trim(),
              sourceIP: '',
              message: 'Disconnection succeeded'
            };
            this.saveLog(log);
            this.userSharingService.updateUser(null);
          }

          localStorage.removeItem('user-uid');
          localStorage.removeItem('user-email');
          localStorage.removeItem('user-isLoggedIn');
          localStorage.removeItem('user-token');
          localStorage.clear();

          this.isLoggedInSubject.next(false);
        }
        this.authService.logout();
        return response;
      }))
    );
  }

  /**
   * This method allows to save in the database the action done by the user.
   * The parameter `log` represents the log object to save in database.
   */
  saveLog(log: Log): void {
    this.logsService.addLog(log).pipe(takeUntil(this.isLogsDead$)).subscribe();
  }

  ngOnDestroy(): void {
    this.isLogsDead$.next();
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {Log} from '@app/shared/models/log';
import {share} from 'rxjs/operators';

/**
 * This service is used to manage different actions on the log objects.
 */
@Injectable()
export class LogsService {
  /**
   * This variable represents the `log` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('log').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all logs from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `any`.
   */
  getLogs(reset: boolean = false): Observable<any> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<any>(`${environment.api_server}logs/`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a log.
   *
   * The parameter `log` represents the log to add in database.
   *
   * It returns an observable of type `any`.
   */
  addLog(log: Log): Observable<any> {
    let headers = new HttpHeaders();
    let token = JSON.parse(localStorage.getItem('user-token'));
    headers = headers.set('Authorization', `Bearer ${token.accessToken}`);

    return this.http.post<any>(`${environment.api_server}logs/`, log, { headers });
  }

}

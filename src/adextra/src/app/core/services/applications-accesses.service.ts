import { Injectable } from '@angular/core';
import {share} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {HttpResponse} from '@app/shared/models/http-response';
import {environment} from '@env/environment';
import {Client} from '@app/shared/models/client';
import {ApplicationAccess} from '@app/shared/models/application-access';

@Injectable()
export class ApplicationsAccessesService {
  /**
   * This variable represents the `applicationAccess` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('applicationAccess').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all applications accesses from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getApplicationsAccesses(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}applications-accesses/`, { headers }).pipe(share());
  }

  /**
   * This method allows to add an application access.
   *
   * The parameter `applicationAccess` represents the application access to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addApplicationAccess(applicationAccess: ApplicationAccess): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}applications-accesses/`, applicationAccess);
  }

  /**
   * This method allows to update an application access.
   *
   * The parameter `applicationAccess` represents the application access to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateApplicationAccess(applicationAccess: ApplicationAccess): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}applications-accesses/${applicationAccess._id}`, applicationAccess);
  }

  /**
   * This method allows to delete an application access.
   *
   * The parameter `id` represents the application access to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteApplicationAccess(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}applications-accesses/${id}`);
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {Request} from '@app/shared/models/request';
import {HttpResponse} from '@app/shared/models/http-response';
import {share} from 'rxjs/operators';
import {Email} from '@app/shared/models/email';

/**
 * This service is used to manage different actions on the request objects.
 */
@Injectable()
export class RequestsService {
  /**
   * This variable represents the `request` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('request').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all requests from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getRequests(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}requests/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get all requests not closed from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getNotClosedRequests(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}requests/not-close/true`, { headers }).pipe(share());
  }

  /**
   * This method allows to get all requests for a given user from the server.
   *
   * The parameter `email` is the user email whose we want get the requests list.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getRequestsByEmail(email: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}requests/${email}`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a request.
   *
   * The parameter `request` represents the request to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addRequest(request: Request): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}requests/`, request);
  }

  /**
   * This method allows to add a request.
   *
   * The parameter `request` represents the request to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
   createRequest(request: Request): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}requests/create-request/`, request);
  }

  /**
   * This method allows to send a email.
   *
   * The parameter `message` represents the email to send.
   *
   * It returns an observable of type `HttpResponse`.
   */
  sendMail(message: Email) {
    return this.http.post<HttpResponse>(`${environment.api_server}requests/send-mail`, message);
  }

  /**
   * This method allows to update a request.
   *
   * The parameter `request` represents the request to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateRequest(request: Request): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}requests/${request._id}`, request);
  }

  /**
   * This method allows to delete a request.
   *
   * The parameter `id` represents the request to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteRequest(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}requests/${id}`);
  }
}

import { Injectable } from '@angular/core';
import {share} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {HttpResponse} from '@app/shared/models/http-response';
import {environment} from '@env/environment';
import {Client} from '@app/shared/models/client';

@Injectable()
export class ClientsService {
  /**
   * This variable represents the `client` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('client').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all clients from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getClients(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}clients/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get one client from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getClient(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}clients/${id}`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a client.
   *
   * The parameter `client` represents the client to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addClient(client: Client): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}clients/`, client);
  }

  /**
   * This method allows to update a client.
   *
   * The parameter `client` represents the client to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateClient(client: Client): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}clients/${client._id}`, client);
  }

  /**
   * This method allows to delete a client.
   *
   * The parameter `id` represents the client to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteClient(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}clients/${id}`);
  }
}

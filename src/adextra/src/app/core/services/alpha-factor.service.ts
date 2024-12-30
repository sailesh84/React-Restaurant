import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {environment} from '@env/environment'
import {AlphaFactor} from '@app/shared/models/alpha-factor';
import {HttpResponse} from '@app/shared/models/http-response';
import {share} from 'rxjs/operators';

/**
 * This service is used to manage different actions on the vessel type objects.
 */
 @Injectable()
export class AlphaFactorService {
  /**
   * This variable represents the `alpha-factor` event. We use it for know if the data cache has to be refreshed or not.
   */
   socketEvent = this.socket.fromEvent<any>('alpha-factor').pipe(share());

   /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all alpha-factor from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
   getAlphaFactors(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}alpha-factor/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get a specified alpha-factor from the server.
   *
   * The parameter `id` allows to indicate to the alpha-factor to retrieve.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
   getAlphaFactor(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}alpha-factor/${id}`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a vessel type.
   *
   * The parameter `alpha-factor` represents the vessel type to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
   addAlphaFactor(alphaFactor: AlphaFactor): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}alpha-factor/`, alphaFactor);
  }

  /**
   * This method allows to update a vessel type.
   *
   * The parameter `alpha-factor` represents the vessel type to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
   updateAlphaFactor(alphaFactor: AlphaFactor): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}alpha-factor/${alphaFactor._id}`, alphaFactor);
  }

  /**
   * This method allows to delete a alpha-factor.
   *
   * The parameter `id` represents the alpha-factor to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
   deleteAlphaFactor(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}alpha-factor/${id}`);
  }

  /**
   * This method allows to check server name from the server.
   *
   * The parameter `id` indicates the server name to get from the server.
   *
   * It returns an observable of type `HttpResponse`.
   */
   
   checkAlphaFactor(alphaFactor: AlphaFactor): Observable<HttpResponse> {
     return this.http.post<HttpResponse>(`${environment.api_server}alpha-factor/CheckName`, alphaFactor);
   }

  restartServer(alphaFactor: AlphaFactor): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}alpha-factor/restart`, alphaFactor);
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {Vessel} from '@app/shared/models/vessel';
import {HttpResponse} from '@app/shared/models/http-response';
import {share} from 'rxjs/operators';

/**
 * This service is used to manage different actions on the vessel objects.
 */
@Injectable()
export class VesselsService {
  /**
   * This variable represents the `vessel` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('vessel').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all vessels from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getVessels(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}vessels/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get all vessels that are enabled from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getEnabledVessels(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}vessels/enabled/true`, { headers }).pipe(share());
  }

  /**
   * This method allows to get one vessel from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getVessel(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}vessels/${id}`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a vessel.
   *
   * The parameter `vessel` represents the vessel to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addVessel(vessel: Vessel): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}vessels/`, vessel);
  }

  /**
   * This method allows to update a vessel.
   *
   * The parameter `vessel` represents the vessel to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateVessel(vessel: Vessel): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}vessels/${vessel._id}`, vessel);
  }

  /**
   * This method allows to delete a vessel.
   *
   * The parameter `id` represents the vessel to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteVessel(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}vessels/${id}`);
  }
}

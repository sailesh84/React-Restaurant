import { Injectable } from '@angular/core';
import {share} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {HttpResponse} from '@app/shared/models/http-response';
import {environment} from '@env/environment';
import {Region} from '@app/shared/models/region';

/**
 * This service is used to manage different actions on the regions objects.
 */
@Injectable()
export class RegionsService {
  /**
   * This variable represents the `region` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('region').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all regions from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getRegions(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}regions/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get one region from the server.
   *
   * The parameter `id` allows to indicate to the region to retrieve.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getRegion(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}regions/${id}`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a region.
   *
   * The parameter `region` represents the region to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addRegion(region: Region): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}regions/`, region);
  }

  /**
   * This method allows to update a region.
   *
   * The parameter `region` represents the region to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateRegion(region: Region): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}regions/${region._id}`, region);
  }

  /**
   * This method allows to delete a region.
   *
   * The parameter `id` represents the region to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteRegion(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}regions/${id}`);
  }
}

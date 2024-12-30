import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {VesselType} from '@app/shared/models/vessel-type';
import {HttpResponse} from '@app/shared/models/http-response';
import {share} from 'rxjs/operators';

/**
 * This service is used to manage different actions on the vessel type objects.
 */
@Injectable()
export class VesselsTypesService {
  /**
   * This variable represents the `vessel-type` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('vessel-type').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all vessels types from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getVesselTypes(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}vessel-types/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get a specified vessel type from the server.
   *
   * The parameter `id` allows to indicate to the vessel type to retrieve.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getVesselType(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}vessel-types/${id}`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a vessel type.
   *
   * The parameter `vesselType` represents the vessel type to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addVesselType(vesselType: VesselType): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}vessel-types/`, vesselType);
  }

  /**
   * This method allows to update a vessel type.
   *
   * The parameter `vesselType` represents the vessel type to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateVesselType(vesselType: VesselType): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}vessel-types/${vesselType._id}`, vesselType);
  }

  /**
   * This method allows to delete a vessel type.
   *
   * The parameter `id` represents the vessel type to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteVesselType(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}vessel-types/${id}`);
  }
}

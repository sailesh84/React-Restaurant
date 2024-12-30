import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { WebSpectrum } from '@app/shared/models/web-spectrum';
import { HttpResponse } from '@app/shared/models/http-response';
import { share } from 'rxjs/operators';

/**
 * This service is used to manage different actions on the WebSpectrum objects.
 */
@Injectable()
export class WebSpectrumService {
  /**
   * This variable represents the `WebSpectrum` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('wavespectras').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all wavespectras from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getWaveSpectras(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}wavespectras/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get a wavespectra from the server.
   *
   * The parameter `id` represents the wavespectra to get from the server.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getWaveSpectra(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}wavespectras/${id}`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a wavespectra.
   *
   * The parameter `wavespectra` represents the wavespectra to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addWaveSpectra(wavespectra: WebSpectrum): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}wavespectras/`, wavespectra);
  }

  /**
   * This method allows to update a wavespectra.
   *
   * The parameter `wavespectra` represents the forecaster to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateWaveSpectra(wavespectra: WebSpectrum): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}wavespectras/${wavespectra._id}`, wavespectra);
  }

  /**
   * This method allows to delete a wavespectra.
   *
   * The parameter `id` represents the wavespectra to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteWaveSpectra(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}wavespectras/${id}`);
  }
}

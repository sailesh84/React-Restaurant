import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CurrentWave } from '@app/shared/models/current-wave';
import { Forecaster } from '@app/shared/models/forecaster';
import { HttpResponse } from '@app/shared/models/http-response';
import { share } from 'rxjs/operators';


/**
 * This service is used to manage different actions on the forecaster objects.
 */
@Injectable()
export class CurrentWaveService {
    /**
  * This variable represents the `forecaster` event. We use it for know if the data cache has to be refreshed or not.
  */
    socketEvent = this.socket.fromEvent<any>('forecaster').pipe(share());

    /**
     * Constructor
     * http represents the module HttpClient. Indeed, this module allows to do calls on an API
     * socket represents the client connection to the server (socket part)
     */
    constructor(private http: HttpClient, private socket: Socket) { }

    /**
   * This method allows to get all forecasters from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
    getForecasters(reset: boolean = false): Observable<HttpResponse> {
        let headers = new HttpHeaders();

        if (reset) {
            headers = headers.set('reset-cache', 'true');
        }
        return this.http.get<HttpResponse>(`${environment.api_server}forecasters/`, { headers }).pipe(share());
    }

    /**
   * This method allows to get a forecaster from the server.
   *
   * The parameter `id` represents the forecaster to get from the server.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
    getForecaster(id: string, reset: boolean = false): Observable<HttpResponse> {
        let headers = new HttpHeaders();

        if (reset) {
            headers = headers.set('reset-cache', 'true');
        }
        return this.http.get<HttpResponse>(`${environment.api_server}forecasters/${id}`, { headers }).pipe(share());
    }

    /**
   * This method allows to add a forecaster.
   *
   * The parameter `forecaster` represents the forecaster to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
    addForecaster(forecaster: Forecaster): Observable<HttpResponse> {
        return this.http.post<HttpResponse>(`${environment.api_server}forecasters/`, forecaster);
    }

    /**
   * This method allows to update a forecaster.
   *
   * The parameter `forecaster` represents the forecaster to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
    updateForecaster(forecaster: Forecaster): Observable<HttpResponse> {
        return this.http.put<HttpResponse>(`${environment.api_server}forecasters/${forecaster._id}`, forecaster);
    }

    /**
     * This method allows to delete a forecaster.
     *
     * The parameter `id` represents the forecaster to delete.
     *
     * It returns an observable of type `HttpResponse`.
     */
    deleteForecaster(id: string): Observable<HttpResponse> {
        return this.http.delete<HttpResponse>(`${environment.api_server}forecasters/${id}`);
    }
}
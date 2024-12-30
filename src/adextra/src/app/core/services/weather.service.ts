import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { environment } from '@env/environment';
import { HttpResponse } from '@app/shared/models/http-response';
import { share } from 'rxjs/operators';

/**
 * This service is used to get from the server the weather forecasting.
 */
@Injectable()
export class WeatherService {
  /**
   * This variable represents the `forecast` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('forecast').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all forecasts.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getAllForecasts(reset: boolean) {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(`${environment.api_server}forecasts/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get the last forecast from a forecaster, a project and a vessel.
   *
   * The parameter `forecaster` represents the forecaster who emits the forecast.
   * The parameter `project` represents the project attached to the forecast.
   * The parameter `vessel` represents the vessel attached to the forecast.
   * The parameter `session` represents the session attached to the forecast.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getForecast(forecaster: string, project: string, vessel: string, session: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(
      `${environment.api_server}forecasts/${forecaster}/${session}/${project}/${vessel}`, { headers }
    ).pipe(share());
  }

  /**
   * This method allows to get mock data for fatigue.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getMockFatigueData(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}forecasts/getMockFatigueData/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get all FUGRO forecasts.  TEMPORARY
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
   getAllFugroForecasts(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}forecasts/getdatafromcsvfile/fugro/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get all SATOCEAN forecasts.  TEMPORARY
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
   getAllSatOceanForecasts(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}forecasts/getdatafromcsvfile/satocean`, { headers }).pipe(share());
  }

  /**
   * This method allows to get all StormGeo forecasts.  TEMPORARY
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
   getAllStormGeoForecasts(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}forecasts/getdatafromcsvfile/stormgeo`, { headers }).pipe(share());
  }

  getForecastByYear(forecaster: string, year: number, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(
      `${environment.api_server}forecasts/getForecastByYear/${forecaster}/${year}`, { headers }
    ).pipe(share());
  }

  /**
   * This method allows to get the last forecasts from a project and a vessel.
   *
   * The parameter `project` represents the project attached to the forecast.
   * The parameter `vessel` represents the vessel attached to the forecast.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getForecastsWithoutForecaster(project: string, vessel: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(`${environment.api_server}forecasts/last/${project}/${vessel}`, { headers }).pipe(share());
  }

  getForecastsToCompare(
    forecaster1: string, forecaster2: string, project: string, vessel: string, reset: boolean = false
  ): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(
      `${environment.api_server}forecasts/compare/${forecaster1}/${forecaster2}/${project}/${vessel}`,
      { headers }
    ).pipe(share());
  }

  /**
   * This method allows to get the last forecasts for all pair fields / vessels from the server.
   *
   * The parameter `projects` represents the projects associated to forecasts.
   * The parameter `vessels` represents the vessels associated to forecasts.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getLastForecastsForSelectedFieldsAndVessels(projects: string, vessels: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(`${environment.api_server}forecasts/last/${projects}/${vessels}`, { headers }).pipe(share());
  }

  // This method is being used in "Weather Interpreter" tab
  getWeatherInterpreter(projects: string, vessels: string, productTypeId: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(`${environment.api_server}weather-interpreter/${projects}/${vessels}/${productTypeId}`, { headers }).pipe(share());
  }

  // This method is being used in the download pdf section in "forecasts" tab
  getForecastForGraph(forecasterId: string, sessionId: string, schedulerId: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(
      `${environment.api_server}forecasts/getForecastforgraph/${forecasterId}/${sessionId}/${schedulerId}`, { headers }
    ).pipe(share());
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';
import {environment} from '@env/environment';
import {HttpResponse} from '@app/shared/models/http-response';
import {share} from 'rxjs/operators';

/**
 * This service is used to manage different actions on the analysis objects.
 */
@Injectable()
export class AnalysisService {
  /**
   * This variable represents the `analysis` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('analysis').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all analysis from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getAllAnalysis(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(`${environment.api_server}analysis/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get an analysis from the server.
   *
   * The parameter `project` represents the project associated to the analysis.                                                                                                                               
   * The parameter `vessel` represents the vessel associated to the analysis.
   * The parameter `forecaster` represents the forecaster associated to the analysis.
   * The parameter `session` represents the session associated to the analysis.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getAnalysis(project: string, vessel: string, forecaster: string, session: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(
      `${environment.api_server}analysis/${project}/${vessel}/${forecaster}/${session}`, { headers }
      ).pipe(share());
  }

  /**
   * This method allows to get the last analysis for all pair fields / vessels analysis from the server.
   *
   * The parameter `projects` represents the projects associated to analysis.
   * The parameter `vessels` represents the vessels associated to analysis.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getLastAnalysisForSelectedFieldsAndVessels(projects: string, vessels: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(`${environment.api_server}analysis/last/${projects}/${vessels}`, { headers }).pipe(share());
  }
}

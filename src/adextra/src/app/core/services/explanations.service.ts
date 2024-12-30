import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Explanation} from '@app/shared/models/explanation';
import {Socket} from 'ngx-socket-io';
import {environment} from '@env/environment';
import {HttpResponse} from '@app/shared/models/http-response';
import {share} from 'rxjs/operators';

/**
 * This service is used to manage different actions on the explanation objects.
 */
@Injectable()
export class ExplanationsService {
  /**
   * This variable represents the `explanation` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('explanation').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all explanations from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getExplanations(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}explanations/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get a specific explanation from the server.
   *
   * The parameter `project` represents the project associated to the explanation.
   * The parameter `vessel` represents the vessel associated to the explanation.
   * The parameter `forecaster` represents the forecaster associated to the explanation.
   * The parameter `analysis` represents the analysis associated to the explanation.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getExplanation(project: string, vessel: string, forecaster: string, analysis: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(
      `${environment.api_server}explanations/${project}/${vessel}/${forecaster}/${analysis}`, { headers }
      ).pipe(share());
  }

  /**
   * This method allows to add a explanation.
   *
   * The parameter `explanation` represents the explanation to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addExplanation(explanation: Explanation): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}explanations/`, explanation);
  }

  /**
   * This method allows to update a explanation.
   *
   * The parameter `explanation` represents the explanation to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateExplanation(explanation: Explanation): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}explanations/${explanation._id}`, explanation);
  }

  /**
   * This method allows to delete a explanation.
   *
   * The parameter `id` represents the explanation to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteExplanation(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}explanations/${id}`);
  }
}

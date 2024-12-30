import { Injectable } from '@angular/core';
import { share } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { HttpResponse } from '@app/shared/models/http-response';
import { environment } from '@env/environment';
import { Scheduler } from '@app/shared/models/scheduler';

/**
 * This service is used to manage different actions on the scheduler objects.
 */
@Injectable()
export class SchedulersService {
  /**
   * This variable represents the `scheduler` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('scheduler').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the scheduler connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all schedulers from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getSchedulers(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}schedulers/`, { headers }).pipe(share());
  }

  getModularAnalysis(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}schedulers/modular`, { headers }).pipe(share());
  }

  /**
   * This method allows to get one scheduler from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getScheduler(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}schedulers/${id}`, { headers }).pipe(share());
  }

  getAnalysisByScheduler(id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${environment.api_server}analysis/AnalysisByScheduler/${id}`);
  }

  enableModularAnalysis(id: string): Observable<HttpResponse> {
    let params = {};
    return this.http.put<HttpResponse>(`${environment.api_server}schedulers/modular/enable/${id}`,params);
  }

  disableModularAnalysis(id: string): Observable<HttpResponse> {
    let params = {};
    return this.http.put<HttpResponse>(`${environment.api_server}schedulers/modular/disable/${id}`,params);
  }


  /**
   * This method allows to get list of scheduler-logs from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getSchedulerLogs(schedulerLogs): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}appinsights-logging/`, schedulerLogs);
  }

  /**
   * This method allows to add a scheduler.
   *
   * The parameter `scheduler` represents the scheduler to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addScheduler(scheduler: Scheduler): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}schedulers/`, scheduler);
  }

  /**
   * This method allows to update a scheduler.
   *
   * The parameter `scheduler` represents the scheduler to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateScheduler(scheduler: Scheduler): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}schedulers/${scheduler._id}`, scheduler);
  }

  /**
   * This method allows to delete a scheduler.
   *
   * The parameter `id` represents the scheduler to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteScheduler(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}schedulers/${id}`);
  }

  /**
   * This method allows to check project code from the server.
   *
   * The parameter `id` indicates the project-code to get from the server.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getSchedulerName(oldSName: string, newSName: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${environment.api_server}schedulers/checkScheduler/${oldSName}/${newSName}`);
  }

  /* This method is used for copy selected scheduler to production server */
  copySchedulerToProd(id: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${environment.api_server}moveScheduler/CopySchedulerToprod/${id}`);
  }

  // This method is used for save startIn hours in db 
  saveStartingHrs(schedulerId: string, hours): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(`${environment.api_server}schedulers/save_starting_hrs/${schedulerId}`, hours);
  }
  
}

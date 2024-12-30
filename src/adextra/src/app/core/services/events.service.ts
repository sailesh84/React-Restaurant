import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Event} from '@app/shared/models/event';
import {Socket} from 'ngx-socket-io';
import {environment} from '@env/environment';
import {HttpResponse} from '@app/shared/models/http-response';
import {share} from 'rxjs/operators';

/**
 * This service is used to manage different actions on the event objects.
 */
@Injectable()
export class EventsService {
  /**
   * This variable represents the `event` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('event').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all events from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `any`.
   */
  getEvents(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}events`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a event.
   *
   * The parameter `event` represents the event to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addEvent(event: Event): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}events/`, event);
  }

  /**
   * This method allows to update a event.
   *
   * The parameter `event` represents the event to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateEvent(event: Event): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}events/${event._id}`, event);
  }

  /**
   * This method allows to delete a event.
   *
   * The parameter `id` represents the event to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteEvent(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}events/${id}`);
  }
}

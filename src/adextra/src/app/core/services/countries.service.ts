import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {HttpResponse} from '@app/shared/models/http-response';
import {Socket} from 'ngx-socket-io';
import {Country} from '@app/shared/models/country';
import {share} from 'rxjs/operators';

/**
 * This service is used to get countries list from the server.
 */
@Injectable()
export class CountriesService {
  /**
   * This variable represents the `country` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('country').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   */
  constructor(private http: HttpClient, private socket: Socket) {
  }

  /**
   * This method allows to get all countries from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getCountries(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}countries`, { headers }).pipe(share());
  }
  
  getProjectsByCountryId(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}projects/getProjectsByCountryId/${id}`, { headers }).pipe(share());
  }

  /**
   * This method allows to get many country from the server.
   *
   * The parameter `ids` allows to indicate to the countries to retrieve.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getManyCountries(ids: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}countries/countryById/${ids}`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a country.
   *
   * The parameter `country` represents the country to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addCountry(country: Country): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}countries/`, country);
  }

  /**
   * This method allows to update a country.
   *
   * The parameter `country` represents the country to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateCountry(country: Country): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}countries/${country._id}`, country);
  }

  /**
   * This method allows to delete a country.
   *
   * The parameter `id` represents the country to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteCountry(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}countries/${id}`);
  }
}

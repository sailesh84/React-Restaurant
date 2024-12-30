import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Product } from '@app/shared/models/product';
import { HttpResponse } from '@app/shared/models/http-response';
import { share } from 'rxjs/operators';

/**
 * This service is used to manage different actions on the vessel type objects.
 */
@Injectable()
export class ProductsService {
  /**
   * This variable represents the `product` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('product').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all products from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getProducts(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}products/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get a specified vessel type from the server.
   *
   * The parameter `id` allows to indicate to the vessel type to retrieve.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getProduct(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}products/${id}`, { headers }).pipe(share());
  }

  /**
   * Field Analysis Page - It returns an observable of type `HttpResponse`.
  */
  getResult(project: string, vessel: string, productId: string, schedulerId: string, session: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }

    return this.http.get<HttpResponse>(`${environment.api_server}python-logs/${project}/${vessel}/${productId}/${schedulerId}/${session}`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a vessel type.
   *
   * The parameter `product` represents the vessel type to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addProduct(product: Product): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}products/`, product);
  }

  /**
   * This method allows to update a vessel type.
   *
   * The parameter `product` represents the vessel type to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateProduct(product: Product): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}products/${product._id}`, product);
  }

  /**
   * This method allows to delete a vessel type.
   *
   * The parameter `id` represents the vessel type to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteProduct(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}products/${id}`);
  }
}

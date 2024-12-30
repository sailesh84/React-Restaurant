import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {VirtualMachine} from '@app/shared/models/virtual-machine';
import {HttpResponse} from '@app/shared/models/http-response';
import {share} from 'rxjs/operators';

/**
 * This service is used to manage different actions on the vessel type objects.
 */
 @Injectable()
export class VirtualMachineService {
  /**
   * This variable represents the `virtual-machine` event. We use it for know if the data cache has to be refreshed or not.
   */
   socketEvent = this.socket.fromEvent<any>('vm').pipe(share());

   /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all virtual-machine from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
   getVirtualMachines(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}vm/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get a specified virtual-machine from the server.
   *
   * The parameter `id` allows to indicate to the virtual-machine to retrieve.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
   getVirtualMachine(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}vm/${id}`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a vessel type.
   *
   * The parameter `virtual-machine` represents the vessel type to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
   addVirtualMachine(virtualMachine: VirtualMachine): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}vm/`, virtualMachine);
  }

  /**
   * This method allows to update a vessel type.
   *
   * The parameter `virtual-machine` represents the vessel type to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
   updateVirtualMachine(virtualMachine: VirtualMachine): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}vm/${virtualMachine._id}`, virtualMachine);
  }

  /**
   * This method allows to delete a virtual-machine.
   *
   * The parameter `id` represents the virtual-machine to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
   deleteVirtualMachine(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}vm/${id}`);
  }

  /**
   * This method allows to check server name from the server.
   *
   * The parameter `id` indicates the server name to get from the server.
   *
   * It returns an observable of type `HttpResponse`.
   */
   checkVirtualMachine(oldSName: string, newSName: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${environment.api_server}vm/CheckServerName/${oldSName}/${newSName}`);
  }

  restartServer(virtualMachine: VirtualMachine): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}vm/restart`, virtualMachine);
  }
}

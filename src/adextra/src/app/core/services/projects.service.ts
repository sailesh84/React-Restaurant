import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { HttpResponse } from '@app/shared/models/http-response';
import { Socket } from 'ngx-socket-io';
import { Project } from '@app/shared/models/project';
import { share } from 'rxjs/operators';

/**
 * This service is used to manage different actions on the project objects.
 */
@Injectable()
export class ProjectsService {
  /**
   * This variable represents the `analysis` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('project').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all users from the server.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getProjects(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}projects`, { headers }).pipe(share());
  }

  /**
   * This method allows to get all users that are enabled from the server.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getEnabledProjects(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}projects/enabled/true`, { headers }).pipe(share());
  }

  /**
   * This method allows to get all users that are enabled from the server.
   *
   * It returns an observable of type `HttpResponse`.
   */

  // getEnabledProjectsByPaging(page: number, pazeSize: number, region: string): Observable<HttpResponse> {
  //   return this.http.get<HttpResponse>(`${environment.api_server}projects/getProjects/${page}/${pazeSize}/${region}`).pipe(share());
  // }

  getEnabledProjectsByPaging(projectFiltered): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}projects/getProjects/`, projectFiltered);
  }

  /**
   * This method allows to get a user from the server.
   *
   * The parameter `id` indicates the user to get from the server.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getProject(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}projects/${id}`, { headers }).pipe(share());
  }

  /**
   * This method allows to check project code from the server.
   *
   * The parameter `id` indicates the project-code to get from the server.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getProjectCode(oldPCode: string, newPCode: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${environment.api_server}projects/projectcode/${oldPCode}/${newPCode}`);
  }

  /**
   * This method allows to check project code from the server.
   *
   * The parameter `id` indicates the project-code to get from the server.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getProjectsByCountryId(contryId: string): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${environment.api_server}projects/getProjectsByCountryId/${contryId}`);
  }

  /**
   * This method allows to add a project.
   *
   * The parameter `project` represents the project to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addProject(project: Project): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}projects/`, project);
  }

  /**
   * This method allows to update a project.
   *
   * The parameter `project` represents the project to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateProject(project: Project): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}projects/${project._id}`, project);
  }

  /**
   * This method allows to delete a project.
   *
   * The parameter `id` represents the project to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteProject(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}projects/${id}`);
  }
}

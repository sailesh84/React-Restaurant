import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '@app/shared/models/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {Socket} from 'ngx-socket-io';
import {HttpResponse} from '@app/shared/models/http-response';
import {share} from 'rxjs/operators';

/**
 * This service is used to manage different actions on the user object.
 */
@Injectable()
export class UsersService {
  /**
   * This variable represents the `user` event. We use it for know if the data cache has to be refreshed or not.
   */
  socketEvent = this.socket.fromEvent<any>('user').pipe(share());

  /**
   * Constructor
   * http represents the module HttpClient. Indeed, this module allows to do calls on an API
   * socket represents the client connection to the server (socket part)
   */
  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * This method allows to get all users from the server.
   *
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getUsers(reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}users/`, { headers }).pipe(share());
  }

  /**
   * This method allows to get a user that matchs with the given id from the server.
   *
   * The parameter `id` allows to get the user matching with a id.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getUserById(id: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}users/${id}`, { headers }).pipe(share());
  }

  /**
   * This method allows to get a user that matchs with the given pattern from the server.
   *
   * The parameter `pattern` allows to get the user matching with a pattern.
   * The parameter `reset` allows to indicate to the cache interceptor to reset the cache.
   *
   * It returns an observable of type `HttpResponse`.
   */
  getUser(pattern: string, reset: boolean = false): Observable<HttpResponse> {
    let headers = new HttpHeaders();

    if (reset) {
      headers = headers.set('reset-cache', 'true');
    }
    return this.http.get<HttpResponse>(`${environment.api_server}users/search/${pattern}`, { headers }).pipe(share());
  }

  /**
   * This method allows to add a user.
   *
   * The parameter `user` represents the user to add in database.
   *
   * It returns an observable of type `HttpResponse`.
   */
  addUser(user: User): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}users/`, user);
  }

  /**
   * This method allows to do a full update of a user.
   *
   * The parameter `user` represents the user to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateUser(user: User): Observable<HttpResponse> {
    return this.http.put<HttpResponse>(`${environment.api_server}users/${user._id}`, user);
  }

  /**
   * This method allows to do a partial update of a user.
   *
   * The parameter `user` represents the user to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updatePartiallyUser(user: User): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(`${environment.api_server}users/${user._id}`, user);
  }

  /**
   * This method allows to do a full update of a user.
   *
   * The parameter `user` represents the user to update.
   * The parameter `avatarType` represents the new avatar type of the user to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updateUserAvatar(user: User, avatarType: string): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(`${environment.api_server}users/avatar/${user._id}`, {user, avatarType});
  }

  /**
   * This method allows to do a partial update of a user (reset only password by an admin).
   *
   * The parameter `user` represents the user to update.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updatePasswordUserByAdmin(user: User): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(`${environment.api_server}users/reset-password-admin/${user._id}`, user);
  }

  /**
   * This method allows to do a partial update of a user (reset only password by the user).
   *
   * The parameter `user` represents the user to update.
   * The parameter `oldPassword` represents the old password of the user.
   *
   * It returns an observable of type `HttpResponse`.
   */
  updatePasswordUserByUser(user: User, oldPassword: string): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(`${environment.api_server}users/reset-password-user/${user._id}`, {user, oldPassword});
  }

  /**
   * This method allows to do send a email with the new password after reset the password.
   *
   * The parameter `email` represents the email of the account whose we must reset password.
   *
   * It returns an observable of type `HttpResponse`.
   */
  sendEmailResetPassword(email: string): Observable<HttpResponse> {
    return this.http.patch<HttpResponse>(`${environment.api_server}users/reset-password-email/${email}`, {});
  }

  /**
   * This method allows to delete a user.
   *
   * The parameter `id` represents the user to delete.
   *
   * It returns an observable of type `HttpResponse`.
   */
  deleteUser(id: string): Observable<HttpResponse> {
    return this.http.delete<HttpResponse>(`${environment.api_server}users/${id}`);
  }

  /**
   * This method allows to add a send a feedback.
   *
   * It returns an observable of type `HttpResponse`.
   */
   sendFeedback(data): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.api_server}users/send-feedback`, data);
  }



}

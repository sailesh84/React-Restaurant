import {Injectable, OnDestroy} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {ToastrService} from 'ngx-toastr';
import {Observable, Subject} from 'rxjs';
import {WebSocketResponse} from '@app/shared/models/web-socket-response';
import {share, takeUntil} from 'rxjs/operators';
import {UserSharingService} from '@app/core/services/user-sharing.service';

/**
 * This service is used to show notification on WebSockets events. The data to display in the notification come from the server.
 */
@Injectable()
export class WebsocketsServiceService implements OnDestroy {
  private isSocketsEventDead$ = [
    new Subject(),
    new Subject()
  ];

  /**
   * It is the events list to listen. An event is an observable.
   */
  socketsEvents: Observable<any>[] = [
    this.socket.fromEvent<any>('forecast').pipe(share()),
    this.socket.fromEvent<any>('analysis').pipe(share()),
    // this.socket.fromEvent<any>('explanation'),
    // this.socket.fromEvent<any>('event'),
    // this.socket.fromEvent<any>('vessel-type'),
    // this.socket.fromEvent<any>('forecaster'),
    // this.socket.fromEvent<any>('request')
  ];

  /**
   * Constructor
   * socket is the client connection to the server
   * toastrService is a service that allows to show / hide notifications
   */
  constructor(private socket: Socket, private toastrService: ToastrService, private userSharingService: UserSharingService) {
  }

  /**
   * This method allows to subscribe to the events that defined in the events list.
   */
  subscribeEvents() {
    const user = this.userSharingService.currentUser;
    if (user) {
      if (user.notifications[1].enabled === true) {
        let i = 0;
        for (const socketEvent of this.socketsEvents) {
          socketEvent.pipe(takeUntil(this.isSocketsEventDead$[i])).subscribe((socketResponse: WebSocketResponse) => {
            if (user.favouriteProjects.includes(socketResponse.extra)) {
              this.showNotification(socketResponse.type, socketResponse.title, socketResponse.message, { closeButton: true });
            }
          });
          i++;
        }
      }
    }
  }

  /**
   * This method displays the notification. The notification closure is automatic.
   * The param `type` represents the notification type (Info, Success, Warning and Danger).
   * The param `title` represents the notification title.
   * The param `message` represents the notification message.
   * The param `options` allows to override the default options of the notification service.
   */
  private showNotification(type: string, title: string, message: string, options: object = {}) {
    const iconClasses = {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning'
    };
    if (iconClasses[type] === '' || iconClasses[type] === null || iconClasses[type] === undefined) {
      type = 'info';
    }
    this.toastrService.show(message, title, options, iconClasses[type]);
  }

  ngOnDestroy() {
    for (const isDead$ of this.isSocketsEventDead$) {
      isDead$.next();
    }
  }

}

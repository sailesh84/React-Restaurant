import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Request} from '@app/shared/models/request';
import {RequestsService} from '@app/core/services/requests.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-notifications-center',
  templateUrl: './notifications-center.component.html',
  styleUrls: ['./notifications-center.component.scss']
})
export class NotificationsCenterComponent implements OnInit, AfterViewInit, OnDestroy {
  requests: Request[];
  counter: string | number = 0;
  iconNotification = 'notifications_none';

  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isRequestDead$ = new Subject();

  resetCache = false;
  state = { isLoaded: false, canConnect: null };

  constructor(private requestsService: RequestsService) { }

  ngOnInit() {
    this.getRequests();
    this.socketEvent = this.requestsService.socketEvent;
  }

  ngAfterViewInit(): void {
    this.socketEvent.pipe(takeUntil(this.isSocketEventDead$)).subscribe(() => {
      this.resetCache = true;
      this.getRequests();
    });
  }

  getRequests() {
    this.requestsService.getNotClosedRequests(this.resetCache).pipe(takeUntil(this.isRequestDead$)).subscribe((response) => {
      if (response.data.length <= 0) {
        this.requests = [];
        this.counter = 0;
        this.iconNotification = 'notifications_none';
      } else if (response.data.length > 0 && response.data.length < 4) {
        this.requests = response.data;
        this.counter = response.data.length;
        this.iconNotification = 'notifications_active';
      } else {
        this.requests = response.data.slice(0, 3);
        this.counter = '3+';
        this.iconNotification = 'notifications_active';
      }

      this.state.canConnect = true;
      this.state.isLoaded = true;
      this.resetCache = false;
    }, (error) => {
      this.state.canConnect = false;
      this.state.isLoaded = true;
      this.requests = [];
      this.counter = 0;
      this.iconNotification = 'notifications_none';
    });
  }

  getSummary(text: string) {
    if (text.length > 75) {
      return text.substr(0, 76);
    } else {
      return text;
    }
  }

  ngOnDestroy() {
    this.isSocketEventDead$.next();
    this.isRequestDead$.next();
  }

}

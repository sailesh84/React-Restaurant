import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketsServiceService} from '../core/services/websockets-service.service';
import {UserSharingService} from '@app/core/services/user-sharing.service';
import {UsersService} from '@app/core/services/users.service';
import {Accesses} from '@app/shared/enums/accesses.enum';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.scss']
})
export class ProtectedComponent implements OnInit, AfterViewInit, OnDestroy {
  hideSidebar = true;
  userAccess = Accesses.General;
  private subscription: Subscription;

  constructor(
    private websocketsServiceService: WebsocketsServiceService,
    private userSharingService: UserSharingService,
    private userService: UsersService,
    private router: Router
  ) {
    this.subscription = router.events.pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe((event) => {
        if (event.url === event.urlAfterRedirects) {
          if (!this.userSharingService.currentUser) {
            const pattern = localStorage.getItem('user-email');
            if (pattern !== null || pattern !== undefined || pattern.trim() !== '') {
              this.userService.getUser(pattern).subscribe(response => {
                this.userAccess = response.data.access;
                this.userSharingService.updateUser(response.data);
              });
            }
          }
        }
    });
  }

  ngOnInit() {
    const currentUser = this.userSharingService.currentUser;
    if (currentUser) {
      this.userAccess = currentUser.access;
    } else {
      const pattern = localStorage.getItem('user-email');
      if (pattern !== null || pattern !== undefined || pattern.trim() !== '') {
        this.userService.getUser(pattern).subscribe(response => {
          this.userAccess = response.data.access;
          this.userSharingService.updateUser(response.data);
        });
      }
    }
  }

  ngAfterViewInit(): void {
    this.websocketsServiceService.subscribeEvents();
  }

  collapseSidebarEvent($event: boolean) {
    this.hideSidebar = $event;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

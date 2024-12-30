import {Component, OnDestroy, OnInit} from '@angular/core';
import {TitlePageService} from '@app/core/services/title-page.service';
import {User} from '@app/shared/models/user';
import {UserSharingService} from '@app/core/services/user-sharing.service';
import {UsersService} from '@app/core/services/users.service';
import {AuthenticationService} from '@app/core/services/authentication.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit, OnDestroy {

  title = 'My requests';

  user: User;

  state = { isLoaded: false, canConnect: null };

  private isUserDead$ = new Subject();

  constructor(
    private titlePageService: TitlePageService,
    private userSharingService: UserSharingService,
    private userService: UsersService,
    private authService: AuthenticationService
  ) {
    this.titlePageService.setTitle(this.title);
  }

  ngOnInit() {
    this.user = this.userSharingService.currentUser;
    if (this.user === undefined || this.user === null) {
      const keys = { uid: localStorage.getItem('user-uid'), email: localStorage.getItem('user-email') };
      if (keys.uid !== null && keys.email !== null) {
        this.userService.getUser(keys.email).pipe(takeUntil(this.isUserDead$)).subscribe(response => {
          this.userSharingService.updateUser(response.data);
          this.user = response.data;
          if (this.user.image === null || this.user.image === undefined || this.user.image === '') {
            this.user.image = 'https://avatars.dicebear.com/v2/initials/user.svg';
          }
          this.state.canConnect = true;
          this.state.isLoaded = true;
        });
      } else {
        this.authService.logout();
      }
    } else {
      this.state.canConnect = true;
      this.state.isLoaded = true;
    }
  }

  ngOnDestroy() {
    this.isUserDead$.next();
  }

}

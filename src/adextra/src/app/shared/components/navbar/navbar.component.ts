import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthenticationService} from '@app/core/services/authentication.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {UsersService} from '@app/core/services/users.service';
import {TitlePageService} from '@app/core/services/title-page.service';
import {UserSharingService} from '@app/core/services/user-sharing.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Accesses} from '@app/shared/enums/accesses.enum';

/**
 * This component represents the navbar.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  /**
   * The chevron to show according to the state of the sidebar.
   */
   arrow = 'arrow_back';
  /**
   * This state indicates if the data is loaded and if we can connect to the server.
   */
  state = { isLoaded: false, canConnect: null };

  /**
   * Indicate the default state of the sidebar.
   */
  isCollapsedSidebar = true;

  /**
   * Represents the state change of the sidebar.
   */
  @Output() collapseSidebarEvent = new EventEmitter<boolean>();

  /**
   * The current user.
   */
  user: User;

  /**
   * This text is show only for mobile and tablet (small).
   */
  textOptionMenu = 'Show menu';

  /**
   * Title of the current page.
   */
  page = '';

  /**
   * Year of copyright
   */
  copyrightYear = new Date(Date.now()).getUTCFullYear();
  status: boolean = false;

  private isDead$ = new Subject();

  /**
   * Constructor
   */
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private userService: UsersService,
    private titlePageService: TitlePageService,
    private userSharingService: UserSharingService
  ) {
    this.titlePageService.getTitle().subscribe(title => {
      this.page = title;
    });
  }

  /**
   * Called as soon as the creation of the component
   */
  ngOnInit() {
    this.getUser();
  }

  /**
   * Get of the current user infos.
   */
  getUser(): void {
    setInterval(() => {
      this.user = this.userSharingService.currentUser;
    }, 2500);

    this.user = this.userSharingService.currentUser;
    if (this.user === undefined || this.user === null) {
      // const keys = { uid: localStorage.getItem('user-uid'), email: localStorage.getItem('user-email') };
      const pattern = localStorage.getItem('user-email');

      if (pattern !== null || pattern !== undefined || pattern.trim() !== '') {
        this.userService.getUser(pattern).pipe(takeUntil(this.isDead$)).subscribe(response => {
          this.userSharingService.updateUser(response.data);
          this.user = response.data;
          if (this.user.image === null || this.user.image === undefined || this.user.image === '') {
            this.user.image = './assets/images/user_icon.svg';
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

  /**
   * This function allows to edit the state of the sidebar.
   */
  collapseSidebar() {
    if (this.isCollapsedSidebar) {
      this.isCollapsedSidebar = false;
      this.collapseSidebarEvent.emit(false);
      this.textOptionMenu = 'Hide menu';
    } else {
      this.isCollapsedSidebar = true;
      this.collapseSidebarEvent.emit(true);
      this.textOptionMenu = 'Show menu';
    }
  }

  /**
   * Ask the log out.
   */
  logout() {
    this.authService.logoutNew().subscribe(response => {
      if(response.success === true){
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    this.isDead$.next();
  }

  isAdmin() {
    return this.user.access && (this.user.access === Accesses.Lead || this.user.access === Accesses.Administrator);
  }

  toggleMenu() {
    if (this.arrow === 'arrow_back' && !this.status) {
      this.arrow = 'arrow_forward';
      this.status = true;
    } else {
      this.arrow = 'arrow_back';
      this.status = false;
    }
    this.userSharingService.sendSidebarToggledStatus(this.status);
  }
}

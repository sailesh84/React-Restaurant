import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '@app/shared/models/user';
import {UsersService} from '@app/core/services/users.service';
import {ProjectsService} from '@app/core/services/projects.service';
import {forkJoin, Observable, Subject} from 'rxjs';
import {UserSharingService} from '@app/core/services/user-sharing.service';
import {takeUntil} from 'rxjs/operators';
import {Project} from '@app/shared/models/project';
import {Client} from '@app/shared/models/client';
import {ClientsService} from '@app/core/services/clients.service';

@Component({
  selector: 'app-profile-feature',
  templateUrl: './profile-feature.component.html',
  styleUrls: ['./profile-feature.component.scss']
})
export class ProfileFeatureComponent implements OnInit, AfterViewInit, OnDestroy {
  state = { isLoaded: false, canConnect: null };

  resetCache = false;

  user: User;
  projects: Project[] = [];
  clients: Client[] = [];

  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isUserDead$ = new Subject();
  private isProjectDead$ = new Subject();
  private isClientsDead$ = new Subject();

  constructor(
    private userService: UsersService,
    private projectsService: ProjectsService,
    private clientsService: ClientsService,
    private userSharingService: UserSharingService
  ) { }

  ngOnInit() {
    this.getData();

    this.socketEvent = this.userService.socketEvent;
  }
  ngAfterViewInit(): void {
    this.socketEvent.pipe(takeUntil(this.isSocketEventDead$)).subscribe(() => {
      this.resetCache = true;
      this.userService.getUser(this.user.email, this.resetCache).pipe(takeUntil(this.isUserDead$)).subscribe(response => {
        this.userSharingService.updateUser(response.data);
        this.user = this.userSharingService.currentUser;
      });
    });
  }

  ngOnDestroy() {
    this.isSocketEventDead$.next();
    this.isUserDead$.next();
    this.isProjectDead$.next();
    this.isClientsDead$.next();
  }

  getData(): void {
    this.user = this.userSharingService.currentUser;
    if (!this.user) {
      this.userService.getUser(localStorage.getItem('user-email')).pipe(takeUntil(this.isUserDead$)).subscribe(response => {
        this.user = response.data;
        this.userSharingService.updateUser(this.user);
        if (!this.user.image || this.user.image === '') {
          this.user.image = 'https://avatars.dicebear.com/v2/initials/user.svg';
        }
      }, error => {
        this.user = null;
      });
    }
    forkJoin([
      this.projectsService.getProjects().pipe(takeUntil(this.isProjectDead$)),
      this.clientsService.getClients().pipe(takeUntil(this.isClientsDead$))
    ]).subscribe((responses) => {
      this.projects = responses[0].data;
      this.clients = responses[1].data;
      this.state.canConnect = true;
      this.state.isLoaded = true;
    }, () => {
      this.state.canConnect = false;
      this.state.isLoaded = true;
      this.projects = [];
      this.clients = [];
    });
  }

  refresh(): void {
    this.getData();
  }
}

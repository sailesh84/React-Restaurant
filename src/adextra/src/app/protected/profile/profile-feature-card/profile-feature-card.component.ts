import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '@app/shared/models/user';
import { UsersService } from '@app/core/services/users.service';
import { Log } from '@app/shared/models/log';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from '@app/shared/models/project';
import { Settings } from '@app/shared/enums/settings.enums';
import { ToastrService } from 'ngx-toastr';
import { Client } from '@app/shared/models/client';

@Component({
  selector: 'app-profile-feature-card',
  templateUrl: './profile-feature-card.component.html',
  styleUrls: ['./profile-feature-card.component.scss']
})
export class ProfileFeatureCardComponent implements OnInit, OnDestroy {

  @Input() user: User;
  @Input() projects: Project[] = [];
  @Input() clients: Client[] = [];

  avatar = 'initials';
  avatars: { id: string, name: string, icon: string }[] = [
    { id: 'human', name: 'Human', icon: 'https://ui-avatars.com/api/?name=' },
    { id: 'identicon', name: 'Identicon', icon: 'https://ui-avatars.com/api/?name=' },
    { id: 'initials', name: 'Initials', icon: 'https://ui-avatars.com/api/?name=' },
    { id: 'bottts', name: 'Bottts', icon: 'https://ui-avatars.com/api/?name=' },
    { id: 'avataaars', name: 'Avataaars', icon: 'https://ui-avatars.com/api/?name=' },
    { id: 'jdenticon', name: 'Jdenticon', icon: 'https://ui-avatars.com/api/?name=' },
    { id: 'gridy', name: 'Gridy', icon: 'https://ui-avatars.com/api/?name=' }
  ];
  errorForm = false;
  errorMessageForm = null;
  errorModal = false;
  errorMessageModal = null;
  iconButtonshowHidePassword = 'visibility';

  languages: { id: string, name: string }[] = [
    { id: 'en-GB', name: 'English' }, { id: 'fr-FR', name: 'French' }, { id: 'pt-PT', name: 'Portuguese' }, { id: 'no-NO', name: 'Norwegian' }
  ];
  limit: number;
  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };

  @ViewChild('modalUpdateAvatar', { static: true }) modalUpdateAvatar: ElementRef;
  @ViewChild('modalResetPassword', { static: true }) modalResetPassword: ElementRef;

  oldPassword = '';
  showPassword = false;
  submitted = false;

  typeInputNewPassword = 'password';

  private isUserDead$ = new Subject();
  private isLogsDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private userService: UsersService,
    private userSharingService: UserSharingService,
    private logsService: LogsService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.limit = Settings.FavoriteProjectLimit;
  }

  ngOnDestroy() {
    this.isUserDead$.next();
    this.isLogsDead$.next();
  }

  getImage(id: string): string {
    if (id) {
      return `./assets/images/flags/${id.split('-')[1].toLowerCase()}.svg`;
    }
    return '';
  }

  onSubmit() {
    const user = this.user;
    this.userService.updatePartiallyUser(this.user).pipe(takeUntil(this.isUserDead$)).subscribe(response => {
      this.submitted = true;
      const tempLog = Object.assign({}, this.log);
      tempLog.user = (user.firstname + ' ' + user.lastname).trim();
      tempLog.date = Date.now();
      tempLog.severity = 0;
      tempLog.message = `Updated his/her profile`;
      this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
      this.toastrService.success('Successful profile update', 'Profile update', {
        closeButton: true, positionClass: 'toast-top-right', timeOut: 2000
      });
    }, (error) => {
      this.errorForm = true;
      this.errorMessageForm = 'An error occurred on the server side.';
      this.toastrService.error('Failure profile update', 'Profile update', {
        closeButton: true, positionClass: 'toast-top-right', timeOut: 2000
      });
    });
  }

  openModalChangePassword() {
    this.modalService.open(this.modalResetPassword, { centered: true, size: 'lg', backdrop: 'static' });
  }

  openModalChangeAvatar() {
    this.modalService.open(this.modalUpdateAvatar, { centered: true, size: 'lg', backdrop: 'static' });
  }

  showHidePassword() {
    if (this.showPassword === false) {
      this.showPassword = true;
      this.iconButtonshowHidePassword = 'visibility_off';
      this.typeInputNewPassword = 'text';
    } else {
      this.showPassword = false;
      this.iconButtonshowHidePassword = 'visibility';
      this.typeInputNewPassword = 'password';
    }
  }

  resetPassword(modal: NgbActiveModal) {
    // save in db
    const user = this.user;
    if ((this.user.password !== '' || this.user.password !== null || this.user.password !== undefined) &&
      (this.oldPassword !== '' || this.oldPassword !== null || this.oldPassword !== undefined)) {
      this.userService.updatePasswordUserByUser(this.user, this.oldPassword).pipe(takeUntil(this.isUserDead$)).subscribe((response) => {
        if (response.success === true) {
          this.userSharingService.updateUser(response.data);
          this.oldPassword = '';
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 1;
          tempLog.message = `Changed his/her password`;
          this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
        } else {
          this.errorModal = true;
          this.errorMessageModal = response.message;
        }
      }, (error) => {
        this.errorModal = true;
        this.errorMessageModal = 'An error occurred on the server side.';
      });
    } else {
      this.errorModal = true;
      this.errorMessageModal = 'Please complete all projects.';
    }
  }

  updateAvatar(modal: NgbActiveModal) {
    // save in db
    const user = this.user;
    if (this.avatar !== '' || this.avatar !== null || this.avatar !== undefined) {
      this.userService.updateUserAvatar(this.user, this.avatar).pipe(takeUntil(this.isUserDead$)).subscribe((response) => {
        if (response.success === true) {
          this.userSharingService.updateUser(response.data);
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 1;
          tempLog.message = `Changed his/her avatar`;
          this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
        } else {
          this.errorModal = true;
          this.errorMessageModal = response.message;
        }
      }, (error) => {
        this.errorModal = true;
        this.errorMessageModal = 'An error occurred on the server side.';
      });
    } else {
      this.errorModal = true;
      this.errorMessageModal = 'Please select a value';
    }
  }

  projectSearchFn = (term: string, item: Project): boolean => {
    term = term.toLowerCase();
    const c = this.getClient(item.client);
    const client = (c) ? c.name : '';
    return item.name.trim().toLowerCase().includes(term) || item.code.trim().toLowerCase().includes(term) ||
      client.trim().toLowerCase().includes(term);
  }

  getClient(id: any): Client {
    return this.clients.find(elt => elt._id === id);
  }

  trackByFn(index: number, object: any): any {
    return index;
  }
}

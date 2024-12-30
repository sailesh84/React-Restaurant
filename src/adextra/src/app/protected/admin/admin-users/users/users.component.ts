import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '@app/shared/models/user';
import { DataTableDirective } from 'angular-datatables';
import { forkJoin, Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '@app/core/services/users.service';
import { TitlePageService } from '@app/core/services/title-page.service';
import { Log } from '@app/shared/models/log';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { ProjectsService } from '@app/core/services/projects.service';
import { Project } from '@app/shared/models/project';
import * as generator from 'generate-password-browser';
import { takeUntil } from 'rxjs/operators';
import { Accesses } from '@app/shared/enums/accesses.enum';
import { Settings } from '@app/shared/enums/settings.enums';
import { Client } from '@app/shared/models/client';
import { ClientsService } from '@app/core/services/clients.service';
import { Continents } from '@app/shared/enums/continents.enum';
import { RegionsService } from '@app/core/services/regions.service';
import { Region } from '@app/shared/models/region';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {

  showPassword = false;
  resetCache = false;
  errorModal = false;
  isDisabledAccess: boolean = false;

  title = 'Users management';
  iconButtonShowHidePassword = 'visibility';
  typeInputNewPassword = 'password';

  errorMessageModal = null;
  region = null;

  dtOptions: any = {};
  users: User[];
  regions: Region[] = [];
  clients: Client[];
  projects: Project[];
  validateVM: any[] = [];
  validationModal = false;

  limit: number;
  validationMessage: string = "";

  deleteSuccessRespType: boolean = true;
  deleteSuccesResp: string = "";

  languages: { id: string, name: string }[] = [
    { id: 'en-GB', name: 'English' }, { id: 'fr-FR', name: 'French' }, { id: 'pt-PT', name: 'Portuguese' }, { id: 'no-NO', name: 'Norwegian' }
  ];

  user: User = {
    _id: '-1', firstname: '', lastname: '', email: '', job: 'To edit', image: '', access: 1, enabled: true, password: '',
    language: 'en-GB', favouriteProjects: [], favouriteRegion: [], phones: ['+44 0000 0000', '+44 0000 0000'],
    notifications: [{ type: 'email', enabled: false }, { type: 'push', enabled: false }, { type: 'sms', enabled: false }]
  };

  accesses: { label: string, value: number }[];
  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };
  state = { isLoaded: false, canConnect: null };

  @ViewChild('modalView', { static: true }) modalView: ElementRef;
  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;
  @ViewChild('modalEdit', { static: true }) modalEdit: ElementRef;
  @ViewChild('modalDelete', { static: true }) modalDelete: ElementRef;
  @ViewChild('modalResetPassword', { static: true }) modalResetPassword: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isProjectsDead$ = new Subject();
  private isUsersDead$ = new Subject();
  private isClientsDead$ = new Subject();
  private isLogsDead$ = new Subject();
  private isRegionsDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private clientsService: ClientsService,
    private titlePageService: TitlePageService,
    private userSharingService: UserSharingService,
    private logsService: LogsService,
    private regionsService: RegionsService
  ) {
    this.titlePageService.setTitle(this.title);
  }

  ngOnInit() {
    const that = this;
    this.limit = Settings.FavoriteProjectLimit;
    this.dtOptions = {
      destroy: true,
      retrieve: true,
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[1, 'desc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        forkJoin([
          that.projectsService.getProjects(that.resetCache).pipe(takeUntil(this.isProjectsDead$)),
          that.clientsService.getClients(that.resetCache).pipe(takeUntil(this.isClientsDead$)),
          that.usersService.getUsers(that.resetCache).pipe(takeUntil(this.isUsersDead$)),
          this.regionsService.getRegions(this.resetCache).pipe(takeUntil(this.isRegionsDead$))
        ]).subscribe((response) => {
          that.projects = response[0].data;
          that.clients = response[1].data;
          that.users = response[2].data;
          this.regions = response[3].data;
          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.users
          });
        }, error => {
          that.projects = [];
          that.users = [];
          that.clients = [];
          that.accesses = [];
          this.regions = [];
          that.state.canConnect = false;
          that.state.isLoaded = true;
          callback({
            data: []
          });
        });
      },
      columns: [{ data: null }, { data: 'firstname' }, { data: 'lastname' }, { data: 'email' }, { data: 'access' }, { data: 'enabled' }],
      columnDefs: [
        {
          orderable: false,
          targets: [0],
          className: 'td-action',
          render: (data, type, full, meta) => {

            let lockString = '';
            // if ((full as User).accountName && (full as User).accountName.toLowerCase().includes('noldap')) {
            //   lockString = '<button class="btn btn-outline-dark btn-reset btn-sm"><i class="material-icons md-center md-sm">lock</i>' +
            //     '</button>';
            // }


            // if (this.userSharingService.currentUser.access !== Accesses.Administrator) {  //Users who do not have admin access
            // if (((full as User).access !== Accesses.Administrator && (full as User).access !== Accesses.Lead) ||
            //   ((full as User)._id === this.userSharingService.currentUser._id)) {
            //   if (((full as User).access !== Accesses.Administrator) || ((full as User)._id === this.userSharingService.currentUser._id)) {
            //     return '<div class="btn-group btn-group-sm" role="group">' +
            //       '<button class="btn btn-outline-dark btn-view btn-sm"><i class="material-icons md-center md-sm">remove_red_eye</i>' +
            //       '</button>' +
            //       lockString +
            //       '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
            //       '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
            //       '</div>';
            //   } else {
            //     return null;
            //   }
            // }

            // Users who have admin access
            // return '<div class="btn-group btn-group-sm" role="group">' +
            //   '<button class="btn btn-outline-dark btn-view btn-sm"><i class="material-icons md-center md-sm">remove_red_eye</i>' +
            //   '</button>' +
            //   lockString +
            //   '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
            //   '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
            //   '</div>';

            if (this.userSharingService.currentUser.access === 6) {
              this.isDisabledAccess = false;
              return '<div class="btn-group btn-group-sm" role="group">' +
                '<button class="btn btn-outline-dark btn-view btn-sm"><i class="material-icons md-center md-sm">remove_red_eye</i>' +
                '</button>' +
                lockString +
                '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
                '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
                '</div>';
            }
            else if (this.userSharingService.currentUser.access === 5) {
              if ((full as User).access !== Accesses.Administrator) {
                this.isDisabledAccess = true;
                if ((((full as User).access === Accesses.Lead)) && ((full as User)._id === this.userSharingService.currentUser._id)) {
                  return '<div class="btn-group btn-group-sm" role="group">' +
                    '<button class="btn btn-outline-dark btn-view btn-sm"><i class="material-icons md-center md-sm">remove_red_eye</i>' +
                    '</button>' +
                    lockString +
                    '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
                    '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
                    '</div>';
                }
                if ((((full as User).access === Accesses.Lead)) && ((full as User)._id !== this.userSharingService.currentUser._id)) {
                  return null;
                }

                return '<div class="btn-group btn-group-sm" role="group">' +
                  '<button class="btn btn-outline-dark btn-view btn-sm"><i class="material-icons md-center md-sm">remove_red_eye</i>' +
                  '</button>' +
                  lockString +
                  '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
                  '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
                  '</div>';
              }
              else {
                return null;
              }
            }
            else if (this.userSharingService.currentUser.access === 4) {
              if (((full as User).access !== Accesses.Administrator) && ((full as User).access !== Accesses.Lead)) {
                this.isDisabledAccess = true;
                if ((((full as User).access === Accesses.General)) && ((full as User)._id === this.userSharingService.currentUser._id)) {
                  return '<div class="btn-group btn-group-sm" role="group">' +
                    '<button class="btn btn-outline-dark btn-view btn-sm"><i class="material-icons md-center md-sm">remove_red_eye</i>' +
                    '</button>' +
                    lockString +
                    '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
                    '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
                    '</div>';
                }
                if ((((full as User).access === Accesses.General)) && ((full as User)._id !== this.userSharingService.currentUser._id)) {
                  return null;
                }

                return '<div class="btn-group btn-group-sm" role="group">' +
                  '<button class="btn btn-outline-dark btn-view btn-sm"><i class="material-icons md-center md-sm">remove_red_eye</i>' +
                  '</button>' +
                  lockString +
                  '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
                  '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
                  '</div>';
              }
              else {
                return null;
              }
            }
          }
        },
        {
          targets: [4],
          render: (data, type, full, meta) => {
            if (!data) { data = Accesses.General; }
            return that.getBadges('access', data);
          }
        },
        {
          targets: [5],
          render: (data, type, full, meta) => {
            return that.getBadges('enabled', data);
          }
        },
        /* {
           targets: [9],
           render: (data, type, full, meta) => {
             let render = '';
             for (const d of data) {
               const project = that.projects.find(p => p._id === d);
               if (project !== null || project !== undefined) {
                 const client = that.clients.find(c => c._id === project.client);
                 let subRender = `${project.code.trim()} -`;
                 if (client) {
                   subRender += ` ${client.name.trim()}`;
                 }
                 subRender += ` ${project.name.trim()}`;
                 render += `<span class="d-inline-block text-truncate" style="max-width: 100%">o ${subRender.length > 27 ?
                   subRender.substr(0, 27) + '...' : subRender}</span><br />`;
               }
             }
             return render;
           }
         },*/
      ],
      dom:
        '<"row"<"col-sm-3 col-12"l><"col-sm-6 col-8 text-center"B><"col-sm-3 col-12"f>>' +
        '<"row"<"col-sm-12 col-12"tr>>' +
        '<"row"<"col-sm-5 col-12"i><"col-sm-7 col-12"p>>',
      stateSave: true,
      buttons: [
        {
          extend: 'colvis',
          className: 'btn-outline-success btn-sm',
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        },
        // {
        //   text: '<i class="material-icons md-center">add</i> Add',
        //   key: '1',
        //   className: 'btn-outline-success btn-sm',
        //   action: (e, dt, node, config) => {
        //     this.user = {
        //       _id: '-1', firstname: '', lastname: '', email: '', job: 'To edit', image: '', access: 1, enabled: true,
        //       password: '', language: 'en-GB', favouriteProjects: [], favouriteRegion: [], phones: ['+44 0000 0000', '+44 0000 0000'],
        //       notifications: [{ type: 'email', enabled: false }, { type: 'push', enabled: false }, { type: 'sms', enabled: false }]
        //     };
        //     this.refreshAccessList();
        //     this.modalService.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' });
        //   },
        //   init: (api, node, config) => {
        //     $(node).removeClass('btn-secondary');
        //   }
        // }
      ],
      rowCallback: (row: Node, data: User, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltView = $('td', row).find('button.btn-view');
        if (eltView) {
          eltView.off('click');
          eltView.on('click', () => {
            that.user = Object.assign({}, data);
            that.modalService.open(that.modalView, { centered: true, size: 'lg', backdrop: 'static', scrollable: true });
          });
        }
        const eltReset = $('td', row).find('button.btn-reset');
        if (eltReset) {
          eltReset.off('click');
          eltReset.on('click', () => {
            that.user = Object.assign({}, data);
            that.modalService.open(that.modalResetPassword, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            this.validationModal = false;
            that.user = Object.assign({}, data);
            if (that.user._id === that.userSharingService.currentUser._id && that.userSharingService.currentUser.access !==
              Accesses.Administrator) {
              that.accesses = [];
              for (const access of Object.keys(Accesses).filter(x => !(parseInt(x, 10) >= 0))) {
                if (Accesses[access] !== Accesses.Administrator) {
                  this.accesses.push({ label: access, value: Accesses[access] });
                }
              }
            } else {
              that.refreshAccessList();
            }
            that.modalService.open(that.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.user = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.usersService.socketEvent;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.socketEvent.pipe(takeUntil(this.isSocketEventDead$)).subscribe(() => {
      this.resetCache = true;
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.isSocketEventDead$.next();
    this.isUsersDead$.next();
    this.isClientsDead$.next();
    this.isLogsDead$.next();
    this.isProjectsDead$.next();
    this.isRegionsDead$.next();
    this.isDisabledAccess = false;
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  refreshAccessList(): void {
    this.accesses = [];
    for (const access of Object.keys(Accesses).filter(x => !(parseInt(x, 10) >= 0))) {
      if (this.userSharingService.currentUser.access !== Accesses.Administrator) {
        if (Accesses[access] !== Accesses.Administrator && Accesses[access] !== Accesses.Lead) {
          this.accesses.push({ label: access, value: Accesses[access] });
        }
      } else {
        this.accesses.push({ label: access, value: Accesses[access] });
      }
    }
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

  validateUser() {
    this.validateVM = [];
    const excludes = ['_id', 'image', 'enabled', 'password', 'favouriteProjects', 'phones', 'notifications'];
    for (const prop in this.user) {
      if ((excludes.includes(prop) === false) && (this.user[prop] === undefined || this.user[prop] === null ||
        this.user[prop] === '')) {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }

  verifyUser(): [string, boolean] {
    const excludes = ['_id', 'image', 'enabled', 'password', 'favouriteProjects', 'phones', 'notifications'];
    for (const prop in this.user) {
      if ((excludes.includes(prop) === false) && (this.user[prop] === undefined || this.user[prop] === null ||
        this.user[prop] === '')) {
        return [prop, false];
      }
    }
    return ["noFieldToValidate", true];
  }

  addRow(modal: NgbActiveModal) {
    // save in db
    let fieldToValidate = this.verifyUser();
    if (fieldToValidate[0] === "noFieldToValidate") {
      this.usersService.addUser(this.user).pipe(takeUntil(this.isUsersDead$)).subscribe((response) => {
        this.user = {
          _id: '-1', firstname: '', lastname: '', email: '', job: 'To edit', image: '', access: 1, enabled: true, password: '',
          language: 'en-GB', favouriteProjects: [], favouriteRegion: [], phones: ['+44 0000 0000', '+44 0000 0000'],
          notifications: [{ type: 'email', enabled: false }, { type: 'push', enabled: false }, { type: 'sms', enabled: false }]
        };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Added the user ${(response.data.firstname + ' ' + response.data.lastname).trim()}`;
        this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
      }, (error) => {
        this.errorModal = true;
        this.errorMessageModal = 'An error occurred on the server side.';
      });
    } else {
      this.errorModal = true;
      this.errorMessageModal = this.transform(fieldToValidate[0]);
    }
  }

  transform(value: string): string {
    switch (value) {
      case 'firstname':
        return this.validationMessage = "First name is required";

      case 'lastname':
        return this.validationMessage = "Last name is required";

      case 'email':
        return this.validationMessage = "Email is required";

      case 'job':
        return this.validationMessage = "Job is required";

      case 'access':
        return this.validationMessage = "Access is required";

      case 'language':
        return this.validationMessage = "Favourite language is required";

      case 'favouriteRegion':
        return this.validationMessage = "Favourite region(s) is required";

      default:
        return this.validationMessage = "Please fill all the required fields";
    }
  }

  saveEditRow(modal: NgbActiveModal) {
    // save in db
    if (this.validateUser().length <= 0) {
      this.usersService.updateUser(this.user).pipe(takeUntil(this.isUsersDead$)).subscribe((response) => {
        this.user = {
          _id: '-1', firstname: '', lastname: '', email: '', job: 'To edit', image: '', access: 1, enabled: true, password: '',
          language: 'en-GB', favouriteProjects: [], favouriteRegion: [], phones: ['+44 0000 0000', '+44 0000 0000'],
          notifications: [{ type: 'email', enabled: false }, { type: 'push', enabled: false }, { type: 'sms', enabled: false }]
        };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Updated the user ${(response.data.firstname + ' ' + response.data.lastname).trim()}`;
        this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
      }, (error) => {
        this.errorModal = true;
        this.errorMessageModal = 'An error occurred on the server side.';
      });
    }
    else {
      this.validationModal = true;
    }
  }

  deleteRow(modal: NgbActiveModal) {
    // save in db
    if (this.user._id !== undefined || this.user._id !== null || this.user._id !== '') {
      this.usersService.deleteUser(this.user._id).pipe(takeUntil(this.isUsersDead$)).subscribe((response) => {
        if (response.success === true) {
          this.deleteSuccessRespType = true;
          const userName = (this.user.firstname + ' ' + this.user.lastname).trim();
          this.user = {
            _id: '-1', firstname: '', lastname: '', email: '', job: 'To edit', image: '', access: 1, enabled: true, password: '',
            language: 'en-GB', favouriteProjects: [], favouriteRegion: [], phones: ['+44 0000 0000', '+44 0000 0000'],
            notifications: [{ type: 'email', enabled: false }, { type: 'push', enabled: false }, { type: 'sms', enabled: false }]
          };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 2;
          tempLog.message = `Deleted the user ${userName}`;
          this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();

        } else {
          this.deleteSuccessRespType = false;
          this.deleteSuccesResp = response.message;
        }

      });
    } else {
      this.errorModal = true;
      this.errorMessageModal = 'No request to delete.';
    }
  }

  public accept(modal: NgbActiveModal) {
    this.modalService.dismissAll(this.modalEdit);
    this.modalService.dismissAll(this.modalAdd);
    this.modalService.dismissAll(this.modalDelete);
    modal.close('Close click');

    this.user = {
      _id: '-1', firstname: '', lastname: '', email: '', job: 'To edit', image: '', access: 1, enabled: true, password: '',
      language: 'en-GB', favouriteProjects: [], favouriteRegion: [], phones: ['+44 0000 0000', '+44 0000 0000'],
      notifications: [{ type: 'email', enabled: false }, { type: 'push', enabled: false }, { type: 'sms', enabled: false }]
    };
    this.deleteSuccessRespType = true;
    this.deleteSuccesResp = "";
    this.refresh();
  }

  resetPassword(modal: NgbActiveModal) {
    // save in db
    if (this.user.password !== '' || this.user.password !== null || this.user.password !== undefined) {
      this.usersService.updatePasswordUserByAdmin(this.user).pipe(takeUntil(this.isUsersDead$)).subscribe((response) => {
        if (response.success === true) {
          this.user = {
            _id: '-1', firstname: '', lastname: '', email: '', job: 'To edit', image: '', access: 1, enabled: true, password: '',
            language: 'en-GB', favouriteProjects: [], favouriteRegion: [], phones: ['+44 0000 0000', '+44 0000 0000'],
            notifications: [{ type: 'email', enabled: false }, { type: 'push', enabled: false }, { type: 'sms', enabled: false }]
          };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 1;
          tempLog.message = `Changed the password of the user ${(response.data.firstname + ' ' + response.data.lastname).trim()}`;
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

  getBadges(type: string, value: number | boolean) {
    if (type === 'access' && typeof value !== 'boolean') {
      let badgeClass = '';
      if (value === Accesses.General) {
        badgeClass = 'badge-info';
      } else if (value === Accesses.Offshore) {
        badgeClass = 'badge-dark';
      } else if (value === Accesses.Lead) {
        badgeClass = 'badge-warning';
      } else if (value === Accesses.Administrator) {
        badgeClass = 'badge-danger';
      } else {
        badgeClass = 'badge-success';
      }
      return `<span class="badge badge-pill ${badgeClass}">
                ${Accesses[value].substr(0, 1).toUpperCase() + Accesses[value].substr(1)}
              </span>`;
    } else {
      if (value === true) {
        return '<span class="badge badge-pill badge-success">Enabled</span>';
      } else {
        return '<span class="badge badge-pill badge-secondary">Disabled</span>';
      }
    }
  }

  getProjectName(id: string): string {
    let render = '';
    const project = this.projects.find(p => p._id === id);
    if (project !== null || project !== undefined) {
      const client = this.clients.find(c => c._id === project.client);
      let subRender = `${project.code.trim()} -`;
      if (client) {
        subRender += ` ${client.name.trim()}`;
      }
      subRender += ` ${project.name.trim()}`;
      render += `o ${subRender}`;
    }
    return render;
  }

  getFlag(item: any): string {
    if (item.id) {
      const country = item.id.split('-')[1].toLowerCase();
      return `./assets/images/flags/${country}.svg`;
    } else {
      return '';
    }
  }

  getRegion(): Region {
    return this.regions.find((elt) => elt._id === this.region);
  }

  getContinent(continent: string): string {
    return Continents[continent] || 'Others';
  }

  showHidePassword() {
    if (this.showPassword === false) {
      this.showPassword = true;
      this.iconButtonShowHidePassword = 'visibility_off';
      this.typeInputNewPassword = 'text';
    } else {
      this.showPassword = false;
      this.iconButtonShowHidePassword = 'visibility';
      this.typeInputNewPassword = 'password';
    }
  }

  generatePassword() {
    this.user.password = generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: false,
      exclude: '',
      strict: true
    });
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

  getLanguageFlag(language: string) {
    if (language === undefined || language === null || language === '') {
      language = 'gb';
    } else {
      language = language.split('-')[1];
    }
    return `<img class="md-center" alt="" src="./assets/images/flags/${language.toLowerCase()}.svg" height="45"/>`;
  }
}

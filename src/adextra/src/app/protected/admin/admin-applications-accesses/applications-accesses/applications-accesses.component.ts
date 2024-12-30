import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Log} from '@app/shared/models/log';
import {DataTableDirective} from 'angular-datatables';
import {Observable, Subject} from 'rxjs';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TitlePageService} from '@app/core/services/title-page.service';
import {UserSharingService} from '@app/core/services/user-sharing.service';
import {LogsService} from '@app/core/services/logs.service';
import {takeUntil} from 'rxjs/operators';
import {ApplicationAccess} from '@app/shared/models/application-access';
import {ApplicationsAccessesService} from '@app/core/services/applications-accesses.service';
import * as generator from 'generate-password-browser';

@Component({
  selector: 'app-applications-accesses',
  templateUrl: './applications-accesses.component.html',
  styleUrls: ['./applications-accesses.component.scss']
})
export class ApplicationsAccessesComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Applications accesses management';

  resetCache = true;

  errorModal = false;
  errorMessageModal = null;

  dtOptions: any = {};
  applicationsAccesses: ApplicationAccess[];
  validateVM: any[] = [];
  validationModal = false;

  applicationAccess: any = {_id: '-1', scope: '', clientId: 'Auto generated', clientSecret: 'Auto generated'};

  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };

  state = { isLoaded: false, canConnect: null };

  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;
  @ViewChild('modalEdit', { static: true }) modalEdit: ElementRef;
  @ViewChild('modalDelete', { static: true }) modalDelete: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isApplicationsAccessesDead$ = new Subject();
  private isLogsDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private applicationsAccessesService: ApplicationsAccessesService,
    private titlePageService: TitlePageService,
    private userSharingService: UserSharingService,
    private logsService: LogsService
  ) {
    this.titlePageService.setTitle(this.title);
  }

  ngOnInit() {
    const that = this;

    this.dtOptions = {
      destroy: true,
      retrieve: true,
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[ 1, 'desc' ]],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.applicationsAccessesService.getApplicationsAccesses(that.resetCache).pipe(takeUntil(this.isApplicationsAccessesDead$))
          .subscribe((response) => {
          that.applicationsAccesses = response.data;
          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.applicationsAccesses
          });
        }, error => {
          that.applicationsAccesses = [];
          that.state.canConnect = false;
          that.state.isLoaded = true;
          callback({
            data: []
          });
        });
      },
      columns: [{data: null}, { data: 'scope' }, { data: 'clientId' }, { data: 'clientSecret' }],
      columnDefs: [
        {
          orderable: false,
          targets: [0],
          className: 'td-action',
          render: (data, type, full, meta) => {
            return '<div class="btn-group btn-group-sm" role="group">' +
              '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
              '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
              '</div>';
          }
        },
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
        }, {
          text: '<i class="material-icons md-center">add</i> Add',
          key: '1',
          className: 'btn-outline-success btn-sm',
          action: (e, dt, node, config) => {
            this.applicationAccess = {_id: '-1', scope: '', clientId: 'Auto generated', clientSecret: 'Auto generated'};
            this.modalService.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: ApplicationAccess, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            this.validationModal = false;
            that.applicationAccess = Object.assign({}, data);
            that.modalService.open(that.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.applicationAccess = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.applicationsAccessesService.socketEvent;
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
    this.isLogsDead$.next();
    this.isApplicationsAccessesDead$.next();
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  generateClientId() {
    this.applicationAccess.clientId = 'generated';
  }

  generateClientSecret() {
    this.applicationAccess.clientSecret = generator.generate({
      length: 18,
      numbers: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: false,
      exclude: '',
      strict: true
    });
  }

  validateApplicationAccess() {
    this.validateVM = [];
    for (const prop in this.applicationAccess) {
      if (prop !== '_id' && (this.applicationAccess[prop] === undefined || this.applicationAccess[prop] === null
        || this.applicationAccess[prop] === '')) {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }


  verifyApplicationAccess() {
    for (const prop in this.applicationAccess) {
      if (prop !== '_id' && (this.applicationAccess[prop] === undefined || this.applicationAccess[prop] === null
        || this.applicationAccess[prop] === '')) {
        return false;
      }
    }
    return true;
  }

  addRow(modal: NgbActiveModal): void {
    // save in db
    if (this.validateApplicationAccess().length <= 0) {
      this.applicationsAccessesService.addApplicationAccess(this.applicationAccess).pipe(takeUntil(this.isApplicationsAccessesDead$))
        .subscribe((response) => {
          this.applicationAccess = { _id: '-1', scope: '', clientId: 'Auto generated', clientSecret: 'Auto generated' };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 1;
          tempLog.message = `Added the application access ${response.data.scope + ' - ' + response.data.clientId}`;
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

  saveEditRow(modal: NgbActiveModal) {
    // save in db
    if (this.validateApplicationAccess().length <= 0) {
      this.applicationsAccessesService.updateApplicationAccess(this.applicationAccess).pipe(takeUntil(this.isApplicationsAccessesDead$))
        .subscribe((response) => {
          this.applicationAccess = { _id: '-1', scope: '', clientId: 'Auto generated', clientSecret: 'Auto generated' };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 1;
          tempLog.message = `Updated the application access ${response.data.scope + ' - ' + response.data.clientId}`;
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
    if (this.applicationAccess._id !== undefined || this.applicationAccess._id !== null || this.applicationAccess._id !== '') {
      this.applicationsAccessesService.deleteApplicationAccess(this.applicationAccess._id).pipe(takeUntil(this.isApplicationsAccessesDead$))
        .subscribe((response) => {
        const application = this.applicationAccess.scope + ' - ' + this.applicationAccess.clientId;
        this.applicationAccess = {_id: '-1', scope: '', clientId: 'Auto generated', clientSecret: 'Auto generated'};
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 2;
        tempLog.message = `Deleted the application access ${application}`;
        this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
      }, (error) => {
        this.errorModal = true;
        this.errorMessageModal = 'An error occurred on the server side.';
      });
    } else {
      this.errorModal = true;
      this.errorMessageModal = 'No application access to delete.';
    }
  }

}


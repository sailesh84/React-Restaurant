import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Observable, Subject} from 'rxjs';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TitlePageService} from '@app/core/services/title-page.service';
import {RequestsService} from '@app/core/services/requests.service';
import {Request} from '@app/shared/models/request';
import * as moment from 'moment-timezone';
import {Log} from '@app/shared/models/log';
import {UserSharingService} from '@app/core/services/user-sharing.service';
import {LogsService} from '@app/core/services/logs.service';
import {takeUntil} from 'rxjs/operators';
import {Email} from '@app/shared/models/email';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Requests management';

  resetCache = false;

  errorModal = false;
  errorMessageModal = null;

  dtOptions: any = {};
  requests: Request[];
  validateVM: any[] = [];
  validationModal = false;

  state = { isLoaded: false, canConnect: null };

  message: Email = { from: '', to: '', subject: '', message: ''};

  request: Request = {
    _id: '-1', email: '', buyerName: '', reason: '', type: 0, createdAt: Date.now(), closedAt: -1, status: 0, managedBy: []
  };

  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };

  @ViewChild('modalSendEmail', { static: true }) modalSendEmail: ElementRef;
  @ViewChild('modalView', { static: true }) modalView: ElementRef;
  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;
  @ViewChild('modalEdit', { static: true }) modalEdit: ElementRef;
  @ViewChild('modalDelete', { static: true }) modalDelete: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isRequestsDead$ = new Subject();
  private isLogsDead$ = new Subject();

  editor = DecoupledEditor;

  config = {
    toolbar: [
      'heading', '|', 'fontSize', 'fontFamily', 'fontColor', '|', 'bold', 'italic', 'strikethrough', 'underline', 'highlight', '|',
      'alignment', '|', 'numberedList', 'bulletedList', '|', 'link', 'blockQuote', 'insertTable', 'tableColumn', 'tableRow',
      'mergeTableCells', '|', 'undo', 'redo'
    ]
  };

  constructor(
    private modalService: NgbModal,
    private requestsService: RequestsService,
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
      order: [[ 5, 'desc' ], [7, 'asc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.requestsService.getRequests(that.resetCache).pipe(takeUntil(this.isRequestsDead$)).subscribe((response) => {
          that.requests = response.data;

          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.requests
          });
        }, (error) => {
          that.state.canConnect = false;
          that.state.isLoaded = true;
          that.requests = [];
          callback({
            data: that.requests
          });
        });
      },
      columns: [{data: null}, { data: 'email' }, { data: 'buyerName' }, { data: 'reason' }, { data: 'type'}, { data: 'createdAt' },
        { data: 'closedAt' }, { data: 'status' }, { data: 'managedBy' }],
      columnDefs: [
        {
          orderable: false,
          targets: [0],
          className: 'td-action',
          render: (data, type, full, meta) => {
            return '<div class="btn-group btn-group-sm" role="group">' +
              '<button class="btn btn-outline-dark btn-view btn-sm"><i class="material-icons md-center md-sm">remove_red_eye</i>' +
              '</button>' +
              '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
              '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
              '</div>';
          }
        },
        {
          targets: [1, 2],
          render: (data, type, full, meta) => {
            return data.length > 20 ? data.substr( 0, 20 ) + '...' : data;
          }
        },
        {
          targets: [3],
          render: (data, type, full, meta) => {
            const render =  data.length > 50
              ? data.substr( 0, 50 ).replace(/\s([^\s]*)$/, '') + '...'
              : data;
            return render.replace( /&/g, '&amp;' )
              .replace( /</g, '&lt;' )
              .replace( />/g, '&gt;' )
              .replace( /"/g, '&quot;' );
          }
        },
        {
          targets: [4],
          render: (data, type, full, meta) => {
            return that.getBadges('type', data);
          }
        },
        {
          targets: [5, 6],
          render: (data, type, full, meta) => {
            if (type === 'sort') {
              return data;
            }
            let render = '';
            if (data !== 0) {
              render = moment(data).format('DD MMM YYYY HH:mm:ss');
              render += ` (GMT ${moment(data).format('Z')})`;
            } else {
              render = '';
            }
            return render.length > 20 ? render.substr( 0, 20 ) + '...' : render;
          }
        },
        {
          targets: [7],
          render: (data, type, full, meta) => {
            return that.getBadges('status', data);
          }
        },
        {
          targets: [8],
          render: (data, type, full, meta) => {
            let render = '';
            for (const v of data) {
              render += (v.length > 20 ? v.substr( 0, 20 ) + '...' : v) + '<br/>';
            }
            return render;
          }
        }
      ],
      dom:
        '<"row"<"col-sm-3 col-12"l><"col-sm-6 col-8 text-center"B><"col-sm-3 col-12"f>>' +
        '<"row"<"col-sm-12 col-12"tr>>' +
        '<"row"<"col-sm-5 col-12"i><"col-sm-7 col-12"p>>',
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
            this.request = {
              _id: '-1', email: '', buyerName: '', reason: '', type: 0, createdAt: Date.now(), closedAt: -1, status: 0, managedBy: []
            };
            this.modalService.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }, {
          text: '<i class="material-icons md-center">send</i> Send message',
          key: '1',
          className: 'btn-outline-success btn-sm',
          action: (e, dt, node, config) => {
            this.message = {from: this.userSharingService.currentUser.email, to: '', subject: '', message: ''};
            this.modalService.open(this.modalSendEmail, { centered: true, size: 'xl', backdrop: 'static', scrollable: true });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: Request, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltView = $('td', row).find('button.btn-view');
        if (eltView) {
          eltView.off('click');
          eltView.on('click', () => {
            that.request = Object.assign({}, data);
            that.modalService.open(that.modalView, { centered: true, size: 'lg', backdrop: 'static', scrollable: true });
          });
        }
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            this.validationModal = false;
            that.request = Object.assign({}, data);
            that.modalService.open(that.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.request = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.requestsService.socketEvent;
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
    this.isRequestsDead$.next();
    this.isSocketEventDead$.next();
    this.isLogsDead$.next();
  }

  onChangeCkeditor({ editor }: ChangeEvent ) {
    this.message.message = editor.getData();
  }

  onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  getBadges(type: string, value: number) {
    if (type === 'type') {
      if (value === 0) {
        return '<span class="badge badge-pill badge-primary">Registration</span>';
      } else {
        return '<span class="badge badge-pill badge-info">Other</span>';
      }
    } else {
      if (value === 0) {
        return '<span class="badge badge-pill badge-primary">Created</span>';
      } else if (value === 1) {
        return '<span class="badge badge-pill badge-secondary">In progress</span>';
      } else if (value === 2) {
        return '<span class="badge badge-pill badge-success">Accepted</span><span class="badge badge-pill badge-danger">Closed</span>';
      } else if (value === 4) {
        return '<span class="badge badge-pill badge-secondary">Cancelled</span><span class="badge badge-pill badge-danger">Closed</span>';
      } else {
        return '<span class="badge badge-pill badge-warning">Refused</span><span class="badge badge-pill badge-danger">Closed</span>';
      }
    }
  }

  validateRequest() {
    this.validateVM = [];
    for (const prop in this.request) {
      if (prop !== '_id' && (this.request[prop] === undefined || this.request[prop] === null || this.request[prop] === '')) {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }

  validateMessage() {
    this.validateVM = [];
    for (const prop in this.message) {
      if (this.message[prop] === undefined || this.message[prop] === null || this.message[prop].trim() === '') {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }

  verifyRequest() {
    for (const prop in this.request) {
      if (prop !== '_id' && (this.request[prop] === undefined || this.request[prop] === null || this.request[prop] === '')) {
        return false;
      }
    }
    return true;
  }

  verifyMessage() {
    for (const prop in this.message) {
      if (this.message[prop] === undefined || this.message[prop] === null || this.message[prop].trim() === '') {
        return false;
      }
    }
    return true;
  }

  addRow(modal: NgbActiveModal): void {
    // save in db
    this.request.createdAt = Date.now();
    this.request.managedBy.push(this.userSharingService.currentUser.email);

    if(this.validateRequest().length <= 0){
      this.requestsService.addRequest(this.request).pipe(takeUntil(this.isRequestsDead$)).subscribe((response) => {
        this.request = {
          _id: '-1', email: '', buyerName: '', reason: '', type: 0, createdAt: Date.now(), closedAt: -1, status: 0, managedBy: []
        };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Added the request #${response.data._id}`;
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
    if (this.request.status === 2 || this.request.status === 3 || this.request.status === 4) {
      this.request.closedAt = Date.now();
    } else {
      this.request.closedAt = 0;
    }
    if (this.request.managedBy.find((user) => user === 'admin@technipfmc.com') === undefined) {
      this.request.managedBy.push('admin@technipfmc.com');
    } // @TODO: IDEM to fix

    if (this.validateRequest().length <= 0) {
      this.requestsService.updateRequest(this.request).pipe(takeUntil(this.isRequestsDead$)).subscribe((response) => {
        this.request = {
          _id: '-1', email: '', buyerName: '', reason: '', type: 0, createdAt: Date.now(), closedAt: -1, status: 0, managedBy: []
        };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Updated the request #${response.data._id}`;
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
    if (this.request._id !== undefined || this.request._id !== null || this.request._id !== '') {
      this.requestsService.deleteRequest(this.request._id).pipe(takeUntil(this.isRequestsDead$)).subscribe((response) => {
        this.request = {
          _id: '-1', email: '', buyerName: '', reason: '', type: 0, createdAt: Date.now(), closedAt: -1, status: 0, managedBy: []
        };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 2;
        tempLog.message = `Deleted the request #${response.data}`;
        this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
      }, (error) => {
        this.errorModal = true;
        this.errorMessageModal = 'An error occurred on the server side.';
      });
    } else {
      this.errorModal = true;
      this.errorMessageModal = 'No request to delete.';
    }
  }

  sendMail(modal: NgbActiveModal) {
    // save in db
    if(this.validateMessage().length <= 0){
      this.requestsService.sendMail(this.message).pipe(takeUntil(this.isRequestsDead$)).subscribe((response) => {
        this.message = {from: '', to: '', subject: '', message: ''};
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `${response.data.to} sent a message to ${response.data.to}`;
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

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }
}

import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Request} from '@app/shared/models/request';
import {DataTableDirective} from 'angular-datatables';
import {Observable, Subject} from 'rxjs';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RequestsService} from '@app/core/services/requests.service';
import * as moment from 'moment';
import {User} from '@app/shared/models/user';
import {Log} from '@app/shared/models/log';
import {UserSharingService} from '@app/core/services/user-sharing.service';
import {LogsService} from '@app/core/services/logs.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-requests-feature',
  templateUrl: './requests-feature.component.html',
  styleUrls: ['./requests-feature.component.scss']
})
export class RequestsFeatureComponent implements OnInit, AfterViewInit, OnDestroy {
  resetCache = false;

  errorModal = false;
  errorMessageModal = null;

  dtOptions: any = {};
  requests: Request[];

  @Input() user: User;

  state = { isLoaded: false, canConnect: null };

  request: Request = {
    _id: '-1', email: '', buyerName: '', reason: '', type: 1, createdAt: Date.now(), closedAt: -1, status: 0, managedBy: []
  };

  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };

  @ViewChild('modalView', { static: true }) modalView: ElementRef;
  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isLogsDead$ = new Subject();
  private isRequestDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private requestsService: RequestsService,
    private userSharingService: UserSharingService,
    private logsService: LogsService
  ) { }

  ngOnInit() {
    const that = this;

    this.request = {
      _id: '-1', email: this.user.email, buyerName: this.user.firstname + ' ' + this.user.lastname, reason: '', type: 1,
      createdAt: Date.now(), closedAt: -1, status: 0, managedBy: []
    };

    this.dtOptions = {
      destroy: true,
      retrieve: true,
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[ 3, 'desc' ]],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.requestsService.getRequestsByEmail(that.user.email, that.resetCache).pipe(takeUntil(this.isRequestDead$))
          .subscribe((response) => {
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
      columns: [{data: null}, { data: 'reason' }, { data: 'type'}, { data: 'createdAt' }, { data: 'closedAt' }, { data: 'status' },
        { data: 'managedBy' }],
      columnDefs: [
        {
          orderable: false,
          targets: [0],
          className: 'td-action',
          render: (data, type, full, meta) => {
            return '<div class="btn-group btn-group-sm" role="group">' +
              '<button class="btn btn-outline-dark btn-view btn-sm"><i class="material-icons md-center md-sm">remove_red_eye</i>' +
              '</button>' +
              '</div>';
          }
        },
        {
          targets: [1],
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
          targets: [2],
          render: (data, type, full, meta) => {
            return that.getBadges('type', data);
          }
        },
        {
          targets: [3, 4],
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
          targets: [5],
          render: (data, type, full, meta) => {
            return that.getBadges('status', data);
          }
        },
        {
          targets: [6],
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
              _id: '-1', email: this.user.email, buyerName: this.user.firstname + ' ' + this.user.lastname, reason: '', type: 1,
              createdAt: Date.now(), closedAt: -1, status: 0, managedBy: []
            };
            this.modalService.open(this.modalAdd, { centered: true, size: 'xl', backdrop: 'static' });
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
            that.modalService.open(that.modalView, { centered: true, size: 'xl', backdrop: 'static' });
          });
        }
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
    this.isSocketEventDead$.next();
    this.isLogsDead$.next();
    this.isRequestDead$.next();
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
      } else {
        return '<span class="badge badge-pill badge-warning">Refused</span><span class="badge badge-pill badge-danger">Closed</span>';
      }
    }
  }

  verifyRequest() {
    for (const prop in this.request) {
      if (prop !== '_id' && (this.request[prop] === undefined || this.request[prop] === null || this.request[prop] === '')) {
        return false;
      }
    }
    return true;
  }

  addRow(modal: NgbActiveModal): void {
    // save in db
    this.request.createdAt = Date.now();

    if (this.verifyRequest() === true)  {
      this.requestsService.createRequest(this.request).pipe(takeUntil(this.isRequestDead$)).subscribe((response) => {
        this.request = {
          _id: '-1', email: this.user.email, buyerName: this.user.firstname + ' ' + this.user.lastname, reason: '', type: 1,
          createdAt: Date.now(), closedAt: -1, status: 0, managedBy: []
        };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 0;
        tempLog.message = `Created the request ${response.data._id}`;
        this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
      }, (error) => {
        this.errorModal = true;
        this.errorMessageModal = 'An error occurred on the server side.';
      });
    } else {
      this.errorModal = true;
      this.errorMessageModal = 'Please complete all projects.';
    }
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

}

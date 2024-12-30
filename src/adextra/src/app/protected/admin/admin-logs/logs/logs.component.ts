import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TitlePageService} from '@app/core/services/title-page.service';
import {DataTableDirective} from 'angular-datatables';
import {Observable, Subject} from 'rxjs';
import {Log} from '@app/shared/models/log';
import {LogsService} from '@app/core/services/logs.service';
import * as moment from 'moment-timezone';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Logs management';

  resetCache = false;

  dtOptions: any = {};
  logs: Log[];

  locations: {ip: string, latitude: number, longitude: number, countConnection: number}[] = [];

  log: Log = {
    _id: '-1', severity: 0, date: Date.now(), user: '', sourceIP: '', userAgent: '', message: '', location: []
  };

  @ViewChild('modalView', { static: true }) modalView: ElementRef;
  @ViewChild('modalMap', { static: true }) modalMap: ElementRef;

  state = { isLoaded: false, canConnect: null };

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isLogsDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private titlePageService: TitlePageService,
    private logsService: LogsService
  ) {
    this.titlePageService.setTitle(this.title);
  }

  ngOnInit() {
    const that = this;
    this.dtOptions = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[ 2, 'desc' ]],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.logsService.getLogs(that.resetCache).pipe(takeUntil(this.isLogsDead$)).subscribe((response) => {
          that.logs = response.data;
          that.getLocations();
          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.logs
          });
        }, (error) => {
          that.state.canConnect = false;
          that.state.isLoaded = true;
          that.logs = [];
          that.locations = [];
          callback({
            data: that.logs
          });
        });
      },
      columns: [{data: null}, { data: 'severity' }, { data: 'date'}, { data: 'user' }, { data: 'sourceIP' }, { data: 'userAgent' },
        { data: 'message' }],
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
            return that.getBadge(data);
          }
        },
        {
          targets: [2],
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
            return data.length > 20 ? data.substr( 0, 20 ) + '...' : data;
          }
        },
        {
          targets: [3],
          render: (data, type, full, meta) => {
            return data.length > 20 ? data.substr( 0, 255 ) + '...' : data;
          }
        }
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
          text: '<i class="material-icons md-center">map</i> Locations',
          key: '1',
          className: 'btn-outline-success btn-sm',
          action: (e, dt, node, config) => {
            this.modalService.open(this.modalMap, { centered: true, size: 'xl', backdrop: 'static' });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: Log, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltView = $('td', row).find('button.btn-view');
        if (eltView) {
          eltView.off('click');
          eltView.on('click', () => {
            that.log = Object.assign({}, data);
            that.modalService.open(that.modalView, { centered: true, size: 'xl', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.logsService.socketEvent;
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
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  getBadge(value: number): string {
    if (value === 0) {
      return '<span class="badge badge-pill badge-info"><i class="material-icons md-center md-xs">priority_high</i> Information</span>';
    } else if (value === 1) {
      return '<span class="badge badge-pill badge-warning"><i class="material-icons md-center md-xs">priority_high</i> Warning</span>';
    } else {
      return '<span class="badge badge-pill badge-danger"><i class="material-icons md-center md-xs">priority_high</i> Critical</span>';
    }
  }

  getLocations() {
    this.locations = [];
    const ipConnections = {};
    for (const log of this.logs) {
      const currentIP = log.sourceIP.split(', ')[0];
      if (!ipConnections.hasOwnProperty(currentIP)) {
        if ((log.location && log.location.length > 0)) {
          ipConnections[currentIP] = {
            count: 1,
            geo: log.location
          };
        }
      } else {
        ipConnections[currentIP].count += 1;
      }
    }
    for (const k of Object.keys(ipConnections)) {
      this.locations.push(
        {ip: k, latitude: ipConnections[k].geo[0], longitude: ipConnections[k].geo[1], countConnection: ipConnections[k].count}
      );
    }
  }

}

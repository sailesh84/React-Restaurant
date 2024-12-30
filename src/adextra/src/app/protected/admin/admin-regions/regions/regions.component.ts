import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { Region } from '@app/shared/models/region';
import { Log } from '@app/shared/models/log';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegionsService } from '@app/core/services/regions.service';
import { TitlePageService } from '@app/core/services/title-page.service';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { takeUntil } from 'rxjs/operators';
import { Continents } from '@app/shared/enums/continents.enum';
import { icon, latLng, LeafletMouseEvent, Map, Marker, marker, tileLayer } from 'leaflet';
import { formatNumber } from '@app/shared/helpers/math';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent implements OnInit, AfterViewInit, OnDestroy {

  title = 'Regions management';

  resetCache = false;
  errorModal = false;

  errorMessageModal = null;
  zoom = 12;
  // center = latLng([34.013836470615935, 29.267578125000004]);
  center = latLng(0, 0);

  dtOptions: any = {};

  deleteSuccessRespType: boolean = true;
  deleteSuccesResp: string = "";
  validateVM: any[] = [];
  validationModal = false;

  continents: { label: string, value: string }[];
  region: Region = { _id: '-1', name: '', continent: '', latitude: 0, longitude: 0 };
  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };
  state = { isLoaded: false, canConnect: null };
  options = {
    layers: [tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Open Street Map' })],
    zoom: this.zoom,
    center: this.center,
    trackResize: false
  };

  regions: Region[];
  marker: Marker;
  map: Map;

  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;
  @ViewChild('modalEdit', { static: true }) modalEdit: ElementRef;
  @ViewChild('modalDelete', { static: true }) modalDelete: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isRegionTypesDead$ = new Subject();
  private isRegionsDead$ = new Subject();
  private isUsersDead$ = new Subject();
  private isLogsDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private regionService: RegionsService,
    private titlePageService: TitlePageService,
    private userSharingService: UserSharingService,
    private logsService: LogsService
  ) {
    this.titlePageService.setTitle(this.title);
  }

  ngOnInit() {
    const that = this;

    this.continents = [];
    for (const key in Continents) {
      if (Continents.hasOwnProperty(key)) {
        this.continents.push({ label: Continents[key], value: key });
      }
    }

    this.dtOptions = {
      destroy: true,
      retrieve: true,
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[1, 'desc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.regionService.getRegions(that.resetCache).pipe(takeUntil(this.isRegionsDead$)).subscribe((response) => {
          that.regions = response.data;
          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.regions
          });
        }, error => {
          that.regions = [];
          that.state.canConnect = false;
          that.state.isLoaded = true;
          callback({
            data: []
          });
        });
      },
      columns: [{ data: null }, { data: 'name' }, { data: 'latitude' }, { data: 'longitude' }, { data: 'continent' }],
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
        {
          targets: [2, 3],
          render: (data, type, full, meta) => {
            if (type === 'sort' || type === 'filter') {
              return data;
            } else {
              return formatNumber(data, 3, 4, 4);
            }
          }
        },
        {
          targets: [4],
          render: (data, type, full, meta) => {
            if (data && Continents[data]) {
              return Continents[data];
            } else {
              return 'Others';
            }
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
          text: '<i class="material-icons md-center">add</i> Add',
          key: '1',
          className: 'btn-outline-success btn-sm',
          action: (e, dt, node, config) => {
            this.region = { _id: '-1', name: '', continent: '', latitude: 0, longitude: 0 };
            this.refreshMap();
            this.modalService.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: Region, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            this.validationModal = false;
            that.region = Object.assign({}, data);
            if (that.region) {
              this.center = latLng(that.region.latitude, that.region.longitude);
            }
            that.refreshMap();
            that.updateMarker(that.region);
            that.modalService.open(that.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.region = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.regionService.socketEvent;
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
    this.isLogsDead$.next();
    this.isRegionsDead$.next();
    this.isRegionTypesDead$.next();
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  validateRegion() {
    this.validateVM = [];
    for (const prop in this.region) {
      if ((prop !== '_id') && (this.region[prop] === undefined || this.region[prop] === null ||
        this.region[prop] === '')) {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }

  verifyRegion() {
    for (const prop in this.region) {
      if ((prop !== '_id') && (this.region[prop] === undefined || this.region[prop] === null ||
        this.region[prop] === '')) {
        return false;
      }
    }
    return true;
  }

  addRow(modal: NgbActiveModal): void {
    // save in db
    if (this.validateRegion().length <= 0) {
      this.regionService.addRegion(this.region).pipe(takeUntil(this.isRegionsDead$)).subscribe((response) => {
        this.region = { _id: '-1', name: '', continent: '', latitude: 0, longitude: 0 };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Added the region ${response.data.name}`;
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
    if (this.validateRegion().length <= 0) {
      this.regionService.updateRegion(this.region).pipe(takeUntil(this.isRegionsDead$)).subscribe((response) => {
        this.region = { _id: '-1', name: '', continent: '', latitude: 0, longitude: 0 };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Updated the region ${response.data.name}`;
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
    if (this.region._id !== undefined || this.region._id !== null || this.region._id !== '') {
      this.regionService.deleteRegion(this.region._id).pipe(takeUntil(this.isRegionsDead$)).subscribe((response) => {
        if (response.success === true) {
          this.deleteSuccessRespType = true;
          const regionName = this.region.name;
          this.region = { _id: '-1', name: '', continent: '', latitude: 0, longitude: 0 };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 2;
          tempLog.message = `Deleted the region ${regionName}`;
          this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();

        } else {
          this.deleteSuccessRespType = false;
          this.deleteSuccesResp = response.message;
        }

      }, (error) => {
        this.errorModal = true;
        this.errorMessageModal = 'An error occurred on the server side.';
      });
    } else {
      this.errorModal = true;
      this.errorMessageModal = 'No region to delete.';
    }
  }

  public accept(modal: NgbActiveModal) {
    this.modalService.dismissAll(this.modalEdit);
    this.modalService.dismissAll(this.modalAdd);
    this.modalService.dismissAll(this.modalDelete);
    modal.close('Close click');

    this.region = { _id: '-1', name: '', continent: '', latitude: 0, longitude: 0 };
    this.deleteSuccessRespType = true;
    this.deleteSuccesResp = "";
    this.refresh();
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id
  }

  getCoordinates(event: LeafletMouseEvent): void {
    this.region.latitude = event.latlng.lat;
    this.region.longitude = event.latlng.lng;
    this.updateMarker(this.region);
  }

  onMapReady(event: Map): void {
    this.map = event;
  }

  refreshMap(): void {
    // if (this.map) {
    this.marker = null;
    this.zoom = 5.5;
    if (this.region) {
      this.center = latLng(this.region.latitude, this.region.longitude);
    }
    this.options = {
      layers: [tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' })],
      zoom: this.zoom,
      center: this.center,
      trackResize: false
    };
    // }
  }

  updateMarker(region: Region): void {
    this.marker = marker(
      [region.latitude, region.longitude],
      {
        icon: icon({
          iconUrl: './assets/marker-icon.png',
          shadowUrl: './assets/marker-shadow.png'
        })
      }
    );
  }
}

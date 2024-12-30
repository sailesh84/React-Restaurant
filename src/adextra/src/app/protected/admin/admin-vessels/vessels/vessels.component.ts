import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Vessel } from '@app/shared/models/vessel';
import { DataTableDirective } from 'angular-datatables';
import { forkJoin, Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VesselsService } from '@app/core/services/vessels.service';
import { TitlePageService } from '@app/core/services/title-page.service';
import { VesselsTypesService } from '@app/core/services/vessels-types.service';
import { VesselType } from '@app/shared/models/vessel-type';
import { Log } from '@app/shared/models/log';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vessels',
  templateUrl: './vessels.component.html',
  styleUrls: ['./vessels.component.scss']
})
export class VesselsComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Vessels management';

  resetCache = false;

  errorModal = false;
  errorMessageModal = null;

  dtOptions: any = {};
  vessels: Vessel[];
  vesselsTypes: VesselType[];
  validateVM: any[] = [];
  validationModal = false;

  deleteSuccessRespType: boolean = true;
  deleteSuccesResp: string = "";

  vessel: Vessel = { _id: '-1', name: '', type: '', image: '', color: null, disabled: false, virtual: false };

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
  private isVesselTypesDead$ = new Subject();
  private isVesselsDead$ = new Subject();
  private isLogsDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private vesselsService: VesselsService,
    private vesselsTypesService: VesselsTypesService,
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
      order: [[1, 'desc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        forkJoin([
          that.vesselsTypesService.getVesselTypes(that.resetCache).pipe(takeUntil(this.isVesselTypesDead$)),
          that.vesselsService.getVessels(that.resetCache).pipe(takeUntil(this.isVesselsDead$)),
        ]).subscribe((response) => {
          that.vesselsTypes = response[0].data;
          that.vessels = response[1].data;
          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.vessels
          });
        }, error => {
          that.vesselsTypes = [];
          that.vessels = [];
          that.state.canConnect = false;
          that.state.isLoaded = true;
          callback({
            data: []
          });
        });
      },
      columns: [{ data: null }, { data: 'name' }, { data: 'type' }, { data: 'image' }, { data: 'disabled' }, { data: 'virtual' }],
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
          targets: [2],
          render: (data, type, full, meta) => {
            const vesselType = this.vesselsTypes.find(el => el._id === data);
            if (vesselType !== undefined) {
              return this.getBadges('type', vesselType);
            }
            return '';
          }
        },
        {
          targets: [3],
          render: (data, type, full, meta) => {
            return `<img class="md-center" alt="" src="${data}" height="45"/>`;
          }
        },
        {
          targets: [4],
          render: (data, type, full, meta) => {
            return that.getBadges('status', data);
          }
        },
        {
          targets: [5],
          render: (data, type, full, meta) => {
            if (data === true) {
              return '<span class="badge badge-pill badge-info">Yes</span>';
            } else {
              return '<span class="badge badge-pill badge-dark">No</span>';
            }
          }
        }
      ],
      dom:
        '<"row"<"col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-12"l><"col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-6 text-center"B><"col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-3"f>>' +
        '<"row"<"col-sm-12 col-12"tr>>' +
        '<"row"<"col-xs-12 col-sm-12 col-md-6 col-lg-5 col-xl-5 col-12"i><"col-xs-12 col-sm-12 col-md-6 col-lg-7 col-xl-7 col-12"p>>',
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
            this.vessel = { _id: '-1', name: '', type: '', image: '', color: null, disabled: false, virtual: false };
            this.modalService.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: Vessel, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            this.validationModal = false;
            that.vessel = Object.assign({}, data);
            that.modalService.open(that.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.vessel = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.vesselsService.socketEvent;
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
    this.isVesselsDead$.next();
    this.isVesselTypesDead$.next();
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

  validateVessel() {
    this.validateVM = [];
    for (const prop in this.vessel) {
      if ((prop !== '_id' && prop !== 'image' && prop !== 'color') && (this.vessel[prop] === undefined || this.vessel[prop] === null ||
        this.vessel[prop] === '')) {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }


  verifyVessel() {
    for (const prop in this.vessel) {
      if ((prop !== '_id' && prop !== 'image') && (this.vessel[prop] === undefined || this.vessel[prop] === null ||
        this.vessel[prop] === '')) {
        return false;
      }
    }
    return true;
  }

  addRow(modal: NgbActiveModal): void {
    // save in db
    if (this.validateVessel().length <= 0) {
      this.vesselsService.addVessel(this.vessel).pipe(takeUntil(this.isVesselsDead$)).subscribe((response) => {
        this.vessel = { _id: '-1', name: '', type: '', image: '', color: null, disabled: false, virtual: false };
        this.validationModal = false;
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Added the vessel ${response.data.name}`;
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
    if (this.validateVessel().length <= 0) {
      this.vesselsService.updateVessel(this.vessel).pipe(takeUntil(this.isVesselsDead$)).subscribe((response) => {
        this.vessel = { _id: '-1', name: '', type: '', image: '', color: null, disabled: false, virtual: false };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Updated the vessel ${response.data.name}`;
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
    if (this.vessel._id !== undefined || this.vessel._id !== null || this.vessel._id !== '') {
      this.vesselsService.deleteVessel(this.vessel._id).pipe(takeUntil(this.isVesselsDead$)).subscribe((response) => {
        if (response.success === true) {
          this.deleteSuccessRespType = true;
          const vesselName = this.vessel.name;
          this.vessel = { _id: '-1', name: '', type: '', image: '', color: null, disabled: false, virtual: false };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 2;
          tempLog.message = `Deleted the vessel ${vesselName}`;
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
      this.errorMessageModal = 'No vessel to delete.';
    }
  }

  public accept(modal: NgbActiveModal) {
    this.modalService.dismissAll(this.modalEdit);
    this.modalService.dismissAll(this.modalAdd);
    this.modalService.dismissAll(this.modalDelete);
    modal.close('Close click');

    this.vessel = { _id: '-1', name: '', type: '', image: '', color: null, disabled: false, virtual: false };
    this.deleteSuccessRespType = true;
    this.deleteSuccesResp = "";
    this.refresh();
  }

  getBadges(type: string, value: VesselType | boolean) {
    if (type === 'type' && typeof value !== 'boolean') {
      return `<span class="badge badge-pill" style="color: #fff; background-color: ${value.color};">${value.name.toUpperCase()}</span>`;
    } else {
      if (value === false) {
        return '<span class="badge badge-pill badge-success">Enabled</span>';
      } else {
        return '<span class="badge badge-pill badge-warning">Disabled</span>';
      }
    }
  }

  updateImage(event: any) {
    this.vessel.image = event;
  }

  getVesselsTypes(): VesselType[] {
    return this.vesselsTypes.filter((elt) => elt.virtual === this.vessel.virtual);
  }

  onVesselTypeChange(event): void {
    if (event) {
      this.vessel.color = event.color;
    }
  }
}

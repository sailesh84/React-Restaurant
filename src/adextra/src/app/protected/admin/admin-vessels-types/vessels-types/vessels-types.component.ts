import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TitlePageService } from '@app/core/services/title-page.service';
import { VesselsTypesService } from '@app/core/services/vessels-types.service';
import { VesselType } from '@app/shared/models/vessel-type';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { Log } from '@app/shared/models/log';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vessel-type',
  templateUrl: './vessels-types.component.html',
  styleUrls: ['./vessels-types.component.scss']
})
export class VesselsTypesComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Vessel type management';

  resetCache = false;

  errorModal = false;
  errorMessageModal = null;

  dtOptions: any = {};
  vesselTypes: VesselType[];
  validateVM: any[] = [];
  validationModal = false;

  deleteSuccessRespType: boolean = true;
  deleteSuccesResp: string = "";

  state = { isLoaded: false, canConnect: null };

  vesselType = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)', virtual: false };

  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };

  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;
  @ViewChild('modalEdit', { static: true }) modalEdit: ElementRef;
  @ViewChild('modalDelete', { static: true }) modalDelete: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isVesselTypesDead$ = new Subject();
  private isLogsDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private vesselTypeService: VesselsTypesService,
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
      order: [[2, 'asc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.vesselTypeService.getVesselTypes(that.resetCache).pipe(takeUntil(this.isVesselTypesDead$)).subscribe((response) => {
          that.vesselTypes = response.data;

          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.vesselTypes
          });
        }, (error) => {
          that.state.canConnect = false;
          that.state.isLoaded = true;
          that.vesselTypes = [];
          callback({
            data: that.vesselTypes
          });
        });
      },
      columns: [{ data: null }, { data: 'name' }, { data: 'virtual' }, { data: 'color' }],
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
            if (data !== true) {
              return 'Vessel (not virtual)';
            } else {
              return 'Object (virtual vessel)';
            }
          }
        },
        {
          targets: [3],
          render: (data, type, full, meta) => {
            if (data !== null || data !== '') {
              return '<div style="height: 20px; width: 100%; border: 1px dashed black; background-color: ' + data + '"></div>';
            } else {
              return '';
            }
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
            this.vesselType = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)', virtual: false };
            this.modalService.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: VesselType, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            this.validationModal = false;
            that.vesselType = Object.assign({}, data);
            that.modalService.open(that.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.vesselType = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.vesselTypeService.socketEvent;
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

  validateVesselType() {
    this.validateVM = [];
    for (const prop in this.vesselType) {
      if (prop !== '_id' && (this.vesselType[prop] === undefined || this.vesselType[prop] === null || this.vesselType[prop] === '')) {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }

  verifyVesselType() {
    for (const prop in this.vesselType) {
      if (prop !== '_id' && (this.vesselType[prop] === undefined || this.vesselType[prop] === null || this.vesselType[prop] === '')) {
        return false;
      }
    }
    return true;
  }

  addRow(modal: NgbActiveModal): void {
    // save in db
    if (this.validateVesselType().length <= 0) {
      this.vesselTypeService.addVesselType(this.vesselType).pipe(takeUntil(this.isVesselTypesDead$)).subscribe((response) => {
        this.vesselType = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)', virtual: false };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Added the vessel type ${response.data.name}`;
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
    if (this.validateVesselType().length <= 0) {
      this.vesselTypeService.updateVesselType(this.vesselType).pipe(takeUntil(this.isVesselTypesDead$)).subscribe((response) => {
        this.vesselType = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)', virtual: false };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Updated the vessel type ${response.data.name}`;
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
    if (this.vesselType._id !== undefined || this.vesselType._id !== null || this.vesselType._id !== '') {
      this.vesselTypeService.deleteVesselType(this.vesselType._id).pipe(takeUntil(this.isVesselTypesDead$)).subscribe((response) => {
        if (response.success === true) {
          this.deleteSuccessRespType = true;
          const vesselTypeName = this.vesselType.name;
          this.vesselType = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)', virtual: false };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 2;
          tempLog.message = `Deleted the vessel type ${vesselTypeName}`;
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
      this.errorMessageModal = 'No vessel type to delete.';
    }
  }

  public accept(modal: NgbActiveModal) {
    this.modalService.dismissAll(this.modalEdit);
    this.modalService.dismissAll(this.modalAdd);
    this.modalService.dismissAll(this.modalDelete);
    modal.close('Close click');

    this.vesselType = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)', virtual: false };
    this.deleteSuccessRespType = true;
    this.deleteSuccesResp = "";
    this.refresh();
  }

}

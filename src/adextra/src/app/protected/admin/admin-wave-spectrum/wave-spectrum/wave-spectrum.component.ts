import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Forecaster } from '@app/shared/models/forecaster';
import { WebSpectrum } from '@app/shared/models/web-spectrum';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebSpectrumService } from '@app/core/services/web-spectrum.service';
import { TitlePageService } from '@app/core/services/title-page.service';
import { Log } from '@app/shared/models/log';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-wave-spectrum',
  templateUrl: './wave-spectrum.component.html',
  styleUrls: ['./wave-spectrum.component.scss']
})
export class WebSpectrumComponent implements OnInit, AfterViewInit, OnDestroy {

  title = 'Web Spectrum management';

  resetCache = false;
  errorModal = false;

  errorMessageModal = null;

  dtOptions: any = {};
  forecaster = { _id: '-1', name: '', authServer: '', dataServer: '', login: '', password: '' };
  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };
  state = { isLoaded: false, canConnect: null };
  forecasters: Forecaster[];
  validateVM: any[] = [];
  validationModal = false;

  validationMessage: string = "";

  deleteSuccessRespType: boolean = true;
  deleteSuccesResp: string = "";

  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;
  @ViewChild('modalEdit', { static: true }) modalEdit: ElementRef;
  @ViewChild('modalDelete', { static: true }) modalDelete: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;

  private isSocketEvent$ = new Subject();
  private isForecastersDead$ = new Subject();
  private isLogsDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private webSpectrumService: WebSpectrumService,
    private titlePageService: TitlePageService,
    private userSharingService: UserSharingService,
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
      order: [[1, 'desc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.webSpectrumService.getWaveSpectras(that.resetCache).pipe(takeUntil(this.isForecastersDead$)).subscribe((response) => {
          that.forecasters = response.data;
          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.forecasters
          });
        }, (error) => {
          that.state.canConnect = false;
          that.state.isLoaded = true;
          that.forecasters = [];
          callback({
            data: that.forecasters
          });
        });
      },
      columns: [{ data: null }, { data: 'name' }, { data: 'authServer' }, { data: 'dataServer' }, { data: 'login' }, { data: 'password' }],
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
            this.forecaster = { _id: '-1', name: '', authServer: '', dataServer: '', login: '', password: '' };
            this.modalService.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: Forecaster, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            this.validationModal = false;
            that.forecaster = Object.assign({}, data);
            that.modalService.open(that.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.forecaster = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.webSpectrumService.socketEvent;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.socketEvent.pipe(takeUntil(this.isSocketEvent$)).subscribe(() => {
      this.resetCache = true;
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.isForecastersDead$.next();
    this.isSocketEvent$.next();
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

  validateForecaster() {
    this.validateVM = [];
    const excludes = ['_id'];
    for (const prop in this.forecaster) {
      if ((excludes.includes(prop) === false) && (this.forecaster[prop] === undefined || this.forecaster[prop] === null ||
        this.forecaster[prop] === '' || this.forecaster[prop].length === 0 || Object.keys(this.forecaster[prop]).length === 0)) {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }

  verifyForecaster(): [string, boolean] {
    const excludes = ['_id'];
    for (const prop in this.forecaster) {
      if ((excludes.includes(prop) === false) && (this.forecaster[prop] === undefined || this.forecaster[prop] === null ||
        this.forecaster[prop] === '' || this.forecaster[prop].length === 0 || Object.keys(this.forecaster[prop]).length === 0)) {
        return [prop, false];
      }
    }
    return ["noFieldToValidate", true];
  }

  addRow(modal: NgbActiveModal): void {
    // save in db
    if (this.validateForecaster().length <= 0) {
      this.webSpectrumService.addWaveSpectra(this.forecaster).pipe(takeUntil(this.isForecastersDead$)).subscribe((response) => {
        this.forecaster = { _id: '-1', name: '', authServer: '', dataServer: '', login: '', password: '' };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Added the webspectrum ${response.data.name}`;
        this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
        window.location.reload();
      }, (error) => {
        this.errorModal = true;
        this.errorMessageModal = 'An error occurred on the server side.';
      });
    }
    else {
      this.validationModal = true;
    }
  }

  transform(value: string): string {
    switch (value) {
      case 'name':
        return this.validationMessage = "Name is required";

      case 'authServer':
        return this.validationMessage = "Authentication Server is required";

      case 'dataServer':
        return this.validationMessage = "Data Server is required";

      case 'login':
        return this.validationMessage = "Login is required";

      case 'password':
        return this.validationMessage = "Password is required";

      default:
        return this.validationMessage = "Please fill all the required fields";
    }
  }

  saveEditRow(modal: NgbActiveModal) {
    // save in db
    if (this.validateForecaster().length <= 0) {
      this.webSpectrumService.updateWaveSpectra(this.forecaster).pipe(takeUntil(this.isForecastersDead$)).subscribe((response) => {
        this.forecaster = { _id: '-1', name: '', authServer: '', dataServer: '', login: '', password: '' };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Updated the webspectrum ${response.data.name}`;
        this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
        window.location.reload();
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
    if (this.forecaster._id !== undefined || this.forecaster._id !== null || this.forecaster._id !== '') {
      this.webSpectrumService.deleteWaveSpectra(this.forecaster._id).pipe(takeUntil(this.isForecastersDead$)).subscribe((response) => {
        if (response.success === true) {
          this.deleteSuccessRespType = true;
          const forecasterName = this.forecaster.name;
          this.forecaster = { _id: '-1', name: '', authServer: '', dataServer: '', login: '', password: '' };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 2;
          tempLog.message = `Deleted the webspectrum ${forecasterName}`;
          this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
          window.location.reload();
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
      this.errorMessageModal = 'No field to delete.';
    }
  }

  public accept(modal: NgbActiveModal) {
    this.modalService.dismissAll(this.modalEdit);
    this.modalService.dismissAll(this.modalAdd);
    this.modalService.dismissAll(this.modalDelete);
    modal.close('Close click');

    this.forecaster = { _id: '-1', name: '', authServer: '', dataServer: '', login: '', password: '' };
    this.deleteSuccessRespType = true;
    this.deleteSuccesResp = "";
    this.refresh();
  }
}

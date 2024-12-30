import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TitlePageService } from '@app/core/services/title-page.service';

import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { Log } from '@app/shared/models/log';
import { take, takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { formatNumber } from '@app/shared/helpers/math';

import { AlphaFactorService } from '@app/core/services/alpha-factor.service';
import { AlphaFactor } from '@app/shared/models/alpha-factor';

@Component({
  selector: 'app-alpha-factor',
  templateUrl: './alpha-factor.component.html',
  styleUrls: ['./alpha-factor.component.scss']
})
export class AlphaFactorComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Alpha Factor management';
  resetCache = false;
  errorModal = false;
  validationModal = false;
  errorMessageModal = null;
  dtOptions: any = {};
  alphaFactors: AlphaFactor[]; //nedd to change with model

  validateAF: any[] = [];
  state = { isLoaded: false, canConnect: null };
  validationMessage: string = "";

  defaultAlphaFactorTable = {
    headers: [
      'Planned Operation Period [h]', 'Operational limiting (OPLIM) significant wave height [m]'
    ],
    rows: [
      { operator: null, value: null, data: [null, null] },
    ],
    cols: [null, null],
    notes: null
  };

  alphaFactor = { _id: '-1', name: '', tableLayout: this.defaultAlphaFactorTable };
  alphaFactorCheckName: any = { newName: null, oldName: null };

  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };

  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;
  @ViewChild('modalEdit', { static: true }) modalEdit: ElementRef;
  @ViewChild('modalDelete', { static: true }) modalDelete: ElementRef;
  @ViewChild('modalRefresh', { static: true }) modalRefresh: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;
  selectedServerName: string = "";
  deleteSuccessRespType: boolean = true;
  refreshSuccessRespType: boolean = true;
  deleteSuccesResp: string = "";
  refreshSuccesResp: string = "";

  private isSocketEventDead$ = new Subject();
  private isAlphaFactorDead$ = new Subject();
  private isLogsDead$ = new Subject();

  constructor(
    private modalService: NgbModal,    
    private alphaFactorService: AlphaFactorService,
    private titlePageService: TitlePageService,
    private userSharingService: UserSharingService,
    private logsService: LogsService,
    private sanitizer: DomSanitizer
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
      order: [[1, 'asc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.alphaFactorService.getAlphaFactors(that.resetCache).pipe(takeUntil(this.isAlphaFactorDead$)).subscribe((response) => {
          // console.log("get all alpha-factor", JSON.stringify(response.data));

          that.alphaFactors = response.data;
          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.alphaFactors
          });
        }, (error) => {
          that.state.canConnect = false;
          that.state.isLoaded = true;
          that.alphaFactors = [];
          callback({
            data: that.alphaFactors
          });
        });
      },
      columns: [{ data: null }, { data: 'name' }],
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
      dom: '<"row"<"col-sm-3 col-12"l><"col-sm-6 col-8 text-center"B><"col-sm-3 col-12"f>>' +
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
            this.alphaFactor = { _id: '-1', name: '', tableLayout: this.defaultAlphaFactorTable };
            this.modalService.open(this.modalAdd, { centered: true, size: 'xl', backdrop: 'static' });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: AlphaFactor, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            that.alphaFactor = Object.assign({}, data);
            // console.log("selected alpha-factor", that.alphaFactor);

            //this.selectedServerName = that.virtualMachine.serverName; 
            this.errorModal = false;
            this.errorMessageModal = "";
            that.modalService.open(that.modalEdit, { centered: true, size: 'xl', backdrop: 'static' });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.alphaFactor = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltRestart = $('td', row).find('button.btn-refresh');
        if (eltRestart) {
          eltRestart.off('click');
          eltRestart.on('click', () => {
            that.alphaFactor = Object.assign({}, data);
            that.modalService.open(that.modalRefresh, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };
    this.socketEvent = this.alphaFactorService.socketEvent;
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
    this.isAlphaFactorDead$.next();
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  validateAlphaFactor() {
    this.validateAF = [];
    const afSanitizer = {
      _id: this.alphaFactor._id,
      name: this.sanitizer.sanitize(SecurityContext.HTML, this.alphaFactor.name),
    }

    for (const prop in afSanitizer) {
      if (prop !== '_id' && (afSanitizer[prop] === undefined || afSanitizer[prop] === null || afSanitizer[prop] === '')) {
        this.validateAF.push(prop);
      }
    }
    return this.validateAF;
  }

  removeWhiteSpace(name: string) {
    return name.split('%20').join(' ').trim();
  }

  addRow(modal: NgbActiveModal) {
    // save in db 
    if (this.validateAlphaFactor().length <= 0) {
      this.validationModal = false;
      const tableName = this.removeWhiteSpace(this.alphaFactor.name);
      this.alphaFactorCheckName = { newName: null, oldName: this.alphaFactor.name };
      
      this.alphaFactorService.checkAlphaFactor(this.alphaFactorCheckName).subscribe((res: any) => {
        if (res.type == "NOT EXISTS" && res.statuscode == 200) {
          // console.log("add alphafactor", this.alphaFactor); return false;

          this.alphaFactorService.addAlphaFactor(this.alphaFactor).pipe(takeUntil(this.isAlphaFactorDead$)).subscribe((response) => {
            this.alphaFactor = { _id: '-1', name: '', tableLayout: this.defaultAlphaFactorTable };
            modal.close('Close click');
            const tempLog = Object.assign({}, this.log);
            const user = this.userSharingService.currentUser;
            tempLog.user = (user.firstname + ' ' + user.lastname).trim();
            tempLog.date = Date.now();
            tempLog.severity = 1;
            tempLog.message = `Added alpha factor ${response.data.name}`;
            this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
            window.location.reload();

          }, (error) => {
            this.errorModal = true;
            this.errorMessageModal = 'An error occurred on the server side.';
          });
        }
        else {
          this.errorModal = true;
          this.errorMessageModal = res.message;
          setInterval(() => {
            this.errorModal = false;
          }, 3000);
        }
      });
    }
    else {
      this.validationModal = true;
    }
  }

  saveEditRow(modal: NgbActiveModal) {
    // save in db
    if (this.validateAlphaFactor().length <= 0) {
      this.validationModal = false;
      const tableName = this.removeWhiteSpace(this.alphaFactor.name);
      this.alphaFactorCheckName = { newName: null, oldName: this.alphaFactor.name };

      this.alphaFactorService.checkAlphaFactor(this.alphaFactorCheckName).subscribe((res: any) => {
        if ((res.type == "NOT EXISTS" || res.type == "SAMENAME") && res.statuscode == 200) {
          // console.log("edit alphafactor", this.alphaFactor); return false;

          this.alphaFactorService.updateAlphaFactor(this.alphaFactor).pipe(takeUntil(this.isAlphaFactorDead$)).subscribe((response) => {
            this.alphaFactor = { _id: '-1', name: '', tableLayout: this.defaultAlphaFactorTable };
            modal.close('Close click');
            const tempLog = Object.assign({}, this.log);
            const user = this.userSharingService.currentUser;
            tempLog.user = (user.firstname + ' ' + user.lastname).trim();
            tempLog.date = Date.now();
            tempLog.severity = 1;
            tempLog.message = `Updated alpha factor ${response.data.name}`;
            this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
            window.location.reload();
          });
        }
        else {
          this.errorModal = true;
          this.errorMessageModal = res.message;
          setInterval(() => {
            this.errorModal = false;
          }, 3000);
        }
      });
    }
    else {
      this.validationModal = true;
    }
  }

  deleteRow(modal: NgbActiveModal) {
    // save in db
    if (this.alphaFactor._id !== undefined || this.alphaFactor._id !== null || this.alphaFactor._id !== '') {

      this.alphaFactorService.deleteAlphaFactor(this.alphaFactor._id).pipe(takeUntil(this.isAlphaFactorDead$)).subscribe((response) => {
        if (response.success === true) {
          this.deleteSuccessRespType = true;
          const tableName = this.removeWhiteSpace(this.alphaFactor.name);
          this.alphaFactor = { _id: '-1', name: '', tableLayout: this.defaultAlphaFactorTable };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 2;
          tempLog.message = `Deleted alpha factor ${tableName}`;
          this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
          window.location.reload();
        } else {
          this.deleteSuccessRespType = false;
          this.deleteSuccesResp = response.message;
        }
      })
    }
  }


  public accept(modal: NgbActiveModal) {
    this.modalService.dismissAll(this.modalEdit);
    this.modalService.dismissAll(this.modalAdd);
    this.modalService.dismissAll(this.modalDelete);
    this.modalService.dismissAll(this.modalRefresh);
    modal.close('Close click');

    this.alphaFactor = { _id: '-1', name: '', tableLayout: this.defaultAlphaFactorTable };
    this.deleteSuccessRespType = true;
    this.refreshSuccessRespType = true;
    this.deleteSuccesResp = "";
    this.refreshSuccesResp = "";
    this.refresh();
  }

  applyNumberFormat(value: number, input: HTMLInputElement) {
    input.value = formatNumber(value, 1, 2, 2);
  }

  addAlphaFactorTableRow(): void {
    this.alphaFactor.tableLayout.rows.push(
      { operator: null, value: null, data: new Array(this.alphaFactor.tableLayout.cols.length).fill(null) }
    );
  }

  addAlphaFactorTableCol(): void {
    this.alphaFactor.tableLayout.cols.push(null);
    for (const r of this.alphaFactor.tableLayout.rows) {
      r.data.push(null);
    }
  }

  deleteAlphaFactorTableRow(index: number): void {
    this.alphaFactor.tableLayout.rows.splice(index, 1);
  }

  deleteAlphaFactorTableCol(index: number): void {
    if (this.alphaFactor.tableLayout.cols.length > 2) {
      this.alphaFactor.tableLayout.cols.splice(index, 1);
      for (const r of this.alphaFactor.tableLayout.rows) {
        r.data.splice(index, 1);
      }
    }
  }

  trackByFn(index: any) {
    return index;
  }

}

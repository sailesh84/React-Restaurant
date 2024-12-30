import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TitlePageService } from '@app/core/services/title-page.service';
import { VirtualMachineService } from '@app/core/services/virtual-machine.service';
import { VirtualMachine } from '@app/shared/models/virtual-machine';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { Log } from '@app/shared/models/log';
import { take, takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Component({
  selector: 'app-virtual-machine',
  templateUrl: './virtual-machine.component.html',
  styleUrls: ['./virtual-machine.component.scss']
})
export class VirtualMachineComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Virtual Machine management';
  resetCache = false;

  errorModal = false;
  validationModal = false;
  errorMessageModal = null;

  dtOptions: any = {};
  virtualMachines: VirtualMachine[];
  validateVM: any[] = [];
  state = { isLoaded: false, canConnect: null };
  validationMessage: string = "";

  virtualMachine = { _id: '-1', serverName: '', shortName: '', isActive: true };

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
  private isVirtualMachineDead$ = new Subject();
  private isLogsDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private virtualMachineService: VirtualMachineService,
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
      order: [[2, 'asc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.virtualMachineService.getVirtualMachines(that.resetCache).pipe(takeUntil(this.isVirtualMachineDead$)).subscribe((response) => {
          that.virtualMachines = response.data;

          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.virtualMachines
          });

        }, (error) => {
          that.state.canConnect = false;
          that.state.isLoaded = true;
          that.virtualMachines = [];
          callback({
            data: that.virtualMachines
          });
        });
      },
      columns: [{ data: null }, { data: 'serverName' }, { data: 'shortName' }, { data: 'isActive' }],
      columnDefs: [
        {
          orderable: false,
          targets: [0],
          className: 'td-action',
          render: (data, type, full, meta) => {
            return '<div class="btn-group btn-group-sm" role="group">' +
              '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
              '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
              '<button class="btn btn-outline-warning btn-refresh btn-sm"><i class="material-icons md-center md-sm">refresh</i></button>' +
              '</div>';
          }
        },
        {
          targets: [3],
          render: (data, type, full, meta) => {
            if (data === null || data === undefined || data === '') {
              return data;
            } else {
              if (data === true) {
                return '<span class="badge badge-pill badge-success">Enabled</span>';
              } else {
                return '<span class="badge badge-pill badge-warning">Disabled</span>';
              }
            }
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
            this.virtualMachine = { _id: '-1', serverName: '', shortName: '', isActive: true };
            this.modalService.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: VirtualMachine, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            that.virtualMachine = Object.assign({}, data);
            this.selectedServerName = that.virtualMachine.serverName;
            this.errorModal = false;
            this.errorMessageModal = "";
            that.modalService.open(that.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.virtualMachine = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltRestart = $('td', row).find('button.btn-refresh');
        if (eltRestart) {
          eltRestart.off('click');
          eltRestart.on('click', () => {
            that.virtualMachine = Object.assign({}, data);
            that.modalService.open(that.modalRefresh, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };
    this.socketEvent = this.virtualMachineService.socketEvent;
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
    this.isVirtualMachineDead$.next();
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  validateVirtualMachine() {
    this.validateVM = [];
    const vmSanitizer = {
      _id: this.virtualMachine._id,
      serverName: this.sanitizer.sanitize(SecurityContext.HTML, this.virtualMachine.serverName),
      shortName: this.sanitizer.sanitize(SecurityContext.HTML, this.virtualMachine.shortName),
      isActive: this.virtualMachine.isActive
    }

    for (const prop in vmSanitizer) {
      if (prop !== '_id' && (vmSanitizer[prop] === undefined || vmSanitizer[prop] === null || vmSanitizer[prop] === '')) {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }

  verifyVirtualMachine(): [string, boolean] {
    const vmSanitizer = {
      _id: this.virtualMachine._id,
      serverName: this.sanitizer.sanitize(SecurityContext.HTML, this.virtualMachine.serverName),
      shortName: this.sanitizer.sanitize(SecurityContext.HTML, this.virtualMachine.shortName),
      isActive: this.virtualMachine.isActive
    }
    for (const prop in vmSanitizer) {
      if (prop !== '_id' && (vmSanitizer[prop] === undefined || vmSanitizer[prop] === null || vmSanitizer[prop] === '')) {
        return [prop, false];
      }
    }
    return ["noFieldToValidate", true];
  }

  removeWhiteSpace(name: string) {
    return name.split('%20').join(' ').trim();
  }

  addRow(modal: NgbActiveModal) {
    // save in db 
    if (this.validateVirtualMachine().length <= 0) {
      this.validationModal = false;
      const serverName = this.removeWhiteSpace(this.virtualMachine.serverName);
      this.virtualMachineService.checkVirtualMachine(null, serverName).subscribe((res: any) => {
        if (res.type == "NOT EXISTS" && res.statuscode == 200) {
          this.virtualMachineService.addVirtualMachine(this.virtualMachine).pipe(takeUntil(this.isVirtualMachineDead$)).subscribe((response) => {
            this.virtualMachine = { _id: '-1', serverName: '', shortName: '', isActive: true };
            modal.close('Close click');
            const tempLog = Object.assign({}, this.log);
            const user = this.userSharingService.currentUser;
            tempLog.user = (user.firstname + ' ' + user.lastname).trim();
            tempLog.date = Date.now();
            tempLog.severity = 1;
            tempLog.message = `Added the virtual machine ${response.data.serverName}`;
            this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
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

  transform(value: string): string {
    switch (value) {
      case 'serverName':
        this.virtualMachine.serverName = "";
        return this.validationMessage = "Server Name is required or Incorrect";

      case 'shortName':
        this.virtualMachine.shortName = "";
        return this.validationMessage = "Short Name is required or Incorrect";

      default:
        return this.validationMessage = "Please fill all the required fields";
    }
  }

  saveEditRow(modal: NgbActiveModal) {
    // save in db
    if (this.validateVirtualMachine().length <= 0) {
      this.validationModal = false;
      const serverName = this.removeWhiteSpace(this.virtualMachine.serverName);
      this.virtualMachineService.checkVirtualMachine(this.selectedServerName, serverName).subscribe((res: any) => {
        if ((res.type == "NOT EXISTS" || res.type == "SAMENAME") && res.statuscode == 200) {

          this.virtualMachineService.updateVirtualMachine(this.virtualMachine).pipe(takeUntil(this.isVirtualMachineDead$)).subscribe((response) => {
            this.virtualMachine = { _id: '-1', serverName: '', shortName: '', isActive: true };
            modal.close('Close click');
            const tempLog = Object.assign({}, this.log);
            const user = this.userSharingService.currentUser;
            tempLog.user = (user.firstname + ' ' + user.lastname).trim();
            tempLog.date = Date.now();
            tempLog.severity = 1;
            tempLog.message = `Updated the virtual machine ${response.data.serverName}`;
            this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
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
    if (this.virtualMachine._id !== undefined || this.virtualMachine._id !== null || this.virtualMachine._id !== '') {
      this.virtualMachineService.deleteVirtualMachine(this.virtualMachine._id).pipe(takeUntil(this.isVirtualMachineDead$)).subscribe((response) => {
        if (response.success === true) {
          this.deleteSuccessRespType = true;
          const virtualMachineServerName = this.virtualMachine.serverName;
          this.virtualMachine = { _id: '-1', serverName: '', shortName: '', isActive: true };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 2;
          tempLog.message = `Deleted the vessel type ${virtualMachineServerName}`;
          this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
        } else {
          this.deleteSuccessRespType = false;
          this.deleteSuccesResp = response.message;
        }
      })
    }
  }

  restartServer(modal: NgbActiveModal) {
    this.refreshSuccessRespType = false;

    if (this.virtualMachine.serverName !== undefined || this.virtualMachine.serverName !== null || this.virtualMachine.serverName !== '') {
      this.virtualMachineService.restartServer(this.virtualMachine).pipe(takeUntil(this.isVirtualMachineDead$)).subscribe((response) => {
        this.refreshSuccesResp = response.message;
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 2;
        tempLog.message = `Re-started the server ${this.virtualMachine.serverName}`;
        this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
      })
    }
  }

  public accept(modal: NgbActiveModal) {
    this.modalService.dismissAll(this.modalEdit);
    this.modalService.dismissAll(this.modalAdd);
    this.modalService.dismissAll(this.modalDelete);
    this.modalService.dismissAll(this.modalRefresh);
    modal.close('Close click');

    this.virtualMachine = { _id: '-1', serverName: '', shortName: '', isActive: true };
    this.deleteSuccessRespType = true;
    this.refreshSuccessRespType = true;
    this.deleteSuccesResp = "";
    this.refreshSuccesResp = "";
    this.refresh();
  }

}

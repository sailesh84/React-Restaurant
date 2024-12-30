import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Log } from '@app/shared/models/log';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TitlePageService } from '@app/core/services/title-page.service';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { CountriesService } from '@app/core/services/countries.service';
import { Country } from '@app/shared/models/country';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit, AfterViewInit, OnDestroy {

  title = 'Countries management';

  resetCache = false;
  errorModal = false;

  errorMessageModal = null;

  deleteSuccessRespType: boolean = true;
  deleteSuccesResp: string = "";

  dtOptions: any = {};
  country = { _id: '-1', name: '', code: '', areaCode: '' };
  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };
  state = { isLoaded: false, canConnect: null };
  countries: Country[];
  validateVM: any[] = [];
  validationModal = false;

  validationMessage: string = "";

  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;
  @ViewChild('modalEdit', { static: true }) modalEdit: ElementRef;
  @ViewChild('modalDelete', { static: true }) modalDelete: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isLogsDead$ = new Subject();
  private isCountriesDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private countriesService: CountriesService,
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
      order: [[2, 'desc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.countriesService.getCountries(that.resetCache).pipe(takeUntil(this.isCountriesDead$)).subscribe((response) => {
          that.countries = response.data;
          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.countries
          });
        }, (error) => {
          that.state.canConnect = false;
          that.state.isLoaded = true;
          that.countries = [];
          callback({
            data: that.countries
          });
        });
      },
      columns: [{ data: null }, { data: 'name' }, { data: 'code' }, { data: 'areaCode' }],
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
            return data.toUpperCase();
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
            this.country = { _id: '-1', name: '', code: '', areaCode: '' };
            this.modalService.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: Country, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            this.errorModal = false;
            this.validationModal = false;
            that.country = Object.assign({}, data);
            that.modalService.open(that.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.country = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.countriesService.socketEvent;
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
    this.isCountriesDead$.next();
    this.isLogsDead$.next();
    this.isSocketEventDead$.next();
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  validateCountry() {
    this.validateVM = [];
    const excludes = ['_id'];
    for (const prop in this.country) {
      if ((excludes.includes(prop) === false) && (this.country[prop] === undefined || this.country[prop] === null ||
        this.country[prop] === '' || this.country[prop].length === 0 || Object.keys(this.country[prop]).length === 0)) {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }

  verifyCountry(): [string, boolean] {
    const excludes = ['_id'];
    for (const prop in this.country) {
      if ((excludes.includes(prop) === false) && (this.country[prop] === undefined || this.country[prop] === null ||
        this.country[prop] === '' || this.country[prop].length === 0 || Object.keys(this.country[prop]).length === 0)) {
        return [prop, false];
      }
    }
    return ["noFieldToValidate", true];
  }

  addRow(modal: NgbActiveModal): void {
    // save in db
    if (this.validateCountry().length <= 0) {
      this.country.code = this.country.code.toLowerCase();
      this.countriesService.addCountry(this.country).pipe(takeUntil(this.isCountriesDead$)).subscribe((response) => {
        if (response.success === true) {
          this.country = { _id: '-1', name: '', code: '', areaCode: '' };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 1;
          tempLog.message = `Added the country ${response.data.name}`;
          this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
        } else {
          this.errorModal = true;
          this.errorMessageModal = response.message;
          this.country = { _id: '-1', name: '', code: '', areaCode: '' };
        }
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

      case 'code':
        return this.validationMessage = "ISO 3166-1 code is required";

      case 'areaCode':
        return this.validationMessage = "Area code is required";

      default:
        return this.validationMessage = "Please fill all the required fields";
    }
  }

  saveEditRow(modal: NgbActiveModal) {
    // save in db
    if (this.validateCountry().length <= 0) {
      this.country.code = this.country.code.toLowerCase();
      this.countriesService.updateCountry(this.country).pipe(takeUntil(this.isCountriesDead$)).subscribe((response) => {
        if (response.success === true) {
          this.country = { _id: '-1', name: '', code: '', areaCode: '' };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 1;
          tempLog.message = `Updated the country ${response.data.name}`;
          this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
        } else {
          this.errorModal = true;
          this.errorMessageModal = response.message;
          this.country = { _id: '-1', name: '', code: '', areaCode: '' };
        }
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
    if (this.country._id !== undefined || this.country._id !== null || this.country._id !== '') {
      this.countriesService.deleteCountry(this.country._id).pipe(takeUntil(this.isCountriesDead$)).subscribe((response) => {
        if (response.success === true) {
          this.deleteSuccessRespType = true;
          const nameCountry = this.country.name;
          this.country = { _id: '-1', name: '', code: '', areaCode: '' };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 2;
          tempLog.message = `Deleted the country ${nameCountry}`;
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
      this.errorMessageModal = 'No country to delete.';
    }
  }

  public accept(modal: NgbActiveModal) {
    this.modalService.dismissAll(this.modalEdit);
    this.modalService.dismissAll(this.modalAdd);
    this.modalService.dismissAll(this.modalDelete);
    modal.close('Close click');

    this.country = { _id: '-1', name: '', code: '', areaCode: '' };
    this.deleteSuccessRespType = true;
    this.deleteSuccesResp = "";
    this.refresh();
  }

}


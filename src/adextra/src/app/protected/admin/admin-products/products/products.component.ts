import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product } from '@app/shared/models/product';
import { Log } from '@app/shared/models/log';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '@app/core/services/products.service';
import { TitlePageService } from '@app/core/services/title-page.service';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Product management';

  resetCache = false;

  errorModal = false;
  errorMessageModal = null;

  dtOptions: any = {};
  products: Product[];
  validateVM: any[] = [];
  validationModal = false;

  deleteSuccessRespType: boolean = true;
  deleteSuccesResp: string = "";

  state = { isLoaded: false, canConnect: null };

  product = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)' };

  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };

  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;
  @ViewChild('modalEdit', { static: true }) modalEdit: ElementRef;
  @ViewChild('modalDelete', { static: true }) modalDelete: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isProductsDead$ = new Subject();
  private isLogsDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private productService: ProductsService,
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
      order: [[1, 'asc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.productService.getProducts(that.resetCache).pipe(takeUntil(this.isProductsDead$)).subscribe((response) => {
          that.products = response.data;

          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.products
          });
        }, (error) => {
          that.state.canConnect = false;
          that.state.isLoaded = true;
          that.products = [];
          callback({
            data: that.products
          });
        });
      },
      columns: [{ data: null }, { data: 'name' }, { data: 'color' }],
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
            if (data !== null || data !== '') {
              return '<div style="height: 20px; width: 100%; border: 1px dashed black; background-color: ' + data + '"></div>';
            } else {
              return '';
            }
          }
        }
      ],
      dom:
        '<"row"<"col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-12"l><"col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-6 text-center"B><"col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-3"f>>' +
        '<"row"<"col-sm-12 col-12"tr>>' +
        '<"row"<"col-xs-12 col-sm-12 col-md-6 col-lg-5 col-xl-5 col-12"i><"col-xs-12 col-sm-12 col-md-6 col-lg-7 col-xl-7 col-12"p>>',
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
            this.product = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)' };
            this.modalService.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: Product, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            this.validationModal = false;
            that.product = Object.assign({}, data);
            that.modalService.open(that.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.product = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.productService.socketEvent;
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
    this.isProductsDead$.next();
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  validateProduct() {
    this.validateVM = [];
    for (const prop in this.product) {
      if (prop !== '_id' && (this.product[prop] === undefined || this.product[prop] === null || this.product[prop] === '')) {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }

  verifyProduct() {
    for (const prop in this.product) {
      if (prop !== '_id' && (this.product[prop] === undefined || this.product[prop] === null || this.product[prop] === '')) {
        return false;
      }
    }
    return true;
  }

  addRow(modal: NgbActiveModal): void {
    // save in db
    if (this.validateProduct().length <= 0) {
      this.productService.addProduct(this.product).pipe(takeUntil(this.isProductsDead$)).subscribe((response) => {
        this.product = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)' };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Added the product ${response.data.name}`;
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
    if (this.validateProduct().length <= 0) {
      this.productService.updateProduct(this.product).pipe(takeUntil(this.isProductsDead$)).subscribe((response) => {
        this.product = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)' };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Updated the product ${response.data.name}`;
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
    if (this.product._id !== undefined || this.product._id !== null || this.product._id !== '') {
      this.productService.deleteProduct(this.product._id).pipe(takeUntil(this.isProductsDead$)).subscribe((response) => {
        if (response.success === true) {
          this.deleteSuccessRespType = true;
          const productName = this.product.name;
          this.product = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)' };
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 2;
          tempLog.message = `Deleted the product ${productName}`;
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
      this.errorMessageModal = 'No product to delete.';
    }
  }

  public accept(modal: NgbActiveModal) {
    this.modalService.dismissAll(this.modalEdit);
    this.modalService.dismissAll(this.modalAdd);
    this.modalService.dismissAll(this.modalDelete);
    modal.close('Close click');

    this.product = { _id: '-1', name: '', color: 'rgba(255, 180, 255, 0.96)' };
    this.deleteSuccessRespType = true;
    this.deleteSuccesResp = "";
    this.refresh();
  }

}


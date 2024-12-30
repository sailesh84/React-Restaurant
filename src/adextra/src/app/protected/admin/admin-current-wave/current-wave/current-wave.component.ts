import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CurrentWave } from '@app/shared/models/current-wave';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CurrentWaveService } from '@app/core/services/current-wave.service';
import { TitlePageService } from '@app/core/services/title-page.service';
import { Log } from '@app/shared/models/log';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-current-wave',
    templateUrl: './current-wave.component.html',
    styleUrls: ['./current-wave.component.scss']
})
export class CurrentWaveComponent implements OnInit, AfterViewInit, OnDestroy {

    title = 'Current Wave management';

    resetCache = false;
    errorModal = false;

    errorMessageModal = null;

    dtOptions: any = {};
    // forecaster = { _id: '-1', name: '', authServer: '', dataServer: '', login: '', password: '' };   //check before delete
    log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };
    state = { isLoaded: false, canConnect: null };
    // forecasters: Forecaster[];   //check before delete
    currentWave: CurrentWave[];
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
        // private forecastersService: ForecastersService,  //check before delete
        // private currentWaveService: CurrentWaveService,
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
            ajax: (dataTablesParameters: any, callback) => {    //check before delete
                // that.forecastersService.getForecasters(that.resetCache).pipe(takeUntil(this.isForecastersDead$)).subscribe((response) => {
                //     that.forecasters = response.data;
                //     that.state.canConnect = true;
                //     that.state.isLoaded = true;
                //     that.resetCache = false;
                //     callback({
                //         data: that.forecasters
                //     });
                // }, (error) => {
                //     that.state.canConnect = false;
                //     that.state.isLoaded = true;
                //     that.forecasters = [];
                //     callback({
                //         data: that.forecasters
                //     });
                // });
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
                        // this.forecaster = { _id: '-1', name: '', authServer: '', dataServer: '', login: '', password: '' };  //check before delete
                        this.modalService.open(this.modalAdd, { centered: true, size: 'lg', backdrop: 'static' });
                    },
                    init: (api, node, config) => {
                        $(node).removeClass('btn-secondary');
                    }
                }
            ],
            rowCallback: (row: Node, data: CurrentWave, index: number) => {
                const self = this;
                // Unon first in order to avoid any duplicate handler
                // (see https://github.com/l-lin/angular-datatables/issues/87)
                const eltEdit = $('td', row).find('button.btn-edit');
                if (eltEdit) {
                    eltEdit.off('click');
                    eltEdit.on('click', () => {
                        this.validationModal = false;
                        // that.forecaster = Object.assign({}, data);   //check before delete
                        that.modalService.open(that.modalEdit, { centered: true, size: 'lg', backdrop: 'static' });
                    });
                }
                const eltDelete = $('td', row).find('button.btn-delete');
                if (eltDelete) {
                    eltDelete.off('click');
                    eltDelete.on('click', () => {
                        // that.forecaster = Object.assign({}, data);   //check before delete
                        that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
                    });
                }
                return row;
            }
        };

        // this.socketEvent = this.forecastersService.socketEvent;  //check before delete
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


    addRow(modal: NgbActiveModal): void {
        // save in db
    }

    saveEditRow(modal: NgbActiveModal) {
        // update in db
    }

    deleteRow(modal: NgbActiveModal) {
        // delete in db
    }

    public accept(modal: NgbActiveModal) {
        this.modalService.dismissAll(this.modalEdit);
        this.modalService.dismissAll(this.modalAdd);
        this.modalService.dismissAll(this.modalDelete);
        modal.close('Close click');

        // this.forecaster = { _id: '-1', name: '', authServer: '', dataServer: '', login: '', password: '' };  //check before delete
        this.deleteSuccessRespType = true;
        this.deleteSuccesResp = "";
        this.refresh();
    }
}
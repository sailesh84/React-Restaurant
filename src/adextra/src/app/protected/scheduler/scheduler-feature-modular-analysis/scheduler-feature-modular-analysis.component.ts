import {Scheduler} from '@app/shared/models/scheduler';
import { AfterViewInit, Component, ElementRef, OnDestroy,Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SchedulersService } from '@app/core/services/schedulers.service';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-scheduler-feature-modular-analysis',
  templateUrl: './scheduler-feature-modular-analysis.component.html',
  styleUrls: ['./scheduler-feature-modular-analysis.component.scss']
})
export class SchedulerFeatureModularAnalysisComponent implements OnInit {
  @Input() scheduler: Scheduler;
  dtOptions: any = {};
  @ViewChild('modalRefresh', { static: true }) modalRefresh: ElementRef;

  errorModal = false;
  validationModal = false;
  errorMessageModal = null;
  refreshSuccessRespType: boolean = true;
  modularAnalysis = null;
  socketEvent: Observable<any>;
  private isSchedulersDead$ = new Subject();
  refreshSuccesResp: string = "";

  constructor(private modalService: NgbModal,private changeDetectorRefs: ChangeDetectorRef,private schedulersService: SchedulersService) { 
    
  }

  ngOnChange(){
  }

  

  ngOnInit() {
   this.refresh();

   this.socketEvent = this.schedulersService.socketEvent;
  }

  refresh(){
    const that = this;
    this.dtOptions = {
      destroy: true,
      retrieve: true,
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      data: this.scheduler.modularList,
      order: [[2, 'asc']],
      deferRender: true,
      columns: [{ data: null }, { data: 'name' }, { data: 'folder_name' }, { data: 'enabled' }],
      columnDefs: [
        {
          orderable: false,
          targets: [0],
          className: 'td-action',
          render: (data, type, full, meta) => {
            return '<div class="btn-group btn-group-sm" role="group">' +
              '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
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
      ],
      rowCallback: (row: Node, data: any, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            this.errorModal = false;
            this.errorMessageModal = "";
            that.modularAnalysis = data;
            that.modalService.open(that.modalRefresh, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.changeDetectorRefs.detectChanges();
  }

  scheduleModularAnalysis(modal: NgbActiveModal) {
    this.refreshSuccessRespType = false;

    this.schedulersService.enableModularAnalysis(this.modularAnalysis._id).pipe(takeUntil(this.isSchedulersDead$)).subscribe((response) => {
      this.refreshSuccesResp = response.message;
     
    }, (error) => {
      this.errorModal = true;
      this.errorMessageModal = 'An error occurred on the server side.';
    });
    
  }

  hasModularAnalysis(): boolean {
    return this.scheduler.modularList && this.scheduler.modularList.length > 0;
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

  public accept(modal: NgbActiveModal) {
    this.modalService.dismissAll(this.modalRefresh);
    modal.close('Close click');

    this.modularAnalysis = null;
    this.refreshSuccessRespType = true;
    this.refreshSuccesResp = "";
    this.refresh();
  }

}

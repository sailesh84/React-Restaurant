import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { CountriesService } from '@app/core/services/countries.service';
import { SchedulersService } from '@app/core/services/schedulers.service';
import { take, takeUntil } from 'rxjs/operators';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-scheduler-logs-info',
  templateUrl: './scheduler-logs-info.component.html',
  styleUrls: ['./scheduler-logs-info.component.scss']
})
export class SchedulerLogsInfoComponent implements OnInit {

  @Input() timeRange: any;
  @Input() serverInstance: any;
  @Input() severityLevel: any;
  @Input() start: any;
  @Input() end: any;
  state = { isLoaded: false, canConnect: null };
  serverLogs: any = [];
  resetCache = false;
  dtOptions: any = {};
  schedulerLogs: any = {};
  startDate: any;
  endDate: any;
  checkRefresh: any = false;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  private isSchedulerLogsDead$ = new Subject();

  constructor(private countriesService: CountriesService, private schedulersService: SchedulersService, private changeRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.serverInstance !== null && this.severityLevel !== null) {
      if (this.start === null) {
        this.startDate = "";
      } else {
        this.startDate = moment.utc(this.start).format('YYYY-MM-DDTHH:mm:ss');
      }

      if (this.end === null) {
        this.endDate = "";
      } else {
        this.endDate = moment.utc(this.end).format('YYYY-MM-DDTHH:mm:ss');
      }

      this.schedulerLogs = {
        timerange: this.timeRange,
        server_instance: this.serverInstance,
        severity_level: this.severityLevel,
        time_interval_begin: this.startDate,
        time_interval_end: this.endDate
      };
      this.schedulersService.getSchedulerLogs(this.schedulerLogs).subscribe((response) => {

        this.serverLogs = response.data;

        for (let index = 0; index < this.serverLogs.length; index++) {
          this.serverLogs[index]['time'] =  moment(this.serverLogs[index]['time']).format('YYYY-MM-DD HH:mm:ss')
        }

        this.dtOptions = {
          responsive: true,
          pagingType: 'full_numbers',
          pageLength: 10,
          order: [[2, 'desc']],
          destroy: true,
          deferRender: true,
          data: this.serverLogs,
          columns: [{ data: 'time' , width: '15%'}, { data: 'message' , width: '65%'}, { data: 'server' , width: '10%' }, { data: 'level' , width: '10%' }],
          columnDefs: [],
          dom:
          '<"row"<"col-sm-3 col-12"l><"col-sm-6 col-8 text-center"B><"col-sm-3 col-12"f>>' +
          '<"row"<"col-sm-12 col-12"tr>>' +
          '<"row"<"col-sm-5 col-12"i><"col-sm-7 col-12"p>>',
          stateSave: true,
          buttons: [
            'columnsToggle',
            'copy',
            'print',
            'excel',
          ],
          // rowCallback: () => { }
        }
        this.changeRef.detectChanges();
        this.dtTrigger.next();
      });
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.refresh();
    setInterval(()=> { this.refreshLogsInterval() }, 10000); 
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    // this.isSchedulerLogsDead$.next();
  }

  refreshLogs() {
    if (this.serverInstance !== null && this.severityLevel !== null) {
      if (this.start === null) {
        this.startDate = "";
      } else {
        this.startDate = moment.utc(this.start).format('YYYY-MM-DDTHH:mm:ss');
      }

      if (this.end === null) {
        this.endDate = "";
      } else {
        this.endDate = moment.utc(this.end).format('YYYY-MM-DDTHH:mm:ss');
      }

      this.schedulerLogs = {
        timerange: this.timeRange,
        server_instance: this.serverInstance,
        severity_level: this.severityLevel,
        time_interval_begin: this.startDate,
        time_interval_end: this.endDate
      };
      this.schedulersService.getSchedulerLogs(this.schedulerLogs).subscribe((response) => {
        this.serverLogs = response.data;

        for (let index = 0; index < this.serverLogs.length; index++) {
          this.serverLogs[index]['time'] =  moment(this.serverLogs[index]['time']).format('YYYY-MM-DD HH:mm:ss')
        }

        this.dtOptions = {
          responsive: true,
          pagingType: 'full_numbers',
          pageLength: 10,
          order: [[2, 'desc']],
          destroy: true,
          deferRender: true,
          data: this.serverLogs,
          columns: [{ data: 'time' , width: '15%' }, { data: 'message' , width: '65%'}, { data: 'server' , width: '10%' }, { data: 'level' , width: '10%' }],
          columnDefs: [],
          dom:
          '<"row"<"col-sm-3 col-12"l><"col-sm-6 col-8 text-center"B><"col-sm-3 col-12"f>>' +
          '<"row"<"col-sm-12 col-12"tr>>' +
          '<"row"<"col-sm-5 col-12"i><"col-sm-7 col-12"p>>',
          stateSave: true,
          buttons: [
            'columnsToggle',
            'copy',
            'print',
            'excel',
          ],
          // rowCallback: () => { }
        }
        this.changeRef.detectChanges();
        this.dtTrigger.next();
      });
    }
  }

  refreshLogsInterval() {
    if(this.checkRefresh){
      if (this.serverInstance !== null && this.severityLevel !== null) {

        this.schedulerLogs = {
          timerange: '10m',
          server_instance: this.serverInstance,
          severity_level: this.severityLevel
        };
        this.schedulersService.getSchedulerLogs(this.schedulerLogs).subscribe((response) => {
          this.serverLogs = response.data;
  
          for (let index = 0; index < this.serverLogs.length; index++) {
            this.serverLogs[index]['time'] =  moment(this.serverLogs[index]['time']).format('YYYY-MM-DD HH:mm:ss')
          }
          
          this.dtOptions = {
            responsive: true,
            pagingType: 'full_numbers',
            pageLength: 10,
            order: [[2, 'desc']],
            destroy: true,
            deferRender: true,
            data: this.serverLogs,
            columns: [{ data: 'time' , width: '15%' }, { data: 'message' , width: '65%'}, { data: 'server' , width: '10%' }, { data: 'level' , width: '10%' }],
            columnDefs: [],
            dom:
            '<"row"<"col-sm-3 col-12"l><"col-sm-6 col-8 text-center"B><"col-sm-3 col-12"f>>' +
            '<"row"<"col-sm-12 col-12"tr>>' +
            '<"row"<"col-sm-5 col-12"i><"col-sm-7 col-12"p>>',
            stateSave: true,
            buttons: [
              'columnsToggle',
              'copy',
              'print',
              'excel',
            ],
            // rowCallback: () => { }
          }
          this.changeRef.detectChanges();
          this.dtTrigger.next();
        });
      }
    }
    
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }


}

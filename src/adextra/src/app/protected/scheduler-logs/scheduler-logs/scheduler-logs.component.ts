import { AfterViewInit, Component, OnDestroy, OnInit, Input, forwardRef, ViewChild, Injector } from '@angular/core';
import { SchedulersService } from '@app/core/services/schedulers.service';
import { VirtualMachineService } from '@app/core/services/virtual-machine.service';
import { forkJoin, Observable, Subject, noop } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { TitlePageService } from '@app/core/services/title-page.service';
import { DateTimeModel } from '@app/shared/models/date-time.model';

import {
  NgbTimeStruct,
  NgbDateStruct,
  NgbPopoverConfig,
  NgbPopover,
  NgbDatepicker,
  NgbTimepicker
} from '@ng-bootstrap/ng-bootstrap';

import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl
} from '@angular/forms';

import * as moment_ from 'moment';
import { DatePipe } from '@angular/common';

const moment = moment_;
@Component({
  selector: 'app-scheduler-logs',
  templateUrl: './scheduler-logs.component.html',
  styleUrls: ['./scheduler-logs.component.scss'],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SchedulerLogsComponent),
      multi: true
    }
  ]
})
export class SchedulerLogsComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  state = { isLoaded: false, canConnect: null };
  resetCache = false;
  schedulerLogs = {
    timerange: "30m",
    start: null,
    end: null,
    server_instance: null,
    severity_level: null
  }

  rangeType = 0;

  bsValue = new Date();
  isDisabled = true;

  virtualMachineList = [];

  rangeTypeList = [
    { _id: 0, name: 'Time range' },
    { _id: 1, name: 'Specific date and time' },
  ];

  timerangeList = [
    { _id: "0", name: "Select an option" },
    { _id: "30m", name: "Last 30 minutes" },
    { _id: "1h", name: "Last hour" },
    { _id: "4h", name: "Last 4 hours" },
    { _id: "12h", name: "Last 12 hours" },
    { _id: "28h", name: "Last 28 hours" },
    { _id: "48h", name: "Last 48 hours" },
    { _id: "3d", name: "Last 3 days" },
  ];
  severityLevelList = [
    { _id: 'all', name: 'All' },
    { _id: 1, name: 'Information' },
    { _id: 2, name: 'Warning' },
    { _id: 3, name: 'Error' },
  ];
  logs: any[];

  selectedVm: any;
  selectedTimerange: any;
  selectedSeverityLevel: any;

  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isVirtualMachineDead$ = new Subject();
  private isSchedulersLogsDead$ = new Subject();
  title = 'Scheduler Logs';

  @Input() dateString: string;
  @Input() inputDatetimeFormat = 'd/M/yyyy H:mm:ss';
  @Input() hourStep = 1;
  @Input() minuteStep = 15;
  @Input() secondStep = 30;
  @Input() seconds = true;
  @Input() disabled = false;

  private datetime: DateTimeModel = new DateTimeModel();
  private dateEndtime: DateTimeModel = new DateTimeModel();
  private showTimePickerToggle = false;
  private firstTimeAssign = true;

  // @ViewChild(NgbDatepicker, null)
  // private dp: NgbDatepicker;

  @ViewChild(NgbPopover, { static: true })
  private popover: NgbPopover;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  public ngControl: NgControl;

  // dateStruct: NgbDateStruct;
  // timeStruct: NgbTimeStruct;
  // date: Date;

  constructor(
    private schedulersService: SchedulersService,
    private virtualMachineService: VirtualMachineService,
    private titlePageService: TitlePageService,
    private config: NgbPopoverConfig,
    private inj: Injector
  ) {
    this.titlePageService.setTitle(this.title);
    config.autoClose = 'outside';
    config.placement = 'auto';
  }

  ngOnInit() {
    this.getData();
    this.socketEvent = this.schedulersService.socketEvent;
    const nowDate = new Date();

    var twoHoursBefore = new Date();
    twoHoursBefore.setHours(twoHoursBefore.getHours() - 1);

    const nowDateUTCMinsAgo = twoHoursBefore.toUTCString();

    const nowDateUTC = nowDate.toUTCString();
    this.datetime = Object.assign(
      this.datetime,
      DateTimeModel.fromLocalString(nowDateUTCMinsAgo)
    );
    this.dateEndtime = Object.assign(
      this.dateEndtime,
      DateTimeModel.fromLocalString(nowDateUTC)
    );
    this.schedulerLogs.start = nowDateUTCMinsAgo;
    this.schedulerLogs.end = nowDateUTC;
  }

  ngAfterViewInit(): void {
    this.socketEvent.pipe(takeUntil(this.isSocketEventDead$)).subscribe(() => {
      this.resetCache = true;
      this.getData();
    });
  }

  ngOnDestroy(): void {
    this.isSocketEventDead$.next();
    this.isVirtualMachineDead$.next();
    this.isSchedulersLogsDead$.next();
  }

  refresh(): void {
    this.resetCache = true;
    this.getData();
  }

  getData(): void {
    forkJoin([
      this.virtualMachineService.getVirtualMachines(this.resetCache).pipe(takeUntil(this.isVirtualMachineDead$))
    ]
    ).subscribe((response) => {
      this.virtualMachineList = response[0].data;
    });
  }

  getVMlist(vmLists: any[]) {
    vmLists.filter((elt) => {
      if (elt.isActive === true) {
        this.virtualMachineList.push(elt);
      }
    });
  }

  onTimerangeChange(event): void {
    this.selectedTimerange = event;
    if (event) {
      this.schedulerLogs.timerange = this.selectedTimerange._id;
      if (this.selectedTimerange._id == "0") {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    } else {
      this.isDisabled = true;
    }
  }

  onRageTypeChange(event): void {

    if(event && event._id == 1){
      this.schedulerLogs.timerange = "0";
      this.isDisabled = false;
    }
  }

  onServerInstanceChange(event): void {
    this.selectedVm = event;
    if (event) {
      this.schedulerLogs.server_instance = this.selectedVm.serverName;
    }
  }

  onSeverityLevelChange(event): void {
    this.selectedSeverityLevel = event;
    if (event) {
      this.schedulerLogs.severity_level = this.selectedSeverityLevel._id;
    }
  }

  submitSchedulerLogs() {

    this.state.canConnect = false;
    this.state.isLoaded = false;
    this.resetCache = true;

    if (this.schedulerLogs.timerange !== null && this.schedulerLogs.severity_level !== null && this.schedulerLogs.server_instance !== null) {
      this.resetCache = false;
       this.state.canConnect = true;
       this.state.isLoaded = true;
    }
  }

  writeValue(newModel: string) {
    // console.log("newModel", newModel);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange($event: any) {
    // console.log('on input change', $event);
  }

  onDateChange($event: string | NgbDateStruct, dp: NgbDatepicker) {
    if (dp.model.focusDate) {
      let dpSName = "startDate";
      let res = this.getdhm($event);
      const date = new DateTimeModel(res);

      // if (!date) {
      //   this.dateString = this.dateString;
      //   return;
      // }

      if (!this.datetime) {
        this.datetime = date;
      }

      this.datetime.year = date.year;
      this.datetime.month = date.month;
      this.datetime.day = date.day;

      const adjustedDate = new Date(this.datetime.toString());
      if (this.datetime.timeZoneOffset !== adjustedDate.getTimezoneOffset()) {
        this.datetime.timeZoneOffset = adjustedDate.getTimezoneOffset();
      }
      this.setDateStringModel(dpSName);
    }
  }

  onEndDateChange($event: string | NgbDateStruct, dp1: NgbDatepicker) {
    if (dp1.model.focusDate) {
      let dpEName = "endDate";
      let res = this.getdhm($event);
      const date = new DateTimeModel(res);

      // if (!date) {
      //   this.dateString = this.dateString;
      //   return;
      // }

      if (!this.dateEndtime) {
        this.dateEndtime = date;
      }

      this.dateEndtime.year = date.year;
      this.dateEndtime.month = date.month;
      this.dateEndtime.day = date.day;

      const adjustedDate = new Date(this.dateEndtime.toString());
      if (this.dateEndtime.timeZoneOffset !== adjustedDate.getTimezoneOffset()) {
        this.dateEndtime.timeZoneOffset = adjustedDate.getTimezoneOffset();
      }
      this.setDateStringModel(dpEName);
    }
  }

  getdhm(timestamp) {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = { "day": day, "month": month, "year": year };
    return formattedDate;
  }

  onTimeChange($event: NgbTimeStruct, tp: NgbTimepicker) {
    if (tp.model) {
      let tpSName = "startTime";
      let res = this.gethms($event);
      if (res) {
        this.datetime.hour = res.hour;
        this.datetime.minute = res.minute;
        this.datetime.second = res.second;

        this.setDateStringModel(tpSName);
      }
    }
  }

  onEndTimeChange($event: NgbTimeStruct, tp1: NgbTimepicker) {
    if (tp1.model) {
      let tpEName = "endTime";
      let res = this.gethms($event);
      if (res) {
        this.dateEndtime.hour = res.hour;
        this.dateEndtime.minute = res.minute;
        this.dateEndtime.second = res.second;

        this.setDateStringModel(tpEName);
      }
    }
  }

  gethms(time) {
    if (!time) {
      return null;
    }

    const split = time.toString().split(':');
    const formattedTime = {
      hour: parseInt(split[0], 10),
      minute: parseInt(split[1], 10),
      second: parseInt(split[2], 10)
    };
    return formattedTime;
  }

  setDateStringModel(dt: string) {
    if (dt === "startDate" || dt === "startTime") {
      this.schedulerLogs.start = this.datetime.toString();
      this.state.canConnect = false;
      this.state.isLoaded = false;
    } else if (dt === "endDate" || dt === "endTime") {
      this.schedulerLogs.end = this.dateEndtime.toString();
      this.state.canConnect = false;
      this.state.isLoaded = false;
    }

    // if (!this.firstTimeAssign) {
    //   this.onChange(this.dateString);
    // } else {
    //   // Skip very first assignment to null done by Angular
    //   if (this.dateString !== null) {
    //     this.firstTimeAssign = false;
    //   }
    // }
  }

  inputBlur($event) {
    // console.log("on-blur", $event);
    // this.onTouched();
  }

}

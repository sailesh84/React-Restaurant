import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '@app/shared/models/user';
import { Scheduler } from '@app/shared/models/scheduler';
import { VirtualMachine } from '@app/shared/models/virtual-machine';
import { Project } from '@app/shared/models/project';
import { Vessel } from '@app/shared/models/vessel';
import { Forecaster } from '@app/shared/models/forecaster';
import { Client } from '@app/shared/models/client';
import { forkJoin, Observable, Subject } from 'rxjs';
import { Log } from '@app/shared/models/log';
import { take, takeUntil } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '@app/core/services/users.service';
import { VesselsService } from '@app/core/services/vessels.service';
import { ProjectsService } from '@app/core/services/projects.service';
import { ProductsService } from '@app/core/services/products.service';
import { ClientsService } from '@app/core/services/clients.service';
import { ForecastersService } from '@app/core/services/forecasters.service';
import { VirtualMachineService } from '@app/core/services/virtual-machine.service';
import { AlphaFactorService } from '@app/core/services/alpha-factor.service';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { SchedulersService } from '@app/core/services/schedulers.service';
import Stepper from 'bs-stepper';
import { TaskScheduler } from '@app/shared/models/task-scheduler';
import { Time } from '@app/shared/enums/time.enums';
import * as moment from 'moment-timezone';
import { formatNumber } from '@app/shared/helpers/math';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Action } from 'rxjs/internal/scheduler/Action';
import { WebSpectrumService } from '@app/core/services/web-spectrum.service';

@Component({
  selector: 'app-scheduler-features',
  templateUrl: './scheduler-features.component.html',
  styleUrls: ['./scheduler-features.component.scss']
})
export class SchedulerFeaturesComponent implements OnInit, OnDestroy, AfterViewInit {

  resetCache = false;
  errorModal = false;
  isVmActive: boolean = true;
  isActionActive: boolean = true;
  isActiveForecasterBtn: boolean = false;
  isDisabledWaveForecaster: boolean = true;
  projects: Project[];
  vessels: Vessel[];
  forecasters: Forecaster[];
  forecastersWS: Forecaster[];
  clients: Client[];
  vesselsList: Vessel[];
  schedulers: Scheduler[];
  wheaterList = [];
  waveList = [];
  virtualMachineList = [];
  validateVM: any[] = [];
  modularAnalysisList = [];
  alphaFactorList = [];
  validationModal = false;
  filteredSchedulers: any[];

  products: any[];
  filteredProducts: any[];
  selectedVirtualMachine = 1;
  contact: string;
  selectedAlphaFactorTableName: string = null;

  hpcDefault: string;
  prefixSchName: string = "Copy";

  currentStep = 0;
  selectedProjects: any;
  rmPlaceHolder: string = "Select your Virtual Machine Code";
  selectedSName: string = "";
  validationMessage: string = "";
  currentRoute: string;
  responseMessage: string = "";
  forecastersScheduler: [string, { name: string, subscription: string }][];
  forecastersWaveScheduler: [string, { name: string, subscription: string }][];
  state = { isLoaded: false, canConnect: null };
  errorMessageModal = null;
  currentSchedulerId = null;
  runningHrs = [];
  previousTasks: number = 0;
  nextTasks: number = 0;

  deleteSuccessRespType: boolean = true;
  deleteSuccesResp: string = "";
  isDisabledBtn: boolean = false;
  testingList = [
    { value: 'Weathervaning', label: 'Weathervaning' },
    { value: 'Non Weathervaning', label: 'Non Weathervaning' },
  ];
  currentWaveList = [
    { value: 'SatOcean', label: 'SatOcean' },
    { value: 'Fugro', label: 'Fugro' },
    { value: 'StormGeo', label: 'StormGeo' }
  ];
  selectedTestingVal = null;
  isDisabledTesting: boolean = true;
  isDisabledForecaster: boolean = false;

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

  runModeList = ['Virtual Machine', 'Local run', 'HPC services'];
  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };
  selectedRunModeList = { option: 'Virtual Machine' };
  selectedWheaterList = { option: 'Forecaster' };
  selectedCWList = { option: 'Current Forcaster' };
  scheduler: Scheduler = { //with current and wave params
    _id: null, alphaFactor: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable, analysis: true,
    isMaster: true, project: null, vessel: null, contact: null, product: null, productName: null, productType: null,
    productTypeId: null, hideScheduler: null, cwd: null, scripts: [], name: null, fatigue: true, done: false, rmType: this.selectedRunModeList.option,
    forecasters: new Map(), current: false, waveSpectrum: false, current_data: null, testing: this.isActiveForecasterBtn, testingOptions: null, vm: null,
    access: 0, hours: [], tasks: [], modularList: [], isCurrentlyRunning: false, wave: []
  };

  selectedAlphaFactorTable: any[]

  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;
  @ViewChild('modalEdit', { static: true }) modalEdit: ElementRef;
  @ViewChild('modalDelete', { static: true }) modalDelete: ElementRef;
  @ViewChild('modalCopy', { static: true }) modalCopy: ElementRef;
  @ViewChild('modalConfirm', { static: true }) modalConfirm: ElementRef;
  @ViewChild('modalMessage', { static: true }) modalMessage: ElementRef;
  @ViewChild('modalValidationMessage', { static: true }) modalValidationMessage: ElementRef;

  private isSocketEventDead$ = new Subject();
  private isProjectsDead$ = new Subject();
  private isProductDead$ = new Subject();
  private isLogsDead$ = new Subject();
  private isVesselsDead$ = new Subject();
  private isClientsDead$ = new Subject();
  private isForecastersDead$ = new Subject();
  private isSchedulersDead$ = new Subject();
  private isVirtualMachineDead$ = new Subject();
  private isAlphaFactorDead$ = new Subject();
  private isUserDead$ = new Subject();

  socketEvent: Observable<any>;

  private stepper: Stepper;
  private stepperAddRef: HTMLElement = null;
  private stepperEditRef: HTMLElement = null;

  constructor(
    private modalService: NgbModal,
    private vesselsService: VesselsService,
    private schedulersService: SchedulersService,
    private virtualMachineService: VirtualMachineService,
    private alphaFactorService: AlphaFactorService,
    private projectsService: ProjectsService,
    private productsService: ProductsService,
    private clientsService: ClientsService,
    private forecastersService: ForecastersService,
    private userSharingService: UserSharingService,
    private webSpectrumService: WebSpectrumService,
    private logsService: LogsService,
    private usersService: UsersService,
  ) { }

  ngOnInit() {
    this.getData();
    this.socketEvent = this.schedulersService.socketEvent;
    this.currentRoute = window.location.hostname;
    this.selectedTestingVal = this.testingList[0];

    // QA Server OR UAT Server
    if (this.currentRoute === "infieldportal-qa.lab.technipfmc.com" || this.currentRoute === "infieldportal-uat.lab.technipfmc.com") {
      this.wheaterList = ['Forecaster', 'Testing', 'Wave Spectrum'];
      this.waveList = ['Current Forcaster'];
    } else if (this.currentRoute === "infieldportal.apps.technipfmc.com" && this.userSharingService.currentUser.access === 6) { // Prod Server with Admin user only
      this.wheaterList = ['Forecaster', 'Testing', 'Wave Spectrum'];
      this.waveList = ['Current Forcaster'];
    }
    else if (this.currentRoute === "infieldportal.apps.technipfmc.com") { // Prod Server
      this.wheaterList = ['Forecaster'];
      this.waveList = ['Current Forcaster'];
      this.scheduler.testing = false;
    } else { // Localhost
      this.wheaterList = ['Forecaster', 'Testing', 'Wave Spectrum'];
      this.waveList = ['Current Forcaster'];
    }
  }

  ngAfterViewInit(): void {
    this.socketEvent.pipe(takeUntil(this.isSocketEventDead$)).subscribe(() => {
      this.resetCache = true;
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.isSocketEventDead$.next();
    this.isProjectsDead$.next();
    this.isLogsDead$.next();
    this.isVesselsDead$.next();
    this.isClientsDead$.next();
    this.isForecastersDead$.next();
    this.isSchedulersDead$.next();
    this.isUserDead$.next();
  }

  nextStep() { 
    if (this.scheduler.waveSpectrum === true) {
      this.scheduler.wave = [].concat.apply([], this.forecastersScheduler);
      this.scheduler.forecasters = [];
      if (this.validateScheduler().length <= 0) {
        this.validationModal = false;
        this.currentStep += 1;
        this.stepper.next();
      }
      else {
        this.validationModal = true;
      }
    }
    else {
      this.scheduler.forecasters = this.forecastersScheduler;
      this.scheduler.wave = [];
      if (this.validateScheduler().length <= 0) {
        this.validationModal = false;
        this.currentStep += 1;
        this.stepper.next();
      }
      else {
        this.validationModal = true;
      }
    }
  }

  previousStep() {
    this.currentStep -= 1;
    this.stepper.previous();
  }

  refresh(): void {
    this.resetCache = true;
    this.getData();
  }

  getData(): void {
    forkJoin([
      this.schedulersService.getSchedulers(this.resetCache).pipe(takeUntil(this.isSchedulersDead$)),
      this.projectsService.getProjects(this.resetCache).pipe(takeUntil(this.isProjectsDead$)),
      this.productsService.getProducts(this.resetCache).pipe(takeUntil(this.isProductDead$)),
      this.vesselsService.getEnabledVessels(this.resetCache).pipe(takeUntil(this.isVesselsDead$)),
      this.clientsService.getClients(this.resetCache).pipe(takeUntil(this.isClientsDead$)),
      this.forecastersService.getForecasters(this.resetCache).pipe(takeUntil(this.isForecastersDead$)),
      this.virtualMachineService.getVirtualMachines(this.resetCache).pipe(takeUntil(this.isVirtualMachineDead$)),
      this.schedulersService.getModularAnalysis(this.resetCache).pipe(takeUntil(this.isVirtualMachineDead$)),
      this.alphaFactorService.getAlphaFactors(this.resetCache).pipe(takeUntil(this.isAlphaFactorDead$)),
      this.webSpectrumService.getWaveSpectras(this.resetCache).pipe(takeUntil(this.isAlphaFactorDead$))
    ]
    ).subscribe((response) => {
      this.schedulers = response[0].data;
      this.projects = response[1].data;
      this.products = response[2].data;
      this.vessels = response[3].data;
      this.clients = response[4].data;
      this.forecasters = response[5].data;
      this.getVMlist(response[6].data);
      this.modularAnalysisList = response[7].data;
      this.alphaFactorList = response[8].data;
      this.forecastersWS = response[9].data;
      // this.virtualMachineList = response[6].data;

      if (this.schedulers && this.projects) {
        let filteredProjects = this.projects.filter((elem) => elem.disabled === false); //need changed here
        this.filteredSchedulers = this.schedulers.filter((el) => {

          if (el.hideScheduler && el.hideScheduler === "Show") {
            return filteredProjects.some((f) => {
              return f._id === el.project;
            });
          }
        });
      }

      this.vesselsList = [];
      this.forecastersScheduler = [];
      this.forecastersWaveScheduler = [];
      this.state.canConnect = true;
      this.state.isLoaded = true;
      this.resetCache = false;

    }, error => {
      this.schedulers = [];
      this.projects = [];
      this.products = [];
      this.vessels = [];
      this.clients = [];
      this.forecasters = [];
      this.forecastersScheduler = [];
      this.forecastersWaveScheduler = [];
      this.vesselsList = [];
      this.products = [];
      this.state.canConnect = false;
      this.state.isLoaded = true;
    });
  }

  getVMlist(vmLists: any[]) {
    vmLists.filter((elt) => {
      if (elt.isActive === true) {
        this.virtualMachineList.push(elt);
      }
    });
  }

  schedulerSearchFn = (term: string, item: Scheduler): boolean => {
    term = term.toLocaleLowerCase();
    return item.name.toLocaleLowerCase().includes(term);

    // if (item) {
    //   const project = this.getProject(item.project);
    //   const vessel = this.getVessel(item.vessel);

    //   let client = '';
    //   if (project) {
    //     const c = this.getClient(project.client);
    //     client = (c) ? c.name : '';
    //   }
    //   if (project && vessel) {
    //     return (project.name != null) ? project.name.trim().toLowerCase().includes(term) :
    //       project.name.toLowerCase().includes(term) ||
    //         (project.code != null) ? project.code.trim().toLowerCase().includes(term) :
    //         project.code.toLowerCase().includes(term) ||
    //           (vessel.name != null) ? vessel.name.trim().toLowerCase().includes(term) :
    //           vessel.name.toLowerCase().includes(term) ||
    //             (client != null) ? client.trim().toLowerCase().includes(term) :
    //             client.toLowerCase().includes(term) ||
    //               (item.name != null) ? item.name.trim().toLowerCase().includes(term) :
    //               item.name.toLowerCase().includes(term);

    //   } else {
    //     if (project) {

    //       return (project.name != null) ? project.name.trim().toLowerCase().includes(term) :
    //         project.name.toLowerCase().includes(term) ||
    //           (project.code != null) ? project.code.trim().toLowerCase().includes(term) :
    //           project.code.toLowerCase().includes(term) ||
    //             (client != null) ? client.trim().toLowerCase().includes(term) :
    //             client.toLowerCase().includes(term) ||
    //               (item.name != null) ? item.name.trim().toLowerCase().includes(term) :
    //               item.name.toLowerCase().includes(term);

    //     } else if (vessel) {

    //       return (vessel.name != null) ? vessel.name.trim().toLowerCase().includes(term) :
    //         vessel.name.toLowerCase().includes(term) ||
    //           (item.name != null) ? item.name.trim().toLowerCase().includes(term) :
    //           item.name.toLowerCase().includes(term);

    //     } else {

    //       return (item.name != null) ? item.name.trim().toLowerCase().includes(term) :
    //         item.name.toLowerCase().includes(term);

    //     }
    //   }
    // } else {
    //   return false;
    // }
  }

  getSchedulerName(name: string, vessel: Vessel): string {
    let str = `Scheduler ${name}`;
    if (vessel) {
      str += ` (${vessel.name})`;
    }
    return str;
  }

  getGroupName(project: Project): string {
    let str = '';
    if (project) {
      str += ` ${project.code}`;
      const client = this.getClient(project.client);
      if (client) {
        str += ` ${client.name.toUpperCase()}`;
      }
      str += ` ${project.name}`;
    }
    return (str && str.length > 0) ? str : 'Unnamed group';
  }

  getProject(id: string): Project {
    return this.projects.find((elt) => elt._id === id);
  }

  getClient(id: string): Client {
    return this.clients.find((elt) => elt._id === id);
  }

  getVessel(id: string): Vessel {
    return this.vessels.find((elt) => elt._id === id);
  }

  validateScheduler() {
    if (this.scheduler.testing === true) {  // required field for testingOptions
      this.validateVM = [];
      const excludes = ['_id', 'status', 'disabled', 'done', 'alphaFactorTable', 'alphaFactor', 'alphaFactorTableName', 'testing', 'analysis', 'isMaster', 'fatigue', 'access', 'tasks', 'forecasters', 'contact', 'startInHours', 'modularList', 'isCurrentlyRunning', 'current_data', 'current', 'waveSpectrum', 'wave'];

      for (const prop in this.scheduler) {
        if ((excludes.includes(prop) === false) && (this.scheduler[prop] === undefined || this.scheduler[prop] === null ||
          this.scheduler[prop] === '' || this.scheduler[prop].length === 0 || Object.keys(this.scheduler[prop]).length === 0)) {
          this.validateVM.push(prop);
        }
      }
      return this.validateVM;
    }
    else {
      this.validateVM = [];
      const excludes = ['_id', 'status', 'disabled', 'done', 'alphaFactorTable', 'alphaFactor', 'alphaFactorTableName', 'testing', 'testingOptions', 'analysis', 'isMaster', 'fatigue', 'access', 'tasks', 'forecasters', 'contact', 'startInHours', 'modularList', 'isCurrentlyRunning', 'current_data', 'current', 'waveSpectrum', 'wave'];
      for (const prop in this.scheduler) {
        if ((excludes.includes(prop) === false) && (this.scheduler[prop] === undefined || this.scheduler[prop] === null ||
          this.scheduler[prop] === '' || this.scheduler[prop].length === 0 || Object.keys(this.scheduler[prop]).length === 0)) {
          this.validateVM.push(prop);
        }
      }
      return this.validateVM;
    }
  }

  verifyScheduler(): [string, boolean] {
    // const excludes = ['_id', 'status', 'done', 'alphaFactorTable', 'alphaFactor', 'testing', 'testingOptions', 'analysis', 'isMaster', 'fatigue', 'access', 'tasks', 'forecasters', 'productName', 'productType', 'contact'];
    const excludes = ['_id', 'status', 'done', 'alphaFactorTable', 'alphaFactor', 'testing', 'analysis', 'isMaster', 'fatigue', 'access', 'tasks', 'forecasters', 'productName', 'productType', 'contact'];
    for (const prop in this.scheduler) {
      if ((excludes.includes(prop) === false) && (this.scheduler[prop] === undefined || this.scheduler[prop] === null ||
        this.scheduler[prop] === '' || this.scheduler[prop].length === 0 || Object.keys(this.scheduler[prop]).length === 0)) {
        return [prop, false];
      }
    }
    return ["noFieldToValidate", true];
  }

  removeWhiteSpace(name: string) {
    return name.split('%20').join(' ').trim();
  }

  addRow(modal: NgbActiveModal, status) {
    // save in db    
    // checking wave spectrum
    if (this.scheduler.waveSpectrum === true) {
      this.scheduler.wave = [].concat.apply([], this.forecastersScheduler);
      this.scheduler.forecasters = [];
    }
    else {
      this.scheduler.forecasters = this.forecastersScheduler;
      this.scheduler.wave = [];
    }

    this.scheduler.access = this.userSharingService.currentUser.access;
    this.scheduler.contact = this.contact;
    this.scheduler.alphaFactorTableName = this.selectedAlphaFactorTableName;
    let statusRow = 'add';
    this.adaptTimeToUtcTimezone(statusRow);
    
    // this.scheduler.testingOptions = "One";
    // this.scheduler.testing = false;
    // let fieldToValidate = this.verifyScheduler();

    if (this.validateScheduler().length <= 0) {
      const schedulerName = this.removeWhiteSpace(this.scheduler.name);
      if (status === "add") {
        this.schedulersService.getSchedulerName(null, schedulerName).subscribe((res: any) => {
          if (res.type == "NOT EXISTS" && res.statuscode == 200) {

            const chkTaskValidate = this.onValidateTasks(this.scheduler); //validation for duplicate tasks
            if (this.scheduler.alphaFactor === false) { //if alphafactor is off
              // console.log("add-scheduler", this.scheduler); return false;

              if (chkTaskValidate === true) {
                this.schedulersService.addScheduler(this.scheduler).pipe(takeUntil(this.isSchedulersDead$)).subscribe((response) => {
                  this.scheduler = { //with current and wave params
                    _id: null, alphaFactor: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable, analysis: true,
                    isMaster: true, project: null, vessel: null, contact: null, product: null, productName: null, productType: null,
                    productTypeId: null, hideScheduler: null, cwd: null, scripts: [], name: null, fatigue: true, done: false, rmType: this.selectedRunModeList.option,
                    forecasters: new Map(), current: false, waveSpectrum: false, current_data: null, testing: this.isActiveForecasterBtn, testingOptions: null, vm: null,
                    access: 0, hours: [], tasks: [], modularList: [], isCurrentlyRunning: false, wave: []
                  };

                  this.runningHrs = [];
                  this.virtualMachineList = [];
                  this.forecastersScheduler = [];
                  this.forecastersWaveScheduler = [];
                  this.currentSchedulerId = null;
                  this.stepper.reset();
                  this.currentStep = 0;
                  modal.close('Close click');
                  const tempLog = Object.assign({}, this.log);
                  const user = this.userSharingService.currentUser;
                  const schedulerName = this.getSchedulerName(response.data.name, this.getVessel(response.data.vessel));
                  tempLog.user = (user.firstname + ' ' + user.lastname).trim();
                  tempLog.date = Date.now();
                  tempLog.severity = 1;
                  tempLog.message = `Added the ${schedulerName}`;
                  this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
                }, (error) => {
                  this.errorModal = true; ''
                  this.errorMessageModal = 'An error occurred on the server side.';
                });
              }
            }
            else {  //if alphafactor is on
              const chkTaskAFTableValidate = this.onValidateAFTable(this.scheduler); //validation for empty AF table name
              // console.log("add-scheduler", this.scheduler); return false; 

              if (chkTaskValidate === true && chkTaskAFTableValidate === true) {
                this.schedulersService.addScheduler(this.scheduler).pipe(takeUntil(this.isSchedulersDead$)).subscribe((response) => {
                  this.scheduler = { //with current and wave params
                    _id: null, alphaFactor: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable, analysis: true,
                    isMaster: true, project: null, vessel: null, contact: null, product: null, productName: null, productType: null,
                    productTypeId: null, hideScheduler: null, cwd: null, scripts: [], name: null, fatigue: true, done: false, rmType: this.selectedRunModeList.option,
                    forecasters: new Map(), current: false, waveSpectrum: false, current_data: null, testing: this.isActiveForecasterBtn, testingOptions: null, vm: null,
                    access: 0, hours: [], tasks: [], modularList: [], isCurrentlyRunning: false, wave: []
                  };

                  this.runningHrs = [];
                  this.virtualMachineList = [];
                  this.forecastersScheduler = [];
                  this.currentSchedulerId = null;
                  this.stepper.reset();
                  this.currentStep = 0;
                  modal.close('Close click');
                  const tempLog = Object.assign({}, this.log);
                  const user = this.userSharingService.currentUser;
                  const schedulerName = this.getSchedulerName(response.data.name, this.getVessel(response.data.vessel));
                  tempLog.user = (user.firstname + ' ' + user.lastname).trim();
                  tempLog.date = Date.now();
                  tempLog.severity = 1;
                  tempLog.message = `Added the ${schedulerName}`;
                  this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
                }, (error) => {
                  this.errorModal = true; ''
                  this.errorMessageModal = 'An error occurred on the server side.';
                });
              }
            }
          }
          else {
            this.errorModal = true;
            this.errorMessageModal = res.message;
          }
        });
      }
      else if (status === "copy") {

        this.schedulersService.getSchedulerName(this.selectedSName, schedulerName).subscribe((res: any) => {
          if (res.type == "NOT EXISTS" && res.statuscode == 200) {

            const chkTaskValidate = this.onValidateTasks(this.scheduler); //validation for duplicate tasks
            if (this.scheduler.alphaFactor === false) { //if alphafactor is off
              // console.log("copy-scheduler", this.scheduler); return false;

              if (chkTaskValidate === true) {
                this.schedulersService.addScheduler(this.scheduler).pipe(takeUntil(this.isSchedulersDead$)).subscribe((response) => {
                  this.scheduler = { //with current and wave params
                    _id: null, alphaFactor: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable, analysis: true,
                    isMaster: true, project: null, vessel: null, contact: null, product: null, productName: null, productType: null,
                    productTypeId: null, hideScheduler: null, cwd: null, scripts: [], name: null, fatigue: true, done: false, rmType: this.selectedRunModeList.option,
                    forecasters: new Map(), current: false, waveSpectrum: false, current_data: null, testing: this.isActiveForecasterBtn, testingOptions: null, vm: null,
                    access: 0, hours: [], tasks: [], modularList: [], isCurrentlyRunning: false, wave: []
                  };

                  this.runningHrs = [];
                  this.virtualMachineList = [];
                  this.forecastersScheduler = [];
                  this.forecastersWaveScheduler = [];
                  this.currentSchedulerId = null;
                  this.stepper.reset();
                  this.currentStep = 0;
                  modal.close('Close click');
                  const tempLog = Object.assign({}, this.log);
                  const user = this.userSharingService.currentUser;
                  const schedulerName = this.getSchedulerName(response.data.name, this.getVessel(response.data.vessel));
                  tempLog.user = (user.firstname + ' ' + user.lastname).trim();
                  tempLog.date = Date.now();
                  tempLog.severity = 1;
                  tempLog.message = `Added the ${schedulerName}`;
                  this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
                }, (error) => {
                  this.errorModal = true;
                  this.errorMessageModal = 'An error occurred on the server side.';
                });
              }
            }
            else {  //if alphafactor is on
              const chkTaskAFTableValidate = this.onValidateAFTable(this.scheduler); //validation for empty AF table name
              // console.log("copy-scheduler", this.scheduler); return false;

              if (chkTaskValidate === true && chkTaskAFTableValidate === true) {
                this.schedulersService.addScheduler(this.scheduler).pipe(takeUntil(this.isSchedulersDead$)).subscribe((response) => {
                  this.scheduler = { //with current and wave params
                    _id: null, alphaFactor: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable, analysis: true,
                    isMaster: true, project: null, vessel: null, contact: null, product: null, productName: null, productType: null,
                    productTypeId: null, hideScheduler: null, cwd: null, scripts: [], name: null, fatigue: true, done: false, rmType: this.selectedRunModeList.option,
                    forecasters: new Map(), current: false, waveSpectrum: false, current_data: null, testing: this.isActiveForecasterBtn, testingOptions: null, vm: null,
                    access: 0, hours: [], tasks: [], modularList: [], isCurrentlyRunning: false, wave: []
                  };

                  this.runningHrs = [];
                  this.virtualMachineList = [];
                  this.forecastersScheduler = [];
                  this.currentSchedulerId = null;
                  this.stepper.reset();
                  this.currentStep = 0;
                  modal.close('Close click');
                  const tempLog = Object.assign({}, this.log);
                  const user = this.userSharingService.currentUser;
                  const schedulerName = this.getSchedulerName(response.data.name, this.getVessel(response.data.vessel));
                  tempLog.user = (user.firstname + ' ' + user.lastname).trim();
                  tempLog.date = Date.now();
                  tempLog.severity = 1;
                  tempLog.message = `Added the ${schedulerName}`;
                  this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
                }, (error) => {
                  this.errorModal = true;
                  this.errorMessageModal = 'An error occurred on the server side.';
                });
              }
            }
          }
          else {
            this.errorModal = true;
            this.errorMessageModal = res.message;
          }
        });
      }
    }
    else {
      this.validationModal = true;
    }
  }

  transform(value: string): string {
    switch (value) {
      case 'project':
        return this.validationMessage = "Project is required";

      case 'vessel':
        return this.validationMessage = "Vessel is required";

      case 'product':
        return this.validationMessage = "Product is required";

      case 'cwd':
        return this.validationMessage = "Work path is required";

      case 'scripts':
        return this.validationMessage = "Script is required";

      case 'forecasters':
        return this.validationMessage = "Weather is required";

      case 'vm':
        return this.validationMessage = "Run mode is required";

      case 'hours':
        return this.validationMessage = "Running hours is required";

      case 'name':
        return this.validationMessage = "Scheduler Name is required";

      default:
        return this.validationMessage = "Please fill all the required fields";
    }
  }

  public onValidateAFTable(scheduler: any) {
    let tasks = scheduler.tasks;
    for (let i = 0; i < tasks.length; i++) {
      if ((tasks[i].alphaFactorTableName === null) || (tasks[i].alphaFactorTableName === "")) {
        this.responseMessage = "AlphaFactor table name is reqired. You did not leave the table name blank";
        this.modalService.open(this.modalValidationMessage, { centered: true, size: 'lg', backdrop: 'static' });
        this.isDisabledBtn = false;
        return false;
      }
    }
    return true;
  }

  public onValidateTasks(scheduler: any) {
    let tasks = scheduler.tasks;
    for (let i = 0; i < tasks.length; i++) {
      if ((tasks[i].name === null) || (tasks[i].name === "")) {
        this.responseMessage = "Tasks name is reqired. You did not leave the task name blank";
        this.modalService.open(this.modalValidationMessage, { centered: true, size: 'lg', backdrop: 'static' });
        this.isDisabledBtn = false;
        // tasks.splice(i, 1);
        return false;
      }
    }

    var valueArr = this.scheduler.tasks.map(function (item) {
      return item.name.toLowerCase();
    });
    var isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx;
    });

    if (isDuplicate === false) {
      return true;
    }
    else {
      this.responseMessage = "Duplicate tasks name.";
      this.modalService.open(this.modalValidationMessage, { centered: true, size: 'lg', backdrop: 'static' });
      this.isDisabledBtn = false;
      return false;
    }
  }

  saveEditRow(modal: NgbActiveModal) {
    // save in db
    // checking wave spectrum
    if (this.scheduler.waveSpectrum === true) {
      this.scheduler.wave = [].concat.apply([], this.forecastersScheduler);
      this.scheduler.forecasters = [];
    }
    else {
      this.scheduler.forecasters = this.forecastersScheduler;
      this.scheduler.wave = [];
    }
    this.scheduler.access = this.userSharingService.currentUser.access;
    this.scheduler.contact = this.contact;
    this.scheduler.alphaFactorTableName = this.selectedAlphaFactorTableName;
    let statusRow = 'edit';
    this.adaptTimeToUtcTimezone(statusRow);
    
    // this.scheduler.testingOptions = "One";
    // this.scheduler.testing = false;
    // let fieldToValidate = this.verifyScheduler();

    if (this.validateScheduler().length <= 0) {
      const schedulerName = this.removeWhiteSpace(this.scheduler.name);
      // For Project Code Checking
      this.schedulersService.getSchedulerName(this.selectedSName, schedulerName).subscribe((res: any) => {
        if ((res.type == "NOT EXISTS" || res.type == "SAMENAME") && res.statuscode == 200) {

          const chkTaskValidate = this.onValidateTasks(this.scheduler); //validation for duplicate tasks
          if (this.scheduler.alphaFactor === false) { //if alphafactor is off
            // console.log("edit-scheduler", this.scheduler); return false;

            if (chkTaskValidate === true) {
              this.schedulersService.updateScheduler(this.scheduler).pipe(takeUntil(this.isSchedulersDead$)).subscribe((response) => {
                this.scheduler = { //with current and wave params
                  _id: null, alphaFactor: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable, analysis: true,
                  isMaster: true, project: null, vessel: null, contact: null, product: null, productName: null, productType: null,
                  productTypeId: null, hideScheduler: null, cwd: null, scripts: [], name: null, fatigue: true, done: false, rmType: this.selectedRunModeList.option,
                  forecasters: new Map(), current: false, waveSpectrum: false, current_data: null, testing: this.isActiveForecasterBtn, testingOptions: null, vm: null,
                  access: 0, hours: [], tasks: [], modularList: [], isCurrentlyRunning: false, wave: []
                };

                this.runningHrs = [];
                this.virtualMachineList = [];
                this.forecastersScheduler = [];
                this.forecastersWaveScheduler = [];
                this.currentSchedulerId = null;
                this.stepper.reset();
                this.currentStep = 0;
                modal.close('Close click');
                const tempLog = Object.assign({}, this.log);
                const user = this.userSharingService.currentUser;
                const schedulerName = this.getSchedulerName(response.data.name, this.getVessel(response.data.vessel));
                tempLog.user = (user.firstname + ' ' + user.lastname).trim();
                tempLog.date = Date.now();
                tempLog.severity = 1;
                tempLog.message = `Updated the ${schedulerName}`;
                this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
              }, (error) => {
                this.errorModal = true;
                this.errorMessageModal = 'An error occurred on the server side.';
              });
            }
          }
          else {  //if alphafactor is on
            const chkTaskAFTableValidate = this.onValidateAFTable(this.scheduler); //validation for empty AF table name
            // console.log("edit-scheduler", this.scheduler); return false;

            if (chkTaskValidate === true && chkTaskAFTableValidate === true) {
              this.schedulersService.updateScheduler(this.scheduler).pipe(takeUntil(this.isSchedulersDead$)).subscribe((response) => {
                this.scheduler = { //with current and wave params
                  _id: null, alphaFactor: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable, analysis: true,
                  isMaster: true, project: null, vessel: null, contact: null, product: null, productName: null, productType: null,
                  productTypeId: null, hideScheduler: null, cwd: null, scripts: [], name: null, fatigue: true, done: false, rmType: this.selectedRunModeList.option,
                  forecasters: new Map(), current: false, waveSpectrum: false, current_data: null, testing: this.isActiveForecasterBtn, testingOptions: null, vm: null,
                  access: 0, hours: [], tasks: [], modularList: [], isCurrentlyRunning: false, wave: []
                };

                this.runningHrs = [];
                this.virtualMachineList = [];
                this.forecastersScheduler = [];
                this.currentSchedulerId = null;
                this.stepper.reset();
                this.currentStep = 0;
                modal.close('Close click');
                const tempLog = Object.assign({}, this.log);
                const user = this.userSharingService.currentUser;
                const schedulerName = this.getSchedulerName(response.data.name, this.getVessel(response.data.vessel));
                tempLog.user = (user.firstname + ' ' + user.lastname).trim();
                tempLog.date = Date.now();
                tempLog.severity = 1;
                tempLog.message = `Updated the ${schedulerName}`;
                this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
              }, (error) => {
                this.errorModal = true;
                this.errorMessageModal = 'An error occurred on the server side.';
              });
            }
          }
        }
        else {
          this.errorModal = true;
          this.errorMessageModal = res.message;
        }
      });
    }
    else {
      this.validationModal = true;
    }
  }

  deleteRow(modal: NgbActiveModal) {
    // save in db
    if (this.scheduler._id !== undefined || this.scheduler._id !== null || this.scheduler._id !== '') {

      this.schedulersService.getAnalysisByScheduler(this.scheduler._id).subscribe((resp: any) => {
        if (resp.success === false) {
          // scheduler not runied, you can delete it
          this.schedulersService.deleteScheduler(this.scheduler._id).pipe(takeUntil(this.isSchedulersDead$)).subscribe((response) => {
            const schedulerName = this.getSchedulerName(response.data.name, this.getVessel(response.data.vessel));
            this.scheduler = { //with current and wave params
              _id: null, alphaFactor: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable, analysis: true,
              isMaster: true, project: null, vessel: null, contact: null, product: null, productName: null, productType: null,
              productTypeId: null, hideScheduler: null, cwd: null, scripts: [], name: null, fatigue: true, done: false, rmType: this.selectedRunModeList.option,
              forecasters: new Map(), current: false, waveSpectrum: false, current_data: null, testing: this.isActiveForecasterBtn, testingOptions: null, vm: null,
              access: 0, hours: [], tasks: [], modularList: [], isCurrentlyRunning: false, wave: []
            };

            this.runningHrs = [];
            this.virtualMachineList = [];
            this.currentSchedulerId = null;
            modal.close('Close click');
            const tempLog = Object.assign({}, this.log);
            const user = this.userSharingService.currentUser;
            tempLog.user = (user.firstname + ' ' + user.lastname).trim();
            tempLog.date = Date.now();
            tempLog.severity = 2;
            tempLog.message = `Deleted the ${schedulerName}`;
            this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
          }, (error) => {
            this.errorModal = true;
            this.errorMessageModal = 'An error occurred on the server side.';
          });

        } else {
          // scheduler runied, you cannot delete it
          this.deleteSuccessRespType = false;
          this.deleteSuccesResp = "This scheduler is associated with analysis results. If you delete this scheduler, then the analysis generated by this scheduler will also get deleted.";
        }
      });

    } else {
      this.errorModal = true;
      this.errorMessageModal = 'No scheduler to delete.';
    }
  }

  openModal(action: string): void {
    this.currentStep = 0;
    switch (action) {
      case 'add':
        this.scheduler = { //with current and wave params
          _id: null, alphaFactor: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable, analysis: true,
          isMaster: true, project: null, vessel: null, contact: null, product: null, productName: null, productType: null,
          productTypeId: null, hideScheduler: null, cwd: null, scripts: [], name: null, fatigue: true, done: false, rmType: this.selectedRunModeList.option,
          forecasters: new Map(), current: false, waveSpectrum: false, current_data: null, testing: this.isActiveForecasterBtn, testingOptions: null, vm: null,
          access: 0, hours: [], tasks: [], modularList: [], isCurrentlyRunning: false, wave: []
        };

        this.runningHrs = [];
        this.selectedWheaterList = { option: 'Forecaster' };
        this.selectedCWList = { option: 'Current Forcaster' };
        this.isActiveForecasterBtn = false;
        this.forecastersScheduler = [];
        this.forecastersWaveScheduler = [];
        this.filteredProducts = [];
        this.currentSchedulerId = null;
        this.errorModal = false;
        this.errorMessageModal = "";
        this.modalService.open(this.modalAdd, { centered: true, size: 'xl', backdrop: 'static', scrollable: true });
        this.stepperAddRef = document.querySelector('#stepper-add-scheduler');
        this.stepper = new Stepper(this.stepperAddRef, {
          linear: true,
          animation: true
        });
        break;
      case 'edit':
        if (this.scheduler._id !== null) {

          if (this.scheduler.rmType === "Virtual Machine") {
            this.rmPlaceHolder = "Select your Virtual Machine Code";
            // this.isVmActive = true;
          }
          else if (this.scheduler.rmType === "Local run") {
            this.rmPlaceHolder = "Select your Virtual Machine Code";
            // this.isVmActive = false;
          }
          else if (this.scheduler.rmType === "HPC services") {
            this.rmPlaceHolder = "Select your Virtual Machine Code";
            // this.isVmActive = false;
          }

          //==================================================================

          // this.selectedWheaterList = { option: 'Forecaster' };
          // this.isActiveForecasterBtn = false;

          if (this.scheduler.testing === true && this.scheduler.waveSpectrum === false) {
            this.selectedWheaterList = { option: 'Testing' };
            this.isActiveForecasterBtn = true;
            this.isDisabledForecaster = true;
            this.isDisabledTesting = false;
          }
          else if (this.scheduler.testing === false && this.scheduler.waveSpectrum === true) {
            this.selectedWheaterList = { option: 'Wave Spectrum' };
            this.isActiveForecasterBtn = false;
            this.isDisabledForecaster = false;
            this.isDisabledTesting = true;
          }
          else if (this.scheduler.testing === false && this.scheduler.waveSpectrum === false) {
            this.selectedWheaterList = { option: 'Forecaster' };
            this.isActiveForecasterBtn = false;
            this.isDisabledForecaster = false;
            this.isDisabledTesting = true;
          }

          if (this.scheduler.current && this.scheduler.current === true) {
            this.isDisabledWaveForecaster = false;
          } else {
            this.isDisabledWaveForecaster = true;
          }

          this.changeTimeStrToObj(this.scheduler.hours);
          this.contact = this.scheduler.contact;
          this.selectedSName = this.scheduler.name;
          this.errorModal = false;
          this.errorMessageModal = "";
          this.isDisabledBtn = false;
          this.previousTasks = this.scheduler.tasks.length;
          this.selectedAlphaFactorTableName = this.scheduler.alphaFactorTableName;

          this.modalService.open(this.modalEdit, { centered: true, size: 'xl', backdrop: 'static', scrollable: true });
          this.stepperEditRef = document.querySelector('#stepper-edit-scheduler');
          this.stepper = new Stepper(this.stepperEditRef, {
            linear: false,
            animation: true
          });
        }
        break;
      case 'delete':
        if (this.scheduler._id !== null) {
          this.modalService.open(this.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
        }
        break;
      case 'copy':
        if (this.scheduler._id !== null) {
          if (this.scheduler.rmType === "Virtual Machine") {
            this.rmPlaceHolder = "Select your Virtual Machine Code";
            // this.isVmActive = true;
          }
          else if (this.scheduler.rmType === "Local run") {
            this.rmPlaceHolder = "Select your Virtual Machine Code";
            // this.isVmActive = false;
          }
          else if (this.scheduler.rmType === "HPC services") {
            this.rmPlaceHolder = "Select your Virtual Machine Code";
            // this.isVmActive = false;
          }

          //==================================================================

          // this.selectedWheaterList = { option: 'Forecaster' };
          // this.isActiveForecasterBtn = false;

          if (this.scheduler.testing === true && this.scheduler.waveSpectrum === false) {
            this.selectedWheaterList = { option: 'Testing' };
            this.isActiveForecasterBtn = true;
            this.isDisabledForecaster = true;
            this.isDisabledTesting = false;
          }
          else if (this.scheduler.testing === false && this.scheduler.waveSpectrum === true) {
            this.selectedWheaterList = { option: 'Wave Spectrum' };
            this.isActiveForecasterBtn = false;
            this.isDisabledForecaster = false;
            this.isDisabledTesting = true;
          }
          else if (this.scheduler.testing === false && this.scheduler.waveSpectrum === false) {
            this.selectedWheaterList = { option: 'Forecaster' };
            this.isActiveForecasterBtn = false;
            this.isDisabledForecaster = false;
            this.isDisabledTesting = true;
          }

          const schedulerName = this.checkSchedulerNameSubstr(this.scheduler.name);
          this.scheduler.name = schedulerName;
          this.selectedSName = this.scheduler.name;
          this.errorModal = false;
          this.errorMessageModal = "";
          this.modalService.open(this.modalCopy, { centered: true, size: 'xl', backdrop: 'static', scrollable: true });
          this.stepperEditRef = document.querySelector('#stepper-edit-scheduler');
          this.stepper = new Stepper(this.stepperEditRef, {
            linear: false,
            animation: true
          });
        }
        break;
      case 'move':
        if (this.scheduler._id !== null) {
          this.schedulersService.copySchedulerToProd(this.scheduler._id).subscribe((res: any) => {
            this.responseMessage = res.message;
            if (res.success === true) {
              const tempLog = Object.assign({}, this.log);
              const user = this.userSharingService.currentUser;
              tempLog.user = (user.firstname + ' ' + user.lastname).trim();
              tempLog.date = Date.now();
              tempLog.severity = 2;
              tempLog.message = `Moved ${this.scheduler.name} in Production`;
              this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
            }
            this.modalService.open(this.modalMessage, { centered: true, size: 'lg', backdrop: 'static' });

          });
        }
        break;
      default:
        break;
    }
  }

  changeTimeStrToObj(time: string) {
    let index = 0;
    this.runningHrs = [];
    for (const hh of time) {
      const compo = hh.split(':').map(value => parseInt(value, 10));
      this.runningHrs[index] = { hour: compo[0], minute: compo[1] };
      index++;
    }
  }

  checkSchedulerNameSubstr(name: string) {
    if (name.slice(name.length - 4) === "Copy") {
      return this.scheduler.name;
    }
    else if (name.slice(0, 4) === "Copy") {
      return this.scheduler.name;
    }
    else {
      return this.scheduler.name + " Copy"
    }
  }

  onSchedulerChange(event: {}): void {
    const array = [];
    if (event) {
      this.validationModal = false;
      const user = this.userSharingService.currentUser;
      this.scheduler = Object.assign({}, event as Scheduler);
      this.scheduler.modularList = this.modularAnalysisList.filter((e) => e.scheduler_id === this.scheduler._id);
      this.vesselsList = this.vessels.slice().filter((elt) => {
        return this.getProject(this.scheduler.project).vessels.find((e) => e.vessel_id === elt._id)
      });

      if(this.scheduler.waveSpectrum === false){
        this.forecastersScheduler = Object.entries(this.scheduler.forecasters);
      } else {
        const convertIntoArray = Array(this.scheduler.wave);
        const reducer = (obj, item) => {
          obj[item[0]] = item[1];
          return obj;
        };
        
        const result = convertIntoArray.reduce(reducer, {});
        this.forecastersScheduler = Object.entries(result);
      }
      this.adaptTimeToProjectTimezone();

      //Checking admin:4 access for other users  
      // if (user.access === 4) {
      //   this.isActionActive = true;
      // }
      // else if (user.access === this.scheduler.access) {
      //   this.isActionActive = true;
      // }
      // else {
      //   this.isActionActive = false;
      // }

      if (user.access === 6 && (this.scheduler.isMaster === true || this.scheduler.isMaster === false)) {
        this.isActionActive = true;
      }
      else if (user.access !== 6 && this.scheduler.isMaster === false) {
        this.isActionActive = true;
      }
      else if (user.access !== 6 && this.scheduler.isMaster === true) {
        this.isActionActive = false;
      }

    } else {
      this.scheduler = { //with current and wave params
        _id: null, alphaFactor: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable, analysis: true,
        isMaster: true, project: null, vessel: null, contact: null, product: null, productName: null, productType: null,
        productTypeId: null, hideScheduler: null, cwd: null, scripts: [], name: null, fatigue: true, done: false, rmType: this.selectedRunModeList.option,
        forecasters: new Map(), current: false, waveSpectrum: false, current_data: null, testing: this.isActiveForecasterBtn, testingOptions: null, vm: null,
        access: 0, hours: [], tasks: [], modularList: [], isCurrentlyRunning: false, wave: []
      };

      this.runningHrs = [];
      this.vesselsList = [];
      this.forecastersScheduler = [];
    }
  }

  adaptTimeToProjectTimezone(): void {
    var tz = moment.tz.guess();
    const project = this.getProject(this.scheduler.project);
    if (project) {
      let index = 0;
      const now = moment.utc();
      for (const hh of this.scheduler.hours) {
        const compo = hh.split(':').map(value => parseInt(value, 10));
        const date = now;
        date.hour(compo[0]);
        date.minute(compo[1]);
        date.second(compo[2]);
        this.scheduler.hours[index] = moment.utc(date).tz(tz).format('HH:mm:ss');
        index++;
      }
      index = 0;
      let max = null;
      for (const tt of this.scheduler.tasks) {
        const start = moment.utc(tt.start);
        const end = moment.utc(tt.end);
        if (!max || max < end) {
          max = end;
        }
        if (now > end) {
          this.scheduler.tasks[index].run = false;
        }
        // this.scheduler.tasks[index].forcedRun = false;
        this.scheduler.tasks[index].start = moment.utc(start).tz(tz).valueOf();
        this.scheduler.tasks[index].end = moment.utc(end).tz(tz).valueOf();
        index++;
      }
      // this.scheduler.done = now > max;
    }
  }

  adaptTimeToUtcTimezone(statusRow: string) {
    var tz = moment.tz.guess();
    const project = this.getProject(this.scheduler.project);
    if (project) {
      let index = 0;
      const now = moment().tz(tz);
      if (statusRow === "add") {
        for (const hh of this.scheduler.hours) {
          const compo = hh.split(':').map(value => parseInt(value, 10));
          const date = moment(now).tz(tz);
          date.hour(compo[0]);
          date.minute(compo[1]);
          date.second(compo[2]);
          this.scheduler.hours[index] = moment.utc(date).format('HH:mm:ss');
          index++;
        }
      }
      else if (statusRow === "edit") {
        if (this.runningHrs.length !== this.scheduler.hours.length) {
          for (const hh1 of this.runningHrs) {
            if (typeof hh1 === 'object') {
              const compo = this.scheduler.hours[index].split(':').map(value => parseInt(value, 10));
              const date = moment(now).tz(tz);
              date.hour(compo[0]);
              date.minute(compo[1]);
              date.second(compo[2]);
              this.scheduler.hours[index] = moment.utc(date).format('HH:mm:ss');
            }
            else if (typeof hh1 === 'string') {
              const compo = hh1.split(':').map(value => parseInt(value, 10));
              const date = moment(now).tz(tz);
              date.hour(compo[0]);
              date.minute(compo[1]);
              date.second(compo[2]);
              this.scheduler.hours[index] = moment.utc(date).format('HH:mm:ss');
            }
            index++;
          }
        } else {
          for (const hh of this.runningHrs) {
            if (typeof hh === 'string') {
              const compo = hh.split(':').map(value => parseInt(value, 10));
              const date = moment(now).tz(tz);
              date.hour(compo[0]);
              date.minute(compo[1]);
              date.second(compo[2]);
              this.scheduler.hours[index] = moment.utc(date).format('HH:mm:ss');
            }
            else if (typeof hh === 'object') {
              const compo = this.scheduler.hours[index].split(':').map(value => parseInt(value, 10));
              const date = moment(now).tz(tz);
              date.hour(compo[0]);
              date.minute(compo[1]);
              date.second(compo[2]);
              this.scheduler.hours[index] = moment.utc(date).format('HH:mm:ss');
            }
            index++;
          }
        }
      }

      index = 0;
      let max = null;
      for (const tt of this.scheduler.tasks) {
        const start = moment(tt.start).tz(tz);
        const end = moment(tt.end).tz(tz);
        if (!max || max < end) {
          max = end;
        }
        if (now > end) {
          this.scheduler.tasks[index].run = false;
        }
        // this.scheduler.tasks[index].forcedRun = false;
        this.scheduler.tasks[index].start = moment.utc(start).valueOf();
        this.scheduler.tasks[index].end = moment.utc(end).valueOf();
        index++;
      }
      // this.scheduler.done = now > max;
    }
  }

  onProjectChange(event: {}): void {
    this.selectedProjects = event;
    this.scheduler.vessel = null;
    this.scheduler.product = null;
    this.vesselsList = [];
    this.filteredProducts = [];

    if (event) {
      this.vesselsList = this.vessels.filter((elt) =>
        event['vessels'].find((e) => e.vessel_id === elt._id)
      );

      let selectedVessels = event['vessels'].map(
        (e) => e.Product_Details.productType
      );
    }
  }

  onVesselsChange(event, status) {
    // check here
    this.scheduler.product = null;
    this.filteredProducts = [];

    if (event) {
      if (this.selectedProjects && status == "add") {
        const filteredVess = this.selectedProjects.vessels.filter((elt) => {
          if (elt.vessel_id == event._id) {
            return elt;
          }
        });

        this.filteredProducts = [];
        for (let i = 0; i < filteredVess.length; i++) {
          for (let j = 0; j < this.products.length; j++) {
            if (this.products[j]._id === filteredVess[i].Product_Details.productType) {
              this.filteredProducts.push({
                prodTypeId: filteredVess[i].Product_Details.productType,
                prodName:
                  this.products[j].name + ' - ' + filteredVess[i].Product_Details.productName,
                prodContact: filteredVess[i].Product_Details.contact,
                hideScheduler: filteredVess[i].Product_Details.hideScheduler
              });
            }
          }
        }
      } else if (status == "edit") {

        const selectedProj = this.projects.find((e4) => {
          return e4._id === this.scheduler.project;
        });

        const filteredVess = selectedProj.vessels.filter((elt) => {
          if (elt.vessel_id == event._id) {
            return elt;
          }
        });

        this.filteredProducts = [];
        for (let i = 0; i < filteredVess.length; i++) {
          for (let j = 0; j < this.products.length; j++) {
            if (this.products[j]._id === filteredVess[i].Product_Details.productType) {
              this.filteredProducts.push({
                prodTypeId: filteredVess[i].Product_Details.productType,
                prodName:
                  this.products[j].name + '-' + filteredVess[i].Product_Details.productName,
                prodContact: filteredVess[i].Product_Details.contact,
                hideScheduler: filteredVess[i].Product_Details.hideScheduler
              });
            }
          }
        }
      }
    }
  }

  onTestChange(event) {
    this.scheduler.testingOptions = event.value;
  }

  onProdChange(event) {
    let sliceProdTypeWithProdName = event.prodName.indexOf('-');
    this.scheduler.productType = event.prodName.slice(0, sliceProdTypeWithProdName).trim(); // productType
    this.scheduler.productName = event.prodName.slice(sliceProdTypeWithProdName + 1).trim(); // product Name

    this.scheduler.productTypeId = event.prodTypeId;
    this.scheduler.hideScheduler = event.hideScheduler;
    this.contact = null;
    this.usersService.getUserById(event.prodContact).pipe(takeUntil(this.isUserDead$)).subscribe((resp) => {
      this.contact = resp.data.firstname + " " + resp.data.lastname;
    }, (err) => {
      this.contact = null;
    });
  }

  projectSearchFn = (term: string, item: Project): boolean => {
    term = term.toLowerCase();
    const c = this.getClient(item.client);
    const client = (c) ? c.name : '';
    return item.name.trim().toLowerCase().includes(term) || item.code.trim().toLowerCase().includes(term) ||
      client.trim().toLowerCase().includes(term);
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

  addForecasterRow(selectedWheaterList): void {
    if (this.forecastersScheduler.length < this.forecasters.length) {
      this.forecastersScheduler.push([null, { name: null, subscription: null }]);
    }
  }

  deleteForecasterRow(index: number): void {
    this.forecastersScheduler.splice(index, 1);
  }

  addScriptRow(): void {
    this.scheduler.scripts.push('');
  }

  deleteScriptRow(index: number): void {
    this.scheduler.scripts.splice(index, 1);
  }

  addHourRow(status: string): void {
    if (status === "add" || status === "copy") {
      this.scheduler.hours.push('');
    }
    else if (status === "edit") {
      this.runningHrs.push('');
    }
  }

  deleteHourRow(index: number, status: string): void {
    if (status === "add" || status === "copy") {
      this.scheduler.hours.splice(index, 1);
    }
    else if (status === "edit") {
      this.runningHrs.splice(index, 1);
      this.scheduler.hours.splice(index, 1);
    }
  }

  addAlphaFactorTableRow(): void {
    this.scheduler.alphaFactorTable.rows.push(
      { operator: null, value: null, data: new Array(this.scheduler.alphaFactorTable.cols.length).fill(null) }
    );
  }

  addAlphaFactorTableCol(): void {
    this.scheduler.alphaFactorTable.cols.push(null);
    for (const r of this.scheduler.alphaFactorTable.rows) {
      r.data.push(null);
    }
  }

  deleteAlphaFactorTableRow(index: number): void {
    this.scheduler.alphaFactorTable.rows.splice(index, 1);
  }

  deleteAlphaFactorTableCol(index: number): void {
    if (this.scheduler.alphaFactorTable.cols.length > 2) {
      this.scheduler.alphaFactorTable.cols.splice(index, 1);
      for (const r of this.scheduler.alphaFactorTable.rows) {
        r.data.splice(index, 1);
      }
    }
  }

  addTaskRow(): void {
    this.scheduler.tasks.push({
      _id: '-1', name: null, color: '#ffffff', run: true, tPopVal: 0, offshoreDuration: 0, predecessor: 0, status: 0, start: Date.now(), end: Date.now() + 3 * Time.Day,
      weathervaning: false, forcedRun: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable
    } as TaskScheduler);

    this.nextTasks = this.scheduler.tasks.length;
  }

  deleteTaskRow(index: number): void {
    this.scheduler.tasks.splice(index, 1);
    this.isDisabledBtn = false;
  }

  onForecaster(event: any, index: number) {
    this.forecastersScheduler[index][1].name = (event as Forecaster).name;
    const compareForecaster = ['StormGeo', 'Infoplaza', 'MeteoGroup', 'WeatherNews'];

    this.forecasters.map((e) => {
      if (
        event.name === e.name &&
        event.name.toLowerCase().startsWith('stormgeo')
      ) {
        this.forecastersScheduler[index][1].subscription = "+1";
      } else if (
        event.name === e.name &&
        event.name.toLowerCase().startsWith('infoplaza')
      ) {
        this.forecastersScheduler[index][1].subscription = "";
      } else if (
        event.name === e.name &&
        event.name.toLowerCase().startsWith('meteogroup')
      ) {
        this.forecastersScheduler[index][1].subscription = "-1";
      } else if (
        event.name === e.name &&
        event.name.toLowerCase().startsWith('weathernews')
      ) {
        this.forecastersScheduler[index][1].subscription = "0";
      }
      else if (event.name === e.name) {
        const isFound = compareForecaster.some((ai) => {
          e.name.includes(ai);
        });

        if (isFound === false) {
          this.forecastersScheduler[index][1].subscription = "";
        }
      }
    });
  }

  applyNumberFormat(value: number, input: HTMLInputElement) {
    input.value = formatNumber(value, 1, 2, 2);
  }

  changeWeather(event, status) {
    const strWhtValue = event.target.value;
    if (status === 'add') {
      // this.isActiveForecasterBtn = false;
      // this.scheduler.testing = false;

      if (strWhtValue === "Forecaster") {
        this.selectedWheaterList = { option: 'Forecaster' };
        this.isActiveForecasterBtn = false;
        this.scheduler.testing = false;
        this.scheduler.waveSpectrum = false;
        this.forecastersScheduler = Object.entries(this.scheduler.forecasters);
        this.isDisabledForecaster = false;
        this.isDisabledTesting = true;
        this.scheduler.testingOptions = null;
        this.scheduler.wave = [];
      }
      else if (strWhtValue === "Wave Spectrum") {
        this.selectedWheaterList = { option: 'Wave Spectrum' };
        this.isActiveForecasterBtn = false;
        this.scheduler.testing = false;
        this.scheduler.waveSpectrum = true;
        this.forecastersScheduler = [];
        this.isDisabledForecaster = false;
        this.isDisabledTesting = true;
        this.scheduler.testingOptions = null;
        this.scheduler.forecasters = [];
      }
      else {
        this.isActiveForecasterBtn = true;
        this.forecastersScheduler = [];
        this.isDisabledForecaster = true;
        this.scheduler.testing = true;
        this.scheduler.waveSpectrum = false;
        this.isDisabledTesting = false;
        this.scheduler.forecasters = [];
        this.scheduler.wave = [];
      }
    }
    else if (status === 'edit') {
      if (strWhtValue === "Forecaster") {
        this.selectedWheaterList = { option: 'Forecaster' };
        this.isActiveForecasterBtn = false;
        this.scheduler.testing = false;
        this.scheduler.waveSpectrum = false;
        this.forecastersScheduler = [];
        this.isDisabledForecaster = false;
        this.isDisabledTesting = true;
        this.scheduler.testingOptions = null;
        this.scheduler.wave = [];
      }
      else if (strWhtValue === "Wave Spectrum") {
        this.selectedWheaterList = { option: 'Wave Spectrum' };
        this.isActiveForecasterBtn = false;
        this.scheduler.testing = false;
        this.scheduler.waveSpectrum = true;
        this.forecastersScheduler = [];
        this.isDisabledForecaster = false;
        this.isDisabledTesting = true;
        this.scheduler.testingOptions = null;
        this.scheduler.forecasters = [];
      }
      else {
        this.isActiveForecasterBtn = true;
        this.forecastersScheduler = [];
        this.scheduler.testing = true;
        this.scheduler.waveSpectrum = false;
        this.isDisabledForecaster = true;
        this.isDisabledTesting = false;
        this.scheduler.forecasters = [];
        this.scheduler.wave = [];
      }
    }
  }

  changeRunMode(event, status) {
    const strRmValue = event;
    if (status === "add") {
      if (strRmValue === "Virtual Machine") {
        // this.isVmActive = true;
        this.scheduler.vm = null;
        this.hpcDefault = "";
        this.rmPlaceHolder = "Select your Virtual Machine Code";
      }
      else if (strRmValue === "Local run") {
        // this.isVmActive = false;
        this.scheduler.vm = null;
        this.hpcDefault = "";
        this.rmPlaceHolder = "Select your Virtual Machine Code";
      }
      else if (strRmValue === "HPC services") {
        // this.isVmActive = false;
        this.scheduler.vm = null
        this.hpcDefault = "";
        this.rmPlaceHolder = "Select your Virtual Machine Code";
      }
      else {
        this.rmPlaceHolder = "Enter your Code";
      }
    }
    else {
      if (strRmValue === "Virtual Machine") {
        this.rmPlaceHolder = "Select your Virtual Machine Code";
        // this.hpcDefault = "";
        this.scheduler.vm = null;
        // this.isVmActive = true;
      }
      else if (strRmValue === "Local run") {
        this.rmPlaceHolder = "Select your Virtual Machine Code";
        // this.hpcDefault = "";
        this.scheduler.vm = null;
        // this.isVmActive = false;
      }
      else if (strRmValue === "HPC services") {
        this.rmPlaceHolder = "Select your Virtual Machine Code";
        // this.hpcDefault = "";
        this.scheduler.vm = null;
        // this.isVmActive = false;
      }
    }
  }

  onClose() {
    this.modalService.open(this.modalConfirm, { centered: true, size: 'lg', backdrop: 'static', scrollable: true });
    this.validationModal = false;
    this.forecastersWaveScheduler = [];
  }

  public decline(modal: NgbActiveModal) {
    modal.close(false);
  }

  public dismiss(modal: NgbActiveModal) {
    modal.dismiss();
  }

  public accept(modal: NgbActiveModal, status) {
    if (status === "confirm") {
      this.runningHrs = [];
      this.virtualMachineList = [];
      this.stepper.reset();
      this.currentStep = 0;
    }
    else if (status === "move") {
      this.responseMessage = "";
    }
    else if (status === "delete") {
      this.deleteSuccessRespType = true;
      this.deleteSuccesResp = "";
    }

    this.modalService.dismissAll(this.modalCopy);
    this.modalService.dismissAll(this.modalEdit);
    this.modalService.dismissAll(this.modalAdd);
    this.modalService.dismissAll(this.modalDelete);
    this.modalService.dismissAll(this.modalMessage);
    this.modalService.dismissAll(this.modalValidationMessage);
    modal.close('Close click');

    this.scheduler = { //with current and wave params
      _id: null, alphaFactor: false, alphaFactorTableName: null, alphaFactorTable: this.defaultAlphaFactorTable, analysis: true,
      isMaster: true, project: null, vessel: null, contact: null, product: null, productName: null, productType: null,
      productTypeId: null, hideScheduler: null, cwd: null, scripts: [], name: null, fatigue: true, done: false, rmType: this.selectedRunModeList.option,
      forecasters: new Map(), current: false, waveSpectrum: false, current_data: null, testing: this.isActiveForecasterBtn, testingOptions: null, vm: null,
      access: 0, hours: [], tasks: [], modularList: [], isCurrentlyRunning: false, wave: []
    };

    this.forecastersScheduler = [];
    this.currentSchedulerId = null;
    this.refresh();
  }

  public omit_special_char(event) {
    if (event.charCode === 47 || event.charCode === 92 || event.charCode === 63 || event.charCode === 42 || event.charCode === 91 || event.charCode === 93) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  public onChangeTask(event) {
    const selectedTasks = event.target.value;
    if (selectedTasks === "") {
      this.isDisabledBtn = false;
      // this.scheduler.tasks.splice(-1);
      event.preventDefault();
      return false;
    }
    this.isDisabledBtn = false;
    return true;
  }

  public closeValidationModal(modal: NgbActiveModal) {
    modal.close('Close click');
    // this.scheduler.tasks.splice(-1);
  }

  public onGetAlphaFactorChangeByTasks(event, task) {
    for (let i = 0; i < this.scheduler.tasks.length; i++) {
      if (this.scheduler.tasks[i].name === task) {
        this.scheduler.tasks[i].alphaFactorTable = event.tableLayout;
      }
    }
  }

  public onGetAlphaFactorChange(event) {
    this.alphaFactorService.getAlphaFactor(event._id).pipe(takeUntil(this.isAlphaFactorDead$)).subscribe((resp) => {
      this.selectedAlphaFactorTable = resp.data;
      this.selectedAlphaFactorTableName = resp.data[0].name;
      this.scheduler.alphaFactorTable = resp.data[0].tableLayout;
    }, (err) => {
      this.selectedAlphaFactorTable = [];
      this.selectedAlphaFactorTableName = null;
    });
  }

  public alphaFactorChange(event) {
    if (event.currentTarget.checked === false) {
      for (let i = 0; i < this.scheduler.tasks.length; i++) {
        this.scheduler.tasks[i].alphaFactorTableName = null;
      }
    }
  }

  public currentChange(event) {
    if (event.currentTarget.checked === true) {
      this.isDisabledWaveForecaster = false;
    } else {
      this.isDisabledWaveForecaster = true;
    }
  }
}

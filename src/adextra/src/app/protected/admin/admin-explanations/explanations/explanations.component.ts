import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { forkJoin, Observable, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExplanationsService } from '@app/core/services/explanations.service';
import { Explanation } from '@app/shared/models/explanation';
import { Scheduler } from '@app/shared/models/scheduler';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { TitlePageService } from '@app/core/services/title-page.service';
import { Log } from '@app/shared/models/log';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { Project } from '@app/shared/models/project';
import { Vessel } from '@app/shared/models/vessel';
import { VesselsService } from '@app/core/services/vessels.service';
import { ProjectsService } from '@app/core/services/projects.service';
import { ProductsService } from '@app/core/services/products.service';
import { WeatherService } from '@app/core/services/weather.service';
import { SchedulersService } from '@app/core/services/schedulers.service';
import { Country } from '@app/shared/models/country';
import { CountriesService } from '@app/core/services/countries.service';
import { CONTENT, NOTE } from '@app/shared/mocks/explanations-model';
import { takeUntil } from 'rxjs/operators';
import { ClientsService } from '@app/core/services/clients.service';
import { Forecaster } from '@app/shared/models/forecaster';
import { ForecastersService } from '@app/core/services/forecasters.service';
import { AnalysisService } from '@app/core/services/analysis.service';
import { Client } from '@app/shared/models/client';
import { Analysis } from '@app/shared/models/analysis';
import * as moment from 'moment-timezone';
import { splitText } from '@app/shared/helpers/string';

@Component({
  selector: 'app-explanations',
  templateUrl: './explanations.component.html',
  styleUrls: ['./explanations.component.scss']
})
export class ExplanationsComponent implements AfterViewInit, OnDestroy, OnInit {

  title = 'Explanations management';

  resetCache = false;
  errorModal = false;

  errorMessageModal = null;

  editorOne = DecoupledEditor;
  editorBis = DecoupledEditor;

  dtOptions: any = {};
  config = {
    toolbar: [
      'heading', '|', 'fontSize', 'fontFamily', '|', 'bold', 'italic', 'strikethrough', 'underline', 'highlight', '|', 'alignment', '|',
      'numberedList', 'bulletedList', '|', 'link', 'blockQuote', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|', 'undo',
      'redo'
    ]
  };
  explanation: any = { _id: '-1', project: null, vessel: null, product: null, productName: null, productType: null, productTypeId: null, forecaster: null, analysis: null, text: CONTENT, note: NOTE };
  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };
  state = { isLoaded: false, canConnect: null };

  explanations: Explanation[];
  schedulers: Scheduler[];
  productList: any[];
  forecasters: any[];
  forecasts: any[] = [];
  vesselsList: Vessel[] = [];
  projects: Project[];
  vessels: Vessel[];
  clients: Client[];
  analysis: Analysis[];
  analysisList: Analysis[] = [];
  countries: Country[];
  products: any[];
  validateVM: any[] = [];
  validationModal = false;

  selectedProjects: any;
  selectedVessels: any;
  seletedProductType: any;
  seletedProductTypeName: string;
  seletedContactId: string;
  validationMessage: string = "";

  @ViewChild('modalView', { static: true }) modalView: ElementRef;
  @ViewChild('modalAdd', { static: true }) modalAdd: ElementRef;
  @ViewChild('modalEdit', { static: true }) modalEdit: ElementRef;
  @ViewChild('modalDelete', { static: true }) modalDelete: ElementRef;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isProjectDead$ = new Subject();
  private isLogsDead$ = new Subject();
  private isVesselsDead$ = new Subject();
  private isCountriesDead$ = new Subject();
  private isExplanationsDead$ = new Subject();
  private isClientsDead$ = new Subject();
  private isForecastersDead$ = new Subject();
  private isAnalysisDead$ = new Subject();
  private isProductDead$ = new Subject();
  private isForecastsDead$ = new Subject();
  private isSchedulersDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private explanationsService: ExplanationsService,
    private vesselsService: VesselsService,
    private projectsService: ProjectsService,
    private productsService: ProductsService,
    private forecastsService: WeatherService,
    private schedulersService: SchedulersService,
    private countriesService: CountriesService,
    private clientsService: ClientsService,
    private forecastersService: ForecastersService,
    private analysisService: AnalysisService,
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
      order: [[5, 'desc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        forkJoin([
          that.countriesService.getCountries(that.resetCache).pipe(takeUntil(this.isCountriesDead$)),
          that.projectsService.getEnabledProjects(that.resetCache).pipe(takeUntil(this.isProjectDead$)),
          that.vesselsService.getEnabledVessels(that.resetCache).pipe(takeUntil(this.isVesselsDead$)),
          that.explanationsService.getExplanations(that.resetCache).pipe(takeUntil(this.isExplanationsDead$)),
          that.clientsService.getClients(that.resetCache).pipe(takeUntil(this.isClientsDead$)),
          that.forecastersService.getForecasters(that.resetCache).pipe(takeUntil(this.isForecastersDead$)),
          that.analysisService.getAllAnalysis(that.resetCache).pipe(takeUntil(this.isAnalysisDead$)),
          this.productsService.getProducts(this.resetCache).pipe(takeUntil(this.isProductDead$)),
          this.forecastsService.getAllForecasts(this.resetCache).pipe(takeUntil(this.isForecastsDead$)),
          this.schedulersService.getSchedulers(this.resetCache).pipe(takeUntil(this.isSchedulersDead$))
        ]
        ).subscribe((response) => {
          that.countries = response[0].data;
          that.projects = response[1].data;
          that.vessels = response[2].data;
          that.clients = response[4].data;
          that.forecasters = response[5].data;
          that.analysis = response[6].data;
          this.products = response[7].data;
          this.forecasts = response[8].data;
          this.schedulers = response[9].data;
          that.vesselsList = [];
          that.analysisList = [];
          that.explanations = response[3].data;
          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.explanations
          });
        }, error => {
          that.countries = [];
          that.projects = [];
          that.vessels = [];
          this.products = [];
          this.forecasts = [];
          this.schedulers = [];
          that.vesselsList = [];
          that.analysisList = [];
          that.clients = [];
          that.forecasters = [];
          that.analysis = [];
          that.explanations = [];
          that.state.canConnect = false;
          that.state.isLoaded = true;
          callback({
            data: []
          });
        });
      },
      columns: [{ data: null }, { data: 'text' }, { data: 'project' }, { data: 'vessel' }, { data: 'forecaster' },
      { data: 'analysis' }],
      columnDefs: [
        {
          orderable: false,
          targets: [0],
          className: 'td-action',
          render: (data, type, full, meta) => {
            return '<div class="btn-group btn-group-sm" role="group">' +
              '<button class="btn btn-outline-dark btn-view btn-sm"><i class="material-icons md-center md-sm">remove_red_eye</i>' +
              '</button>' +
              '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
              '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
              '</div>';
          }
        },
        {
          targets: [1],
          render: (data, type, full, meta) => {
            return splitText(String(data), 15, true) + '...';
          }
        },
        {
          targets: [2],
          render: (data, type, full, meta) => {
            if (data !== '' || data !== undefined || data !== null) {
              const project = that.getProject(data);
              if (project === undefined) {
                return '';
              } else {
                const images = this.getFlags(project);
                const client = that.getClient(project.client);
                let render = '<div class="row"><div class="col-2">';
                for (const img of images) {
                  render += `<img src="${img}" alt="" height="auto" width="45">`;
                }
                render += '</div><div class="col-10">';
                if (client) {
                  render += `<span>${project.code} - ${client.name} ${project.name}</span>`;
                } else {
                  render += `<span>${project.code} - ${project.name}</span>`;
                }
                render += '</div></div>';
                return render;
              }
            } else {
              return '';
            }
          }
        },
        {
          targets: [3],
          render: (data, type, full, meta) => {
            if (data !== '' || data !== undefined || data !== null) {
              const vessel = that.getVessel(data);
              if (vessel === undefined) {
                return '';
              } else {
                return `<img  alt="" src="${vessel.image}" width="90" height="39.705"/> <span>${vessel.name}</span>`;
              }
            } else {
              return '';
            }
          }
        }, {
          targets: [4],
          render: (data, type, full, meta) => {
            if (data !== '' || data !== undefined || data !== null) {
              const forecaster = that.getForecaster(data);
              if (forecaster === undefined) {
                return '';
              } else {
                return forecaster.name;
              }
            } else {
              return '';
            }
          }
        }, {
          targets: [5],
          render: (data, type, full, meta) => {
            if (data !== '' || data !== undefined || data !== null) {
              const analysis = that.getAnalysis(data);
              const project = that.getProject(full.project);
              if (analysis === undefined) {
                return null;
              } else {
                if (type === 'sort') {
                  return analysis.date;
                }
                let render = '';
                if (analysis.date !== 0) {
                  if (project && project.timezone) {
                    render = moment(analysis.date).tz(project.timezone).format('DD MMM YYYY HH:mm:ss');
                    render += ` (GMT ${moment(analysis.date).tz(project.timezone).format('Z')})`;
                  } else {
                    render = moment(analysis.date).format('DD MMM YYYY HH:mm:ss');
                    render += ` (GMT ${moment(analysis.date).format('Z')})`;
                  }
                } else {
                  render = '';
                }
                return render;
              }
            } else {
              return null;
            }
          }
        },
      ],
      dom:
        '<"row"<"col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-12"l><"col-xs-12 col-sm-12 col-md-5 col-lg-4 col-xl-6 text-center"B><"col-xs-12 col-sm-12 col-md-4 col-lg-5 col-xl-3"f>>' +
        '<"row"<"col-sm-12 col-12"tr>>' +
        '<"row"<"col-xs-12 col-sm-12 col-md-6 col-lg-5 col-xl-5 col-12"i><"col-xs-12 col-sm-12 col-md-6 col-lg-7 col-xl-7 col-12"p>>',
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
            this.explanation = { _id: '-1', project: null, vessel: null, product: null, productName: null, productType: null, productTypeId: null, forecaster: null, analysis: null, text: CONTENT, note: NOTE };
            this.modalService.open(this.modalAdd, { centered: true, size: 'xl', backdrop: 'static', scrollable: true });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: Explanation, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltView = $('td', row).find('button.btn-view');
        if (eltView) {
          eltView.off('click');
          eltView.on('click', () => {
            that.explanation = Object.assign({}, data);
            that.modalService.open(that.modalView, { centered: true, size: 'xl', backdrop: 'static', scrollable: true });
          });
        }
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            that.explanation = Object.assign({}, data);
            const project = that.getProject(that.explanation.project);
            if (project) {
              // that.vesselsList = that.vessels.slice().filter((elt) => project.vessels[elt._id]);
              this.vesselsList = this.vessels.slice().filter((elt) => {
                return this.getProject(this.explanation.project).vessels.find((e) => e.vessel_id === elt._id)
              });
            }
            that.analysisList = that.analysis.slice().filter((elt) => {
              return elt.forecaster === that.explanation.forecaster && elt.project === that.explanation.project &&
                elt.vessel === that.explanation.vessel;
            });
            that.modalService.open(that.modalEdit, { centered: true, size: 'xl', backdrop: 'static', scrollable: true });
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.explanation = Object.assign({}, data);
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.explanationsService.socketEvent;
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
    this.isProjectDead$.next();
    this.isLogsDead$.next();
    this.isVesselsDead$.next();
    this.isForecastsDead$.next();
    this.isSchedulersDead$.next();
    this.isCountriesDead$.next();
    this.isExplanationsDead$.next();
    this.isClientsDead$.next();
    this.isAnalysisDead$.next();
    this.isForecastersDead$.next();
  }

  onChangeContentCkeditor({ editor }: ChangeEvent) {
    this.explanation.text = editor.getData();
  }

  onChangeNoteCkeditor({ editor }: ChangeEvent) {
    this.explanation.note = editor.getData();
  }


  onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  verifyExplanation(): [string, boolean] {
    const excludes = ['_id', 'productName', 'productType'];
    for (const prop in this.explanation) {
      if ((excludes.includes(prop) === false) && (this.explanation[prop] === undefined || this.explanation[prop] === null ||
        this.explanation[prop] === '' || this.explanation[prop].length === 0 || Object.keys(this.explanation[prop]).length === 0)) {
        return [prop, false];
      }
    }
    return ["noFieldToValidate", true];
  }

  validateExplanation() {
    this.validateVM = [];
    const excludes = ['_id', 'productName', 'productType'];
    for (const prop in this.explanation) {
      if ((excludes.includes(prop) === false) && (this.explanation[prop] === undefined || this.explanation[prop] === null ||
        this.explanation[prop] === '' || this.explanation[prop].length === 0 || Object.keys(this.explanation[prop]).length === 0)) {
          this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }

  addRow(modal: NgbActiveModal) {
    // save in db
    if(this.validateExplanation().length <= 0){
      this.validationModal = false;
      this.explanationsService.addExplanation(this.explanation).pipe(takeUntil(this.isExplanationsDead$)).subscribe((response) => {
        this.explanation = { _id: '-1', project: null, vessel: null, product: null, productName: null, productType: null, productTypeId: null, forecaster: null, analysis: null, text: CONTENT, note: NOTE };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Added the explanation #${response.data._id}`;
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

  transform(value: string): string {
    switch (value) {
      case 'project':
        return this.validationMessage = "Project is required";

      case 'vessel':
        return this.validationMessage = "Vessel is required";

      case 'product':
        return this.validationMessage = "Product is required";

      case 'forecaster':
        return this.validationMessage = "Forecaster is required";

      case 'analysis':
        return this.validationMessage = "Analysis is required";

      case 'text':
        return this.validationMessage = "Text is required";

      case 'note':
        return this.validationMessage = "Note is required";

      default:
        return this.validationMessage = "Please fill all the required fields";
    }
  }

  saveEditRow(modal: NgbActiveModal) {
    // save in db
    if(this.validateExplanation().length <= 0){
      this.validationModal = false;
      this.explanationsService.updateExplanation(this.explanation).pipe(takeUntil(this.isExplanationsDead$)).subscribe((response) => {
        this.explanation = { _id: '-1', project: null, vessel: null, product: null, productName: null, productType: null, productTypeId: null, forecaster: null, analysis: null, text: CONTENT, note: NOTE };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 1;
        tempLog.message = `Updated the explanation #${response.data._id}`;
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
    if (this.explanation._id !== undefined || this.explanation._id !== null || this.explanation._id !== '') {
      this.explanationsService.deleteExplanation(this.explanation._id).pipe(takeUntil(this.isExplanationsDead$)).subscribe((response) => {
        this.explanation = { _id: '-1', project: null, vessel: null, product: null, productName: null, productType: null, productTypeId: null, forecaster: null, analysis: null, text: CONTENT, note: NOTE };
        modal.close('Close click');
        const tempLog = Object.assign({}, this.log);
        const user = this.userSharingService.currentUser;
        tempLog.user = (user.firstname + ' ' + user.lastname).trim();
        tempLog.date = Date.now();
        tempLog.severity = 2;
        tempLog.message = `Deleted the explanation #${response.data}`;
        this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
      }, (error) => {
        this.errorModal = true;
        this.errorMessageModal = 'An error occurred on the server side.';
      });
    } else {
      this.errorModal = true;
      this.errorMessageModal = 'No explanation to delete.';
    }
  }

  getFlags(project: Project): string[] {
    const countries = this.countries.filter((c) => project.countries.includes(c._id));
    if (countries !== undefined) {
      return countries.slice().map((elt) => `./assets/images/flags/${elt.code}.svg`);
    } else {
      return [];
    }
  }

  getProject(id: string): Project {
    return this.projects.find(p => p._id === id);
  }

  getVessel(id: string): Vessel {
    return this.vessels.find(v => v._id === id);
  }

  getClient(id: string): Client {
    return this.clients.find(c => c._id === id);
  }

  getForecaster(id: string): Forecaster {
    return this.forecasters.find(f => f._id === id);
  }

  getAnalysis(id: string): Analysis {
    return this.analysis.find(a => a._id === id);
  }

  getProjectName(projectId: string): string {
    let projectName = '';
    const project = this.getProject(projectId);
    if (project) {
      const client = this.getClient(project.client);
      projectName += `${project.code} -`;
      if (client) {
        projectName += ` ${client.name}`;
      }
      projectName += ` ${project.name}`;
    }
    return projectName;
  }

  onProjectChange(event: {}): void {
    this.selectedProjects = event;
    this.explanation.vessel = null;
    this.explanation.product = null;
    this.explanation.forecaster = null;
    this.explanation.analysis = null;

    this.vesselsList = [];
    this.productList = [];
    this.forecasters = [];
    this.analysisList = [];

    if (event) {
      this.vesselsList = this.vessels.filter((elt) =>
        event['vessels'].find((e) => e.vessel_id === elt._id)
      );

      let selectedVessels = event['vessels'].map(
        (e) => e.Product_Details.productType
      );
    }
  }

  onVesselChange(event, status): void {
    this.selectedVessels = event;
    this.seletedProductType = {};
    this.seletedProductTypeName = "";
    this.seletedContactId = "";
    this.explanation.product = null;
    this.explanation.forecaster = null;
    this.explanation.analysis = null;
    this.productList = [];
    this.forecasters = [];
    this.analysisList = [];

    if (event) {
      if (this.selectedProjects && status == "add") {
        const filteredVess = this.selectedProjects.vessels.filter((elt) => {
          if (elt.vessel_id == event._id) {
            return elt;
          }
        });

        this.productList = [];
        for (let i = 0; i < filteredVess.length; i++) {
          for (let j = 0; j < this.products.length; j++) {
            if (this.products[j]._id === filteredVess[i].Product_Details.productType) {
              this.productList.push({
                prodTypeId: filteredVess[i].Product_Details.productType,
                prodName:
                  this.products[j].name + ' - ' + filteredVess[i].Product_Details.productName,
                prodContact: filteredVess[i].Product_Details.contact
              });
            }
          }
        }
      } else if (status == "edit") {
        const selectedProj = this.projects.find((e4) => {
          return e4._id === this.explanation.project;
        });

        const filteredVess = selectedProj.vessels.filter((elt) => {
          if (elt.vessel_id == event._id) {
            return elt;
          }
        });

        this.productList = [];
        for (let i = 0; i < filteredVess.length; i++) {
          for (let j = 0; j < this.products.length; j++) {
            if (this.products[j]._id === filteredVess[i].Product_Details.productType) {
              this.productList.push({
                prodTypeId: filteredVess[i].Product_Details.productType,
                prodName:
                  this.products[j].name + '-' + filteredVess[i].Product_Details.productName,
                prodContact: filteredVess[i].Product_Details.contact
              });
            }
          }
        }
      }
    }
  }

  onProductTypeChange(event) {
    this.explanation.productTypeId = event.prodTypeId;
    let findHyphen = event.prodName.indexOf('-');
    this.explanation.productName = event.prodName.slice(0, findHyphen);
    this.explanation.productType = event.prodName.slice(findHyphen + 1);
    this.seletedProductType = event;
    this.explanation.forecaster = null;
    this.explanation.analysis = null;
    this.forecasters = [];
    this.analysisList = [];

    if (event && this.selectedVessels) {
      const sortPTName = event.prodName.indexOf('-');
      this.seletedProductTypeName = event.prodName.substr(sortPTName + 1);
      this.seletedContactId = event.prodContact;
      this.forecasters = this.getUpdatedForecast(event.prodTypeId);
    }
  }

  getUpdatedForecast(event) {
    const forecast = this.forecasts.find((elt) => elt.project === this.explanation.project && elt.vessel === this.explanation.vessel && elt.productTypeId === event);
    if (forecast) {
      const filteredScheduler = this.schedulers.find((elt) => elt._id === forecast.schedulerId);
      if (Object.keys(filteredScheduler.forecasters).length <= 0 && filteredScheduler.testing == true) {
        return [{
          _id: "0",
          name: "No forecaster yet"
        }]
      }
      else {
        const resultForecasters = Object.keys(filteredScheduler.forecasters).map((res) => {
          return {
            _id: res,
            name: filteredScheduler.forecasters[res].name,
          };
        });
        return resultForecasters;
      }
    }
    return null;
  }

  onForecasterChange(event: {}): void {
    this.explanation.analysis = null;
    this.analysisList = [];
    if (event) {
      this.analysisList = this.analysis.slice().filter((elt) => {
        return elt.forecaster === this.explanation.forecaster && elt.project === this.explanation.project &&
          elt.vessel === this.explanation.vessel;
      });
    }
  }

  getShortId(id: string): string {
    if (!id) {
      return '';
    }
    if (id.length <= 8) {
      return id;
    }
    return `${id.slice(0, 4)}...${id.slice(-4)}`;
  }

  analysisSearchFn(term: string, item: Analysis): boolean {
    term = term.toLowerCase();
    const formattedDate = moment.utc(item.date).format('DD MMM YYYY HH:mm (z Z)').trim().toLowerCase();
    return item._id.trim().toLowerCase().includes(term) || formattedDate.includes(term);
  }

  projectSearchFn = (term: string, item: Project): boolean => {
    term = term.toLowerCase();
    const c = this.getClient(item.client);
    const client = (c) ? c.name : '';
    return item.name.trim().toLowerCase().includes(term) || item.code.trim().toLowerCase().includes(term) ||
      client.trim().toLowerCase().includes(term);
  }
}

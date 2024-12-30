import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Project } from '@app/shared/models/project';
import { Product } from '@app/shared/models/product';
import { Scheduler } from '@app/shared/models/scheduler';
import { Vessel } from '@app/shared/models/vessel';
import { Client } from '@app/shared/models/client';
import { Analysis } from '@app/shared/models/analysis';
import { Country } from '@app/shared/models/country';
import { forkJoin, Observable, Subject } from 'rxjs';
import { ProjectsService } from '@app/core/services/projects.service';
import { ProductsService } from '@app/core/services/products.service';
import { VesselsService } from '@app/core/services/vessels.service';
import { ClientsService } from '@app/core/services/clients.service';
import { AnalysisService } from '@app/core/services/analysis.service';
import { SchedulersService } from '@app/core/services/schedulers.service';
import { CountriesService } from '@app/core/services/countries.service';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { Forecaster } from '@app/shared/models/forecaster';
import { ForecastersService } from '@app/core/services/forecasters.service';
import { WeatherService } from '@app/core/services/weather.service';
import { Explanation } from '@app/shared/models/explanation';
import { ExplanationsService } from '@app/core/services/explanations.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-history-features',
  templateUrl: './history-features.component.html',
  styleUrls: ['./history-features.component.scss']
})
export class HistoryFeaturesComponent implements OnInit, AfterViewInit, OnDestroy {

  products: any[];
  vessels: any = [];
  forecasts: any[] = [];
  filteredProducts: any[];
  filteredForecasters: any[];
  projects: Project[];
  // analysis: Analysis[];
  analysis: any[];
  clients: Client[] = [];
  schedulers: Scheduler[];
  forecasters: Forecaster[] = [];
  filteredVessels: Vessel[] = [];
  explanations: Explanation[] = [];
  filteredForecasts: Analysis[] = [];
  filteredYearOfExecution: any = [];
  countries: Country[];
  selectedCountry: any;
  selectedProjects: any;
  selectedVessels: any;
  seletedProductType: any;
  seletedProductTypeId: string;
  seletedProductName: string;
  seletedProductTypeName: string;
  seletedContactId: string;
  schedulerID: string;
  currentRoute: string;
  selectedSession: string;
  selectedForecasts: any;
  selectedForecasters: any;
  resultForecasts: any;

  filter = {
    country: null,
    project: null,
    vessel: null,
    product: null,
    analysis: null,
    forecaster: null,
    yrOfExecution: null,
    forecast: null
  };

  state = { isLoaded: false, canConnect: null };
  resetCache = false;
  socketEvent: Observable<any>;

  // Dummy values of countries and year of execution
  // countries = [
  //   { _id: 1, nested: { countryId: 'L', name: 'Lithuania' } },
  //   { _id: 2, nested: { countryId: 'U', name: 'USA' } },
  //   { _id: 3, nested: { countryId: 'A', name: 'Australia' } }
  // ];



  selectedYrOfExecId: any;

  private isSocketEventDead$ = new Subject();
  private isProjectDead$ = new Subject();
  private isProductDead$ = new Subject();
  private isVesselsDead$ = new Subject();
  private isClientsDead$ = new Subject();
  private isAnalysisDead$ = new Subject();
  private isForecastersDead$ = new Subject();
  private isForecastsDead$ = new Subject();
  private isExplanationsDead$ = new Subject();
  private isSchedulersDead$ = new Subject();
  private isCountriesDead$ = new Subject();

  constructor(
    private projectService: ProjectsService,
    private productsService: ProductsService,
    private vesselsService: VesselsService,
    private clientsService: ClientsService,
    private analysisService: AnalysisService,
    private forecastersService: ForecastersService,
    private forecastsService: WeatherService,
    private explanationsService: ExplanationsService,
    private schedulersService: SchedulersService,
    private countriesService: CountriesService
  ) { }

  ngOnInit() {
    this.getData();
    this.currentRoute = window.location.hostname;
    this.socketEvent = this.analysisService.socketEvent;
  }

  ngAfterViewInit(): void {
    this.socketEvent.pipe(takeUntil(this.isSocketEventDead$)).subscribe(() => {
      this.resetCache = true;
      this.getData();
    });
  }

  ngOnDestroy(): void {
    this.isSocketEventDead$.next();
    this.isProjectDead$.next();
    this.isVesselsDead$.next();
    this.isClientsDead$.next();
    this.isAnalysisDead$.next();
    this.isForecastersDead$.next();
    this.isForecastsDead$.next();
    this.isExplanationsDead$.next();
    this.isSchedulersDead$.next();
    this.isCountriesDead$.next();
  }

  refresh(): void {
    this.resetCache = true;
    this.getData();
  }

  getData(): void {
    forkJoin([
      this.projectService.getEnabledProjects(this.resetCache).pipe(takeUntil(this.isProjectDead$)),
      this.productsService.getProducts(this.resetCache).pipe(takeUntil(this.isProductDead$)),
      this.clientsService.getClients(this.resetCache).pipe(takeUntil(this.isClientsDead$)),
      // this.analysisService.getAllAnalysis(this.resetCache).pipe(takeUntil(this.isAnalysisDead$)),
      this.explanationsService.getExplanations(this.resetCache).pipe(takeUntil(this.isExplanationsDead$)),
      this.schedulersService.getSchedulers(this.resetCache).pipe(takeUntil(this.isSchedulersDead$)),
      this.countriesService.getCountries(this.resetCache).pipe(takeUntil(this.isCountriesDead$))
    ]).subscribe((responses) => {
      // this.projects = responses[0].data;
      this.products = responses[1].data;
      this.clients = responses[2].data;
      // this.analysis = responses[3].data;
      this.explanations = responses[3].data;
      this.schedulers = responses[4].data;
      this.countries = responses[5].data;
      this.filteredVessels = [];
      this.filteredForecasts = [];
      this.resetCache = false;
      this.state.canConnect = true;
      this.state.isLoaded = true;
    }, (error) => {
      // this.projects = [];
      this.products = [];
      this.clients = [];
      // this.analysis = [];
      this.explanations = [];
      this.schedulers = [];
      this.filteredVessels = [];
      this.filteredForecasts = [];
      this.resetCache = true;
      this.state.canConnect = false;
      this.state.isLoaded = true;
    });
  }

  getClient(clientId: string): Client {
    return this.clients.find((elt) => elt._id === clientId);
  }

  projectSearchFn = (term: string, item: Project): boolean => {
    term = term.toLowerCase();
    const c = this.getClient(item.client);
    const client = (c) ? c.name : '';
    return item.name.trim().toLowerCase().includes(term) || item.code.trim().toLowerCase().includes(term) ||
      client.trim().toLowerCase().includes(term);
  }

  forecastSearchFn(term: string, item: any): boolean {
    term = term.toLowerCase();
    const formattedDate = moment.utc(item.dateUpdated).format('DD MMM YYYY HH:mm (z Z)').trim().toLowerCase();
    return item._id.trim().toLowerCase().includes(term) || formattedDate.includes(term);
  }

  onCountryChange(event: any): void {
    this.selectedCountry = event;
    this.selectedProjects = {};
    this.selectedVessels = {};
    this.seletedProductType = {};
    this.selectedForecasters = {};
    this.selectedYrOfExecId = {};
    this.selectedForecasts = {};
    this.filter.project = null;
    this.filter.vessel = null;
    this.filter.product = null;
    this.filter.forecaster = null;
    this.filter.yrOfExecution = null;
    this.filter.forecast = null;
    this.filter.analysis = null;
    this.projects = [];
    this.filteredVessels = [];
    this.filteredProducts = [];
    this.filteredForecasters = [];
    this.filteredYearOfExecution = [];
    this.filteredForecasts = [];

    if (event) {
      this.countriesService.getProjectsByCountryId(event._id, this.resetCache).subscribe((response) => {
        this.projects = response.data;
      }, (error) => {
        this.projects = [];
      });
    }
  }

  onProjectChange(event: {}): void {
    this.selectedProjects = event;
    this.selectedVessels = {};
    this.seletedProductType = {};
    this.selectedForecasters = {};
    this.selectedYrOfExecId = {};
    this.selectedForecasts = {};
    this.filteredProducts = [];
    this.filteredVessels = [];
    this.filteredForecasters = [];
    this.filteredYearOfExecution = [];
    this.filteredForecasts = [];
    this.analysis = [];
    this.filter.vessel = null;
    this.filter.product = null;
    this.filter.forecast = null;
    this.filter.yrOfExecution = null;
    this.filter.forecaster = null;
    this.filter.analysis = null;

    if (event) {
      this.getSelectedProject();
      this.vesselsService.getEnabledVessels(this.resetCache).subscribe((response) => {
        this.vessels = response.data;
        this.filteredVessels = this.vessels.filter((elt) =>
          event['vessels'].find((e) => e.vessel_id === elt._id)
        );

        let selectedVessels = event['vessels'].map(
          (e) => e.Product_Details.productType
        );
      });
    }
  }

  onVesselChange(event): void {
    this.selectedVessels = event;
    this.seletedProductType = {};
    this.seletedProductTypeId = "";
    this.seletedProductTypeName = "";
    this.selectedForecasters = {};
    this.selectedYrOfExecId = {};
    this.selectedForecasts = {};
    this.seletedContactId = "";
    this.seletedProductName = "";
    this.filteredProducts = [];
    this.filteredForecasters = [];
    this.filteredYearOfExecution = [];
    this.filteredForecasts = [];
    this.analysis = [];
    this.filter.product = null;
    this.filter.forecast = null;
    this.filter.yrOfExecution = null;
    this.filter.forecaster = null;
    this.filter.analysis = null;
    if (event) {
      if (this.selectedProjects) {
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
                contactId: filteredVess[i].Product_Details.contact,
                prodName: filteredVess[i].Product_Details.productName,
                prodTypeId: filteredVess[i].Product_Details.productType,
                prodTypeName:
                  this.products[j].name + ' - ' + filteredVess[i].Product_Details.productName,
              });
            }
          }
        }
      }
    }
  }

  onProductTypeChange(event) {
    this.seletedProductType = event;
    this.selectedForecasters = {};
    this.selectedYrOfExecId = {};
    this.selectedForecasts = {};
    this.filteredForecasters = [];
    this.filteredYearOfExecution = [];
    this.filteredForecasts = [];
    this.analysis = [];
    this.filter.forecast = null;
    this.filter.yrOfExecution = null;
    this.filter.forecaster = null;
    this.filter.analysis = null;

    if (event && this.selectedVessels) {
      const sortPTName = event.prodTypeName.indexOf('-');
      this.seletedProductTypeName = event.prodTypeName.substr(sortPTName + 1);
      this.seletedContactId = event.contactId;
      this.seletedProductTypeId = event.prodTypeId;
      this.seletedProductName = event.prodName;

      this.forecastsService.getForecastsWithoutForecaster(this.filter.project, this.filter.vessel).subscribe((response) => {
        this.forecasts = response.data;
        this.filteredForecasters = this.getUpdatedForecast(event.prodTypeId);
      });

      // this.forecastsService.getAllForecasts(this.resetCache).subscribe((response) => {
      //   this.forecasts = response.data;
      //   this.filteredForecasters = this.getUpdatedForecast(event.prodTypeId);
      // });
    }
  }

  getUpdatedForecast(event) {
    this.schedulerID = "";
    const chkprodTypeName = this.forecasts.some((o) => o.hasOwnProperty('productName')); // checking 'productName' property exist or not
    if (chkprodTypeName === true) {
      const productNameWithoutSpace = this.seletedProductName.trim();
      const forecast = this.forecasts.find((elt) => elt.project === this.filter.project && elt.vessel === this.filter.vessel && elt.productTypeId === event && elt.productName.trim() === productNameWithoutSpace);
      this.selectedSession = forecast.session;
      // this.getAnalysis(this.filter.project, this.filter.vessel, this.filter.forecaster, forecast.session);

      if (forecast) {
        const filteredScheduler = this.schedulers.find((elt) => elt._id === forecast.schedulerId);
        this.schedulerID = filteredScheduler._id;
  
        // QA Server OR UAT Server
        if (this.currentRoute === "infieldportal-qa.lab.technipfmc.com" || this.currentRoute === "infieldportal-uat.lab.technipfmc.com") {
          if (Object.keys(filteredScheduler.forecasters).length <= 0 && filteredScheduler.testing == true) {
            // return [{_id: "620bbddfdf687e244cce42fb",name: "Testing"}];
            return [
              {_id: "669a4e031883bc1a5047f6d9",name: "Weathervane_Testing"}, 
              {_id: "620bbddfdf687e244cce42fb",name: "Non-Weathervane_Testing"}
            ];
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
        } else if (this.currentRoute === "infieldportal.apps.technipfmc.com") { // Prod Server
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
        } else { // Localhost
          if (Object.keys(filteredScheduler.forecasters).length <= 0 && filteredScheduler.testing == true) {
            // return [{_id: "620bbddfdf687e244cce42fb",name: "Testing"}];
            return [
              {_id: "669a4e031883bc1a5047f6d9",name: "Weathervane_Testing"}, 
              {_id: "620bbddfdf687e244cce42fb",name: "Non-Weathervane_Testing"}
            ];
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
      }
      return null;
    }
    else{
      const forecast = this.forecasts.find((elt) => elt.project === this.filter.project && elt.vessel === this.filter.vessel && elt.productTypeId === event);
      this.selectedSession = forecast.session;
      // this.getAnalysis(this.filter.project, this.filter.vessel, this.filter.forecaster, forecast.session);
      

      if (forecast) {
        const filteredScheduler = this.schedulers.find((elt) => elt._id === forecast.schedulerId);
        this.schedulerID = filteredScheduler._id;
  
        // QA Server OR UAT Server
        if (this.currentRoute === "infieldportal-qa.lab.technipfmc.com" || this.currentRoute === "infieldportal-uat.lab.technipfmc.com") {
          if (Object.keys(filteredScheduler.forecasters).length <= 0 && filteredScheduler.testing == true) {
            // return [{_id: "620bbddfdf687e244cce42fb",name: "Testing"}];
            return [
              {_id: "669a4e031883bc1a5047f6d9",name: "Weathervane_Testing"}, 
              {_id: "620bbddfdf687e244cce42fb",name: "Non-Weathervane_Testing"}
            ];
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
        } else if (this.currentRoute === "infieldportal.apps.technipfmc.com") { // Prod Server
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
        } else { // Localhost
          if (Object.keys(filteredScheduler.forecasters).length <= 0 && filteredScheduler.testing == true) {
            // return [{_id: "620bbddfdf687e244cce42fb",name: "Testing"}];
            return [
              {_id: "669a4e031883bc1a5047f6d9",name: "Weathervane_Testing"}, 
              {_id: "620bbddfdf687e244cce42fb",name: "Non-Weathervane_Testing"}
            ];
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
      }
      return null;
    }
  }

  onForecasterChange(event: {}): void {
    this.selectedForecasters = event;
    this.selectedYrOfExecId = {};
    this.selectedForecasts = {};
    this.filteredYearOfExecution = [];
    this.filteredForecasts = [];
    this.analysis = [];
    this.filter.yrOfExecution = null;
    this.filter.forecast = null;
    this.filter.analysis = null;
    if (event) {
      this.filteredYearOfExecution = [{ _id: 1, value: 1 }, { _id: 2, value: 2 }, { _id: 3, value: 3 }, { _id: 4, value: 4 }, { _id: 5, value: 5 }];
    }
  }

  onYrOfExecChange(event: {}): void {
    this.selectedYrOfExecId = event;
    this.selectedForecasts = {};
    this.filteredForecasts = [];
    this.analysis = [];
    this.filter.forecast = null;
    this.filter.analysis = null;

    if (event) {
      this.forecastsService.getForecastByYear(this.selectedForecasters._id, this.selectedYrOfExecId._id, this.resetCache).subscribe((response) => {
        this.filteredForecasts = response.data.slice().filter((elt) => {
          return elt.project === this.filter.project && elt.vessel === this.filter.vessel && elt.productTypeId === this.seletedProductTypeId && elt.forecaster === this.filter.forecaster;
        });
      }, (error) => {
        this.filteredForecasts = [];
      });
    }
  }

  onForecastChange(event: {}): void {
    this.selectedForecasts = event;
    this.analysis = [];
    this.filter.analysis = null;
    if (event) {
      this.analysisService
        .getAnalysis(this.filter.project, this.filter.vessel, this.filter.forecaster, (event as any).session)
        .subscribe((response) => {
          if (response.success === true && response.data !== null) {
            this.analysis = Array(response.data);
            this.filter.analysis = this.analysis.find((elt) => {
              return elt.project === this.filter.project && elt.vessel === this.filter.vessel && elt.forecaster === this.filter.forecaster &&
                elt.session === (event as any).session;
            });
          }
          else {
            this.analysis = [];
          }
        });
    }
  }

  getSelectedAnalysis(): Analysis {
    return this.analysis.find((elt) => elt._id === ((this.filter.analysis) ? this.filter.analysis._id : null));
  }

  getSeletedProductT(): any {
    if (this.seletedProductType !== undefined) {
      return this.products.find((elt) => elt._id === this.seletedProductType.prodTypeId);
    }
  }

  getSelectedForecast(): any {
    return this.forecasts.find((elt) => elt._id === this.filter.forecast);
  }

  getSelectedExplanation(): Explanation {
    return this.explanations.find((elt) => elt.vessel === this.filter.vessel && elt.forecaster === this.filter.forecaster &&
      elt.project === this.filter.project && elt.analysis === ((this.filter.analysis) ? this.filter.analysis._id : null));
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

  getSelectedProject(): Project {
    return this.projects.find((elt) => elt._id === this.filter.project);
  }

  getSelectedVessel(): Vessel {
    return this.vessels.find((elt) => elt._id === this.filter.vessel);
  }

  onUpSelect() {
    const currentIndex = this.filteredForecasts.findIndex((elt) => elt._id === this.filter.forecast);
    if (currentIndex > 0 && this.filteredForecasts[currentIndex - 1]) {
      this.filter.forecast = this.filteredForecasts[currentIndex - 1]._id;

      this.filter.analysis = null;
      this.resultForecasts = {};
      this.resultForecasts = this.forecasts.find((elt) => elt._id === this.filter.forecast);
      this.filter.analysis = this.analysis.find((elt) => {
        return elt.project === this.resultForecasts.project && elt.vessel === this.resultForecasts.vessel && elt.forecaster === this.resultForecasts.forecaster &&
          elt.session === this.resultForecasts.session;
      });

    }
  }

  onDownSelect() {
    const currentIndex = this.filteredForecasts.findIndex((elt) => elt._id === this.filter.forecast);
    if (currentIndex >= 0 && currentIndex < this.filteredForecasts.length && this.filteredForecasts[currentIndex + 1]) {
      this.filter.forecast = this.filteredForecasts[currentIndex + 1]._id;

      this.filter.analysis = null;
      this.resultForecasts = {};
      this.resultForecasts = this.forecasts.find((elt) => elt._id === this.filter.forecast);
      this.filter.analysis = this.analysis.find((elt) => {
        return elt.project === this.resultForecasts.project && elt.vessel === this.resultForecasts.vessel && elt.forecaster === this.resultForecasts.forecaster &&
          elt.session === this.resultForecasts.session;
      });
    }
  }
}

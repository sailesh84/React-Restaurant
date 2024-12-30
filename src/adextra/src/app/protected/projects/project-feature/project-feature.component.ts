import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Scheduler } from '@app/shared/models/scheduler';
import { ProjectsService } from '@app/core/services/projects.service';
import { Project } from '@app/shared/models/project';
import { User } from '@app/shared/models/user';
import { TitlePageService } from '@app/core/services/title-page.service';
import { Vessel } from '@app/shared/models/vessel';
import { VesselsService } from '@app/core/services/vessels.service';
import { VesselsTypesService } from '@app/core/services/vessels-types.service';
import { SchedulersService } from '@app/core/services/schedulers.service';
import { UsersService } from '@app/core/services/users.service';
import { WeatherService } from '@app/core/services/weather.service';
import { forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VesselType } from '@app/shared/models/vessel-type';
import { Client } from '@app/shared/models/client';
import { Product } from '@app/shared/models/product';
import { ClientsService } from '@app/core/services/clients.service';
import { HttpResponse } from '@app/shared/models/http-response';
import { ForecastersService } from '@app/core/services/forecasters.service';
import { Forecaster } from '@app/shared/models/forecaster';
import { ProductsService } from '@app/core/services/products.service';
import { Analysis } from '@app/shared/models/analysis';
import { AnalysisService } from '@app/core/services/analysis.service';


@Component({
  selector: 'app-project-feature',
  templateUrl: './project-feature.component.html',
  styleUrls: ['./project-feature.component.scss']
})
export class ProjectFeatureComponent implements OnInit, OnDestroy {
  @Input() projectID = '-1';
  @Input() vesselID = '-1';
  @Input() projectTypeID = '-1';
  @Input() productName = '-1';
  @Input() contactID = '-1';

  state = { isLoaded: false, canConnect: null };

  project: Project;
  vessel: Vessel;
  vesselsTypes: VesselType[] = [];
  schedulers: Scheduler[];
  schedulerID: string;
  schedulerCurrent: boolean;
  schedulerCurrentData: string;
  forecastsSchedulerID: string;
  schedulerCurrentRunStatus: boolean;
  forecastUpdated;
  forecasts: any[];
  products: Product[];
  contact: User;
  forecasters: Forecaster[];
  filteredForecasters: any[];
  filteredForecasts: any;
  analysis: Analysis[];
  forecaster: string;
  forecast: any;
  filteredVessels = {};
  resetCache = false;
  currentRoute: string;
  isAlphaFactor: boolean;
  isFatigue: boolean;
  isActiveCFStatus: boolean = false;
  // forecastersList = {};

  client$: Observable<HttpResponse>;

  private isProjectDead$ = new Subject();
  private isWeatherDead$ = new Subject();
  private isVesselDead$ = new Subject();
  private isUserDead$ = new Subject();
  private isForecastersDead$ = new Subject();
  private isProductsDead$ = new Subject();
  private isAnalysisDead$ = new Subject();
  private isVesselsTypesDead$ = new Subject();
  private isSchedulersDead$ = new Subject();

  constructor(
    private projectsService: ProjectsService,
    private titlePageService: TitlePageService,
    private vesselsService: VesselsService,
    private clientsService: ClientsService,
    private usersService: UsersService,
    private weatherService: WeatherService,
    private forecastersService: ForecastersService,
    private productsService: ProductsService,
    private analysisService: AnalysisService,
    private vesselsTypesService: VesselsTypesService,
    private schedulersService: SchedulersService,
  ) {
    this.titlePageService.setTitle('Field Analysis');
  }

  ngOnInit() {
    this.getData();
    this.currentRoute = window.location.hostname;
    // if (this.currentRoute === "infieldportal-qa.apps.technipfmc.com") { // QA server
    //   this.forecastersList = {}
    // } else if (this.currentRoute === "infieldportal.apps.technipfmc.com") { // Prod Server
    //   this.wheaterList = ['Forecaster'];
    //   this.scheduler.testing = false;
    // } else { // Localhost
    //   this.wheaterList = ['Forecaster', 'Testing'];
    // }
  }

  ngOnDestroy(): void {
    this.isForecastersDead$.next();
    this.isProjectDead$.next();
    this.isWeatherDead$.next();
    this.isVesselDead$.next();
    this.isUserDead$.next();
    this.isProductsDead$.next();
    this.isAnalysisDead$.next();
    this.isVesselsTypesDead$.next();
    this.isSchedulersDead$.next();
  }

  getData() {
    forkJoin([
      this.forecastersService.getForecasters().pipe(takeUntil(this.isForecastersDead$)),
      this.weatherService.getForecastsWithoutForecaster(this.projectID, this.vesselID).pipe(takeUntil(this.isWeatherDead$)),
      this.projectsService.getProject(this.projectID).pipe(takeUntil(this.isProjectDead$)),
      this.vesselsService.getVessel(this.vesselID).pipe(takeUntil(this.isVesselDead$)),
      this.productsService.getProducts(this.resetCache).pipe(takeUntil(this.isProductsDead$)),
      this.analysisService.getLastAnalysisForSelectedFieldsAndVessels(this.projectID, this.vesselID, this.resetCache),
      this.vesselsTypesService.getVesselTypes(this.resetCache).pipe(takeUntil(this.isVesselsTypesDead$)),
      this.schedulersService.getSchedulers(this.resetCache).pipe(takeUntil(this.isSchedulersDead$))
        .pipe(takeUntil(this.isAnalysisDead$))
    ]
    ).subscribe((responses) => {
      this.forecasters = responses[0].data;
      this.forecasts = responses[1].data;
      this.project = responses[2].data;
      this.vessel = responses[3].data;
      this.products = responses[4].data;
      this.analysis = responses[5].data;
      this.vesselsTypes = responses[6].data;
      this.schedulers = responses[7].data;
      this.filteredForecasters = this.getUpdatedForecast();

      if (this.filteredForecasters && this.filteredForecasters.length > 0 && this.filteredForecasters.length === 1) {
        //whether filtered-forecaster value would receieve only one object as for value
        this.forecaster = this.filteredForecasters[0]._id;
      }
      else {
        //whether filtered-forecaster value would receieve more than one object as for value
        if (this.forecasts.length > 0) {
          this.filteredForecasts = this.forecasts.find(
            (elt) =>
              elt.project === this.projectID &&
              elt.vessel === this.vesselID &&
              elt.productTypeId === this.projectTypeID &&
              elt.productName.trim() === this.productName
          );
          this.forecaster = this.filteredForecasts.forecaster;
        }
      }

      this.forecastUpdated = this.getUpdatedDate();
      this.client$ = this.clientsService.getClient(this.project.client);

      if (this.vessel) {
        if (this.project.vessels.length > 0) {
          const selectedProjVess = this.project.vessels.find((e) => {
            return e.vessel_id === this.vesselID && e.Product_Details.productType === this.projectTypeID && e.Product_Details.contact === this.contactID;
          });

          this.usersService.getUserById(selectedProjVess.Product_Details.contact).pipe(takeUntil(this.isUserDead$))
            .subscribe((resp) => {
              this.contact = resp.data;
              this.state.canConnect = true;
              this.state.isLoaded = true;
            }, (err) => {
              this.contact = null;
              this.state.canConnect = true;
              this.state.isLoaded = true;
            });

        }
        else {
          this.contact = null;
          this.state.canConnect = true;
          this.state.isLoaded = true;
        }
      }
    }, error => {
      this.forecasters = [];
      this.forecaster = null;
      this.forecasts = [];
      this.schedulers = [];
      this.project = null;
      this.vessel = null;
      this.contact = null;
      this.forecastUpdated = null;
      this.state.canConnect = false;
      this.state.isLoaded = true;
    });
  }

  refresh(): void {
    this.getData();
  }

  onForecasterChange($event: any): void {
    this.forecaster = $event._id;
    this.forecastUpdated = this.getUpdatedDate();
  }

  private getUpdatedDate(): number {
    const chkprodName = this.forecasts.some((o) => o.hasOwnProperty('productName')); // checking 'productName' property exist or not
    if (chkprodName === true) {
      const forecast = this.forecasts.find((elt) => elt.project === this.projectID && elt.vessel === this.vesselID &&
        elt.productTypeId === this.projectTypeID && elt.forecaster === this.forecaster &&
        elt.productName.trim() === this.productName.trim());
      this.forecast = null;
      if (forecast) {
        this.forecast = forecast;
        this.forecastsSchedulerID = this.forecast.schedulerId;
        const resultScheduler = this.schedulers.filter((elem) => elem._id === this.forecastsSchedulerID);
        this.schedulerCurrentRunStatus = resultScheduler[0].isCurrentlyRunning;
        return forecast.dateUpdated;
      }
      return null;
    }
    else {
      const forecast = this.forecasts.find((elt) => elt.project === this.projectID && elt.vessel === this.vesselID && elt.productTypeId === this.projectTypeID && elt.forecaster === this.forecaster);
      this.forecast = null;
      if (forecast) {
        this.forecast = forecast;
        this.forecastsSchedulerID = this.forecast.schedulerId;
        const resultScheduler = this.schedulers.filter((elem) => elem._id === this.forecastsSchedulerID);
        this.schedulerCurrentRunStatus = resultScheduler[0].isCurrentlyRunning;
        return forecast.dateUpdated;
      }
      return null;
    }
  }

  //function for appending data in dropdown
  getUpdatedForecast() {
    this.schedulerID = "";
    const chkprodName = this.forecasts.some((o) => o.hasOwnProperty('productName')); // checking 'productName' property exist or not
    if (chkprodName === true) {
      const forecast = this.forecasts.find((elt) => elt.project === this.projectID && elt.vessel === this.vesselID && elt.productTypeId === this.projectTypeID && elt.productName.trim() === this.productName.trim());
      if (forecast) {
        const filteredScheduler = this.schedulers.find((elt) => elt._id === forecast.schedulerId);
        this.schedulerID = filteredScheduler._id;
        this.isAlphaFactor = filteredScheduler.alphaFactor;
        this.isFatigue = filteredScheduler.fatigue;
        this.schedulerCurrent = filteredScheduler.current;
        this.schedulerCurrentData = filteredScheduler.current_data;

        // QA Server OR UAT Server
        if (this.currentRoute === "infieldportal-qa.lab.technipfmc.com" || this.currentRoute === "infieldportal-uat.lab.technipfmc.com") {
          if (Object.keys(filteredScheduler.forecasters).length <= 0 && filteredScheduler.testing == true) {
            // return [{_id: "620bbddfdf687e244cce42fb",name: "Testing"}];
            return [
              { _id: "669a4e031883bc1a5047f6d9", name: "Weathervane_Testing" },
              { _id: "620bbddfdf687e244cce42fb", name: "Non-Weathervane_Testing" }
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
              { _id: "669a4e031883bc1a5047f6d9", name: "Weathervane_Testing" },
              { _id: "620bbddfdf687e244cce42fb", name: "Non-Weathervane_Testing" }
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
    else {
      const forecast = this.forecasts.find((elt) => elt.project === this.projectID && elt.vessel === this.vesselID && elt.productTypeId === this.projectTypeID);
      if (forecast) {
        const filteredScheduler = this.schedulers.find((elt) => elt._id === forecast.schedulerId);
        this.schedulerID = filteredScheduler._id;
        this.isAlphaFactor = filteredScheduler.alphaFactor;
        this.isFatigue = filteredScheduler.fatigue;

        // QA Server OR UAT Server
        if (this.currentRoute === "infieldportal-qa.lab.technipfmc.com" || this.currentRoute === "infieldportal-uat.lab.technipfmc.com") {
          if (Object.keys(filteredScheduler.forecasters).length <= 0 && filteredScheduler.testing == true) {
            // return [{_id: "620bbddfdf687e244cce42fb",name: "Testing"}];
            return [
              { _id: "669a4e031883bc1a5047f6d9", name: "Weathervane_Testing" },
              { _id: "620bbddfdf687e244cce42fb", name: "Non-Weathervane_Testing" }
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
              { _id: "669a4e031883bc1a5047f6d9", name: "Weathervane_Testing" },
              { _id: "620bbddfdf687e244cce42fb", name: "Non-Weathervane_Testing" }
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

  getLastSession(projectId: string, vesselId: string): any[] {
    const sessionData = [];
    let prevSession = null;
    const prevForecaster = [];
    for (const a of this.analysis) {
      if (a.project === projectId && a.vessel === vesselId) {
        if (!prevSession) {
          prevSession = a.session;
        }
        if (prevSession === a.session && !prevForecaster.includes(a.forecaster)) {
          prevForecaster.push(a.forecaster);
          sessionData.push(a);
        }
      }
    }
    return sessionData;
  }


  getProduct(vesselId: string) {
    return this.products.find((e1) => e1._id === this.projectTypeID);
  }

  getProductName(vesselId: string) {
    let resVessel = this.project.vessels.find((elt) => {
      if ((elt.vessel_id === vesselId) && (elt.Product_Details.productType === this.projectTypeID) && (elt.Product_Details.contact === this.contactID)) {
        return elt;
      }
    });
    return resVessel.Product_Details.productName;
  }

  // getForecast(projectId: string, vesselId: string, session: string): any {
  //   return (this.forecasts || []).find((elt) => elt.project === projectId && elt.vessel === vesselId && elt.session === session);
  // }

  getBorderLeftColorVesselType(currentType: string): string {
    const type = this.vesselsTypes.find((t) => t._id.toString() === currentType.toString());
    if (type !== undefined) {
      return type.color;
    }
  }

  checkCurrForecasterStatusInProject(event: any) {
    this.isActiveCFStatus = event;
  }

  checkCurrForecasterStatusInProjectFromSummary(event: any) {
    this.isActiveCFStatus = event;
  }

  checkCurrForecasterStatusInProjectFromAnalysis(event: any) {
    this.isActiveCFStatus = event;
  }
  
  checkCurrForecasterStatusInProjectFromWF(event: any) {
    this.isActiveCFStatus = event;
  }
  
  checkCurrForecasterStatusInProjectFromWI(event: any) {
    this.isActiveCFStatus = event;
  }
  
  checkCurrForecasterStatusInProjectFromInformation(event: any) {
    this.isActiveCFStatus = event;
  }
}

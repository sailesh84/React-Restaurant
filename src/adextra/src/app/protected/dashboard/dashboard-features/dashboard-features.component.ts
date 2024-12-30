import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Project } from '@app/shared/models/project';
import { ProjectsService } from '@app/core/services/projects.service';
import { VesselsTypesService } from '@app/core/services/vessels-types.service';
import { VesselType } from '@app/shared/models/vessel-type';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Vessel } from '@app/shared/models/vessel';
import { VesselsService } from '@app/core/services/vessels.service';
import { CountriesService } from '@app/core/services/countries.service';
import { Country } from '@app/shared/models/country';
import { takeUntil } from 'rxjs/operators';
import { Continents } from '@app/shared/enums/continents.enum';
import { RegionsService } from '@app/core/services/regions.service';
import { Region } from '@app/shared/models/region';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { Client } from '@app/shared/models/client';
import { ClientsService } from '@app/core/services/clients.service';
import { Analysis } from '@app/shared/models/analysis';
import { AnalysisService } from '@app/core/services/analysis.service';
import { WeatherService } from '@app/core/services/weather.service';
import { Accesses } from '@app/shared/enums/accesses.enum';
import { ProductsService } from '@app/core/services/products.service';
import { Product } from '@app/shared/models/product';
import { User } from '@app/shared/models/user';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UsersService } from '@app/core/services/users.service';
import * as Highcharts from 'highcharts';
// import proj4 from 'proj4';
import HC_map from 'highcharts/modules/map';
import HC_boost from 'highcharts/modules/boost';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_drilldown from 'highcharts/modules/drilldown';
import HC_draggable_points from 'highcharts/modules/draggable-points';
import HC_accessibility from 'highcharts/modules/accessibility';
HC_map(Highcharts);
HC_boost(Highcharts);
HC_no_data_to_display(Highcharts);
HC_drilldown(Highcharts);
HC_draggable_points(Highcharts);
HC_accessibility(Highcharts);

declare const require: any;

@Component({
  selector: 'app-dashboard-features',
  templateUrl: './dashboard-features.component.html',
  styleUrls: ['./dashboard-features.component.scss']
})
export class DashboardFeaturesComponent implements OnInit, AfterViewInit, OnDestroy {

  isShowedFilters = false;
  isCollapsedPanel: boolean = true;
  isVesselSearch: boolean = false;
  resetCache = false;

  favoriteProjects: Project[];
  analysis: Analysis[];
  clients: Client[] = [];
  countries: Country[] = [];
  projects: Project[];
  projectsAll: Project[];
  vesselsTypes: VesselType[] = [];
  vessels: Vessel[] = [];
  regions: Region[] = [];
  forecasts: any[];
  products: Product[];
  user: User;
  region = null;
  highcharts = null;
  chartOptions = {};
  countryContinent: string = null;
  selectedRegion: string = null;

  state = { isLoaded: false, canConnect: null };
  selectedbugOccuredNameList = { option: 'This Page' };
  filterForm = {
    prop: 'name',
    sortBy: 1
  };
  projectFilter = {
    // region: null,
    countries: null,
    property: "name",
    sortBy: 1,
    PageNumber: 1,
    dataSize: 4,
    vessel_id: "",
    project_name_code: ""
  };

  colorWorld = {
    europe: '#4cc3d9',
    asia: '#93648e',
    oceania: '#404040',
    africa: '#7bc8a4',
    'north-america': '#f16645',
    'south-america': '#ffc65d'
  };

  bugOccuredNameList = ['This Page', 'Another Page'];

  currentPageUrl: string;
  searchText: string = "";
  searchVesselsText: string = "";
  expandIcon = 'expand_more';
  page = 1;
  pageSize = 4;
  collectionSize = 0;
  paginateData: any[] = [];
  selectedCountry: { name: string, iso: string } = null;

  @Input() initialProjectValue: string = '';
  @Input() initialVesselValue: string = '';
  @Input() debounceTime = 3000;

  inputProjectValue = new Subject<string>();
  triggerProject = this.inputProjectValue.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  );

  inputVesselValue = new Subject<string>();
  triggerVessel = this.inputVesselValue.pipe(
    debounceTime(this.debounceTime),
    distinctUntilChanged()
  );

  subscriptionsProject: Subscription[] = [];
  subscriptionsVessel: Subscription[] = [];

  socketEvent: Observable<any>;
  @ViewChild('modalFeedback', { static: true }) modalFeedback: ElementRef;

  private isSocketEventDead$ = new Subject();
  private isProjectDead$ = new Subject();
  private isVesselsTypesDead$ = new Subject();
  private isVesselsDead$ = new Subject();
  private isCountriesDead$ = new Subject();
  private isRegionsDead$ = new Subject();
  private isClientsDead$ = new Subject();
  private isAnalysisDead$ = new Subject();
  private isWeatherDead$ = new Subject();
  private isProductsDead$ = new Subject();
  private isUserDead$ = new Subject();
  private isDead$ = new Subject();
  private subscription: Subscription;

  constructor(
    private userService: UsersService,
    private projectService: ProjectsService,
    private vesselsTypesService: VesselsTypesService,
    private vesselsService: VesselsService,
    private countriesService: CountriesService,
    private regionsService: RegionsService,
    private clientsService: ClientsService,
    private analysisService: AnalysisService,
    private weatherService: WeatherService,
    private productsService: ProductsService,
    private userSharingService: UserSharingService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
    this.getData();
    const subscriptionProj = this.triggerProject.subscribe((currentValueProject) => {
      if (currentValueProject.length > 0) {

        this.projectFilter.project_name_code = currentValueProject;
        this.projectFilter.PageNumber = 1;
        this.page = 1;
        this.projectFilter.countries = null;

        this.projectService.getEnabledProjectsByPaging(this.projectFilter).subscribe((resp) => {
          if (resp.success === true && resp.totalRecords >= 0) {

            this.projects = resp.data;
            this.paginateData = resp.data;
            this.collectionSize = resp.totalRecords;

            if (this.userSharingService.currentUser.favouriteProjects) {
              this.favoriteProjects = this.projectsAll.slice()
                .filter((elt) => this.userSharingService.currentUser.favouriteProjects.includes(elt._id));
            } else {
              this.favoriteProjects = [];
            }

            const tempProjects = this.projectsAll.slice().map((elt) => elt._id).join(',');
            const tempVessels = this.vessels.slice().map((elt) => elt._id).join(',');
            // const tempVessels = this.getFilteredVessels(this.projects);

            forkJoin([
              this.analysisService.getLastAnalysisForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
                .pipe(takeUntil(this.isAnalysisDead$)),
              this.weatherService.getLastForecastsForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
                .pipe(takeUntil(this.isWeatherDead$)),
            ]).subscribe((resp) => {
              this.analysis = resp[0].data;
              this.forecasts = resp[1].data;
              this.resetCache = false;
              this.state.canConnect = true;
              this.state.isLoaded = true;
            }, () => {
              this.analysis = [];
              this.forecasts = [];
              this.resetCache = false;
              this.state.canConnect = true;
              this.state.isLoaded = true;
            });

          }
          else {
            this.projects = resp.data;
            this.paginateData = resp.data;
            this.collectionSize = resp.totalRecords;
          }
        });
      }
      else {

        this.projectFilter.PageNumber = 1;
        this.projectFilter.project_name_code = "";
        this.projectFilter.countries = null;
        this.page = 1;

        this.projectService.getEnabledProjectsByPaging(this.projectFilter).subscribe((resp) => {
          if (resp.success === true && resp.totalRecords >= 0) {

            this.projects = resp.data;
            this.paginateData = resp.data;
            this.collectionSize = resp.totalRecords;

            if (this.userSharingService.currentUser.favouriteProjects) {
              this.favoriteProjects = this.projectsAll.slice()
                .filter((elt) => this.userSharingService.currentUser.favouriteProjects.includes(elt._id));
            } else {
              this.favoriteProjects = [];
            }

            const tempProjects = this.projectsAll.slice().map((elt) => elt._id).join(',');
            const tempVessels = this.vessels.slice().map((elt) => elt._id).join(',');
            // const tempVessels = this.getFilteredVessels(this.projects);

            forkJoin([
              this.analysisService.getLastAnalysisForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
                .pipe(takeUntil(this.isAnalysisDead$)),
              this.weatherService.getLastForecastsForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
                .pipe(takeUntil(this.isWeatherDead$)),
            ]).subscribe((resp) => {
              this.analysis = resp[0].data;
              this.forecasts = resp[1].data;
              this.resetCache = false;
              this.state.canConnect = true;
              this.state.isLoaded = true;
            }, () => {
              this.analysis = [];
              this.forecasts = [];
              this.resetCache = false;
              this.state.canConnect = true;
              this.state.isLoaded = true;
            });
          }
          else {
            this.projects = resp.data;
            this.paginateData = resp.data;
            this.collectionSize = resp.totalRecords;
          }
        });
      }

    });
    this.subscriptionsProject.push(subscriptionProj);

    const subscriptionVessel = this.triggerVessel.subscribe((currentValueVessel) => {
      if (currentValueVessel.length > 0) {

        this.projectFilter.vessel_id = currentValueVessel;
        this.projectFilter.PageNumber = 1;
        this.projectFilter.countries = null;
        this.page = 1;

        this.projectService.getEnabledProjectsByPaging(this.projectFilter).subscribe((resp) => {
          if (resp.success === true && resp.totalRecords >= 0) {

            this.projects = resp.data;
            this.paginateData = resp.data;
            this.collectionSize = resp.totalRecords;

            if (this.userSharingService.currentUser.favouriteProjects) {
              this.favoriteProjects = this.projects.slice()
                .filter((elt) => this.userSharingService.currentUser.favouriteProjects.includes(elt._id));
            } else {
              this.favoriteProjects = [];
            }

            const tempProjects = this.projectsAll.slice().map((elt) => elt._id).join(',');
            const tempVessels = this.vessels.slice().map((elt) => elt._id).join(',');
            // const tempVessels = this.getFilteredVessels(this.projects);

            forkJoin([
              this.analysisService.getLastAnalysisForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
                .pipe(takeUntil(this.isAnalysisDead$)),
              this.weatherService.getLastForecastsForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
                .pipe(takeUntil(this.isWeatherDead$)),
            ]).subscribe((resp) => {
              this.analysis = resp[0].data;
              this.forecasts = resp[1].data;
              this.resetCache = false;
              this.state.canConnect = true;
              this.state.isLoaded = true;
            }, () => {
              this.analysis = [];
              this.forecasts = [];
              this.resetCache = false;
              this.state.canConnect = true;
              this.state.isLoaded = true;
            });

          }
          else {
            this.projects = resp.data;
            this.paginateData = resp.data;
            this.collectionSize = resp.totalRecords;
          }
        });
      }
      else {

        this.projectFilter.PageNumber = 1;
        this.projectFilter.vessel_id = "";
        this.projectFilter.countries = null;
        this.page = 1;

        this.projectService.getEnabledProjectsByPaging(this.projectFilter).subscribe((resp) => {
          if (resp.success === true && resp.totalRecords >= 0) {

            this.projects = resp.data;
            this.paginateData = resp.data;
            this.collectionSize = resp.totalRecords;

            if (this.userSharingService.currentUser.favouriteProjects) {
              this.favoriteProjects = this.projects.slice()
                .filter((elt) => this.userSharingService.currentUser.favouriteProjects.includes(elt._id));
            } else {
              this.favoriteProjects = [];
            }

            const tempProjects = this.projectsAll.slice().map((elt) => elt._id).join(',');
            const tempVessels = this.vessels.slice().map((elt) => elt._id).join(',');
            // const tempVessels = this.getFilteredVessels(this.projects);

            forkJoin([
              this.analysisService.getLastAnalysisForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
                .pipe(takeUntil(this.isAnalysisDead$)),
              this.weatherService.getLastForecastsForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
                .pipe(takeUntil(this.isWeatherDead$)),
            ]).subscribe((resp) => {
              this.analysis = resp[0].data;
              this.forecasts = resp[1].data;
              this.resetCache = false;
              this.state.canConnect = true;
              this.state.isLoaded = true;
            }, () => {
              this.analysis = [];
              this.forecasts = [];
              this.resetCache = false;
              this.state.canConnect = true;
              this.state.isLoaded = true;
            });

          }
          else {
            this.projects = resp.data;
            this.paginateData = resp.data;
            this.collectionSize = resp.totalRecords;
          }

        });
      }
    });
    this.subscriptionsVessel.push(subscriptionVessel);
    this.socketEvent = this.vesselsTypesService.socketEvent;
  }

  ngAfterViewInit(): void {
    this.socketEvent.pipe(takeUntil(this.isSocketEventDead$)).subscribe(() => {
      this.resetCache = true;
      this.getData();
    });
    this.subscription = this.userSharingService.user.subscribe((user) => {
      if (this.favoriteProjects && user && user.favouriteProjects) {
        this.favoriteProjects = this.projectsAll.slice().filter((elt) => user.favouriteProjects.includes(elt._id));
      }
    });
  }

  getData(): void {
    const keys = { uid: localStorage.getItem('user-uid'), email: localStorage.getItem('user-email') };
    forkJoin([
      this.countriesService.getCountries(this.resetCache).pipe(takeUntil(this.isCountriesDead$)),
      this.vesselsTypesService.getVesselTypes(this.resetCache).pipe(takeUntil(this.isVesselsTypesDead$)),
      this.vesselsService.getEnabledVessels(this.resetCache).pipe(takeUntil(this.isVesselsDead$)),
      this.projectService.getEnabledProjects(this.resetCache).pipe(takeUntil(this.isProjectDead$)),
      this.regionsService.getRegions(this.resetCache).pipe(takeUntil(this.isRegionsDead$)),
      this.clientsService.getClients(this.resetCache).pipe(takeUntil(this.isClientsDead$)),
      this.productsService.getProducts(this.resetCache).pipe(takeUntil(this.isProductsDead$)),
      this.userService.getUser(keys.email).pipe(takeUntil(this.isDead$)),
    ]).subscribe((response) => {
      this.vessels = response[2].data;
      this.vesselsTypes = response[1].data;
      this.projectsAll = response[3].data;
      this.products = response[6].data;
      this.user = response[7].data;

      this.countries = response[0].data;
      this.regions = response[4].data;
      this.clients = response[5].data;
      // this.region = this.user.favouriteRegion;
      this.region = null;
      this.projectFilter.countries = null;

      // this.projectFilter.region = this.region;
      // const filteredContinets = this.regions.filter((item) => this.region.includes(item._id));
      // this.countryContinent = filteredContinets[0].continent;
      // this.selectedRegion = filteredContinets[0].name;

      this.generateMap();

      this.projectService.getEnabledProjectsByPaging(this.projectFilter).subscribe((responseData) => {
        if (responseData.success === true) {

          this.projects = responseData.data;
          this.paginateData = responseData.data;
          this.collectionSize = responseData.totalRecords;

          if (this.userSharingService.currentUser.favouriteProjects) {
            this.favoriteProjects = this.projectsAll.slice()
              .filter((elt) => this.userSharingService.currentUser.favouriteProjects.includes(elt._id));
          } else {
            this.favoriteProjects = [];
          }

          const tempProjects = this.projectsAll.slice().map((elt) => elt._id).join(',');
          const tempVessels = this.vessels.slice().map((elt) => elt._id).join(',');
          // const tempVessels = this.getFilteredVessels(this.projects);

          forkJoin([
            this.analysisService.getLastAnalysisForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
              .pipe(takeUntil(this.isAnalysisDead$)),
            this.weatherService.getLastForecastsForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
              .pipe(takeUntil(this.isWeatherDead$)),
          ]).subscribe((resp) => {
            this.analysis = resp[0].data;
            this.forecasts = resp[1].data;
            this.resetCache = false;
            this.state.canConnect = true;
            this.state.isLoaded = true;
          }, () => {
            this.analysis = [];
            this.forecasts = [];
            this.resetCache = false;
            this.state.canConnect = true;
            this.state.isLoaded = true;
          });
        }
      });

    }, (error) => {
      this.vessels = [];
      this.vesselsTypes = [];
      this.projects = [];
      this.countries = [];
      this.regions = [];
      this.clients = [];
      this.analysis = [];
      this.forecasts = [];
      this.products = [];

      this.resetCache = true;
      this.state.canConnect = false;
      this.state.isLoaded = true;
    });
  }

  showFilters() {
    this.isShowedFilters = !this.isShowedFilters;
    if (!this.isShowedFilters) {
      this.expandIcon = 'expand_more';
    } else {
      this.expandIcon = 'expand_less';
    }
  }

  refresh(): void {
    this.resetCache = true;
    this.getData();
  }

  ngOnDestroy(): void {
    this.isSocketEventDead$.next();
    this.isProjectDead$.next();
    this.isVesselsTypesDead$.next();
    this.isVesselsDead$.next();
    this.isCountriesDead$.next();
    this.isRegionsDead$.next();
    this.isClientsDead$.next();
    this.isAnalysisDead$.next();
    this.isWeatherDead$.next();
    this.isProductsDead$.next();
    this.subscription.unsubscribe();
    this.subscriptionsProject.forEach((sub) => sub.unsubscribe());
    this.subscriptionsVessel.forEach((sub) => sub.unsubscribe());
  }

  getClient(clientId: string): Client {
    return this.clients.find((elt) => elt._id === clientId);
  }

  // getFilteredVessels(projectList) {
  //   let projects = projectList;
  //   if (this.searchVesselsText && this.searchVesselsText.trim().length > 2) {
  //     const vess = this.vessels.filter((elt) =>
  //       elt.name.toLowerCase().includes(this.searchVesselsText.toLowerCase())
  //     );

  //     projects = projects.slice().filter((elt) => {
  //       for (let i = 0; i < vess.length; i++) {
  //         for (let j = 0; j < elt.vessels.length; j++) {
  //           if (elt.vessels[j].vessel_id === vess[i]._id) {
  //             return elt;
  //           }
  //         }
  //       }
  //     });
  //   }
  //   else {
  //     return projects;
  //   }

  //   if (projects.length <= 1) {
  //     return projects;
  //   }

  //   const props = ['name', 'code', 'client'];
  //   const sortBys = [1, -1];

  //   if (props.findIndex(el => el === this.filterForm.prop) === -1) {
  //     this.filterForm.prop = 'name';
  //   }
  //   if (sortBys.findIndex(el => el === this.filterForm.sortBy) === -1) {
  //     this.filterForm.sortBy = 1;
  //   }

  //   const result = projects.slice();
  //   if (this.filterForm.prop === 'name' || this.filterForm.prop === 'code') {
  //     result.sort((a, b) => {
  //       return a[this.filterForm.prop].toString().localeCompare(b[this.filterForm.prop].toString());
  //     });
  //   }
  //   if (this.filterForm.prop === 'client') {
  //     result.sort((a, b) => {
  //       return this.getClient(a[this.filterForm.prop]).name.localeCompare(this.getClient(b[this.filterForm.prop]).name);
  //     });
  //   }
  //   if (this.filterForm.sortBy === 'desc') {
  //     return result.reverse();
  //   }

  //   return result;

  // }

  // getFilteredProjects(): Project[] {
  //   let projects = (this.region) ? this.projects.slice().filter((elt) => elt.region === this.region)
  //     .filter((elt) => !this.favoriteProjects.find((e) => e._id === elt._id)) : this.projects.slice()
  //       .filter((elt) => !this.favoriteProjects.find((e) => e._id === elt._id));

  //   if (this.searchText && this.searchText.trim().length > 2) {
  //     projects = projects.slice().filter((elt) => {
  //       const client = this.getClient(elt.client);

  //       if (client) {
  //         return elt.name.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) ||
  //           elt.code.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) ||
  //           client.name.trim().toLowerCase().includes(this.searchText.trim().toLowerCase());
  //       } else {
  //         return (elt.name != null) ? elt.name.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) :
  //           elt.name.toLowerCase().includes(this.searchText.trim().toLowerCase()) ||
  //             (elt.code != null) ? elt.code.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) :
  //             elt.code.toLowerCase().includes(this.searchText.trim().toLowerCase());
  //       }
  //     });
  //   }

  //   if (projects.length <= 1) {
  //     this.collectionSize = projects.length;
  //     return projects;
  //   }

  //   const props = ['name', 'code', 'client'];
  //   const sortBys = ['1', '-1'];

  //   if (props.findIndex(el => el === this.filterForm.prop) === -1) {
  //     this.filterForm.prop = 'name';
  //   }
  //   if (sortBys.findIndex(el => el === this.filterForm.sortBy) === -1) {
  //     this.filterForm.sortBy = 1;
  //   }

  //   const result = projects.slice();
  //   if (this.filterForm.prop === 'name' || this.filterForm.prop === 'code') {
  //     result.sort((a, b) => {
  //       return a[this.filterForm.prop].toString().localeCompare(b[this.filterForm.prop].toString());
  //     });
  //   }
  //   if (this.filterForm.prop === 'client') {
  //     result.sort((a, b) => {
  //       return this.getClient(a[this.filterForm.prop]).name.localeCompare(this.getClient(b[this.filterForm.prop]).name);
  //     });
  //   }
  //   if (this.filterForm.sortBy === 'desc') {
  //     return result.reverse();
  //   }

  //   let vesselsResult = this.getFilteredVessels(result);
  //   // this.collectionSize = vesselsResult.length;
  //   return vesselsResult;

  // }

  trackByFn(index: number, item: any): any {
    return index; // or item._id
  }

  getContinent(continent: string): string {
    return Continents[continent] || 'Others';
  }

  getRegion(): Region {
    if (this.region) {
      return this.regions.find((elt) => elt._id === this.region);
    }
  }

  projectsCount(): number {
    let tab = this.projects.slice();
    if (this.region) {
      tab = tab.slice().filter((elt) => elt.region === this.region);
    }
    if (this.searchText && this.searchText.trim().length > 2) {
      tab = tab.slice().filter((elt) => {
        const client = this.getClient(elt.client);
        if (client) {
          return elt.name.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) ||
            elt.code.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) ||
            client.name.trim().toLowerCase().includes(this.searchText.trim().toLowerCase());
        } else {
          return (elt.name != null) ? elt.name.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) :
            elt.name.toLowerCase().includes(this.searchText.trim().toLowerCase()) ||
              (elt.code != null) ? elt.code.trim().toLowerCase().includes(this.searchText.trim().toLowerCase()) :
              elt.code.toLowerCase().includes(this.searchText.trim().toLowerCase());
        }
      });
    }
    return tab.length;
  }

  isVisitor(): boolean {
    return this.userSharingService.currentUser.access === Accesses.Visitor;
  }

  getPremiumData() {
    this.isCollapsedPanel = true;
    this.expandIcon = 'expand_more';
    this.projectFilter.PageNumber = this.page;
    this.projectFilter.countries = null;

    this.projectService.getEnabledProjectsByPaging(this.projectFilter).subscribe((resp) => {
      if (resp.success === true && resp.totalRecords > 0) {

        this.projects = resp.data;
        this.paginateData = resp.data;
        this.collectionSize = resp.totalRecords;

        if (this.userSharingService.currentUser.favouriteProjects) {
          this.favoriteProjects = this.projectsAll.slice()
            .filter((elt) => this.userSharingService.currentUser.favouriteProjects.includes(elt._id));
        } else {
          this.favoriteProjects = [];
        }

        const tempProjects = this.projectsAll.slice().map((elt) => elt._id).join(',');
        const tempVessels = this.vessels.slice().map((elt) => elt._id).join(',');
        // const tempVessels = this.getFilteredVessels(this.projects);

        forkJoin([
          this.analysisService.getLastAnalysisForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
            .pipe(takeUntil(this.isAnalysisDead$)),
          this.weatherService.getLastForecastsForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
            .pipe(takeUntil(this.isWeatherDead$)),
        ]).subscribe((response) => {
          this.analysis = response[0].data;
          this.forecasts = response[1].data;
          this.resetCache = false;
          this.state.canConnect = true;
          this.state.isLoaded = true;
        }, () => {
          this.analysis = [];
          this.forecasts = [];
          this.resetCache = false;
          this.state.canConnect = true;
          this.state.isLoaded = true;
        });

      }
      else {
        this.projects = resp.data;
        this.paginateData = resp.data;
        this.collectionSize = resp.totalRecords;
      }
    });
  }

  public onChangeProperties(event) {
    const value = event.target.value;
    this.filterForm.prop = value;
    this.projectFilter.property = value;
    this.projectFilter.countries = null;
    this.projectFilter.PageNumber = 1;
    this.page = 1;

    this.projectService.getEnabledProjectsByPaging(this.projectFilter).subscribe((resp) => {
      if (resp.success === true && resp.totalRecords > 0) {

        this.projects = resp.data;
        this.paginateData = resp.data;
        this.collectionSize = resp.totalRecords;

        if (this.userSharingService.currentUser.favouriteProjects) {
          this.favoriteProjects = this.projectsAll.slice()
            .filter((elt) => this.userSharingService.currentUser.favouriteProjects.includes(elt._id));
        } else {
          this.favoriteProjects = [];
        }

        const tempProjects = this.projectsAll.slice().map((elt) => elt._id).join(',');
        const tempVessels = this.vessels.slice().map((elt) => elt._id).join(',');
        // const tempVessels = this.getFilteredVessels(this.projects);

        forkJoin([
          this.analysisService.getLastAnalysisForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
            .pipe(takeUntil(this.isAnalysisDead$)),
          this.weatherService.getLastForecastsForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
            .pipe(takeUntil(this.isWeatherDead$)),
        ]).subscribe((resp) => {
          this.analysis = resp[0].data;
          this.forecasts = resp[1].data;
          this.resetCache = false;
          this.state.canConnect = true;
          this.state.isLoaded = true;
        }, () => {
          this.analysis = [];
          this.forecasts = [];
          this.resetCache = false;
          this.state.canConnect = true;
          this.state.isLoaded = true;
        });

      }
      else {
        this.projects = resp.data;
        this.paginateData = resp.data;
        this.collectionSize = resp.totalRecords;
      }
    });
  }

  public onChangeSorting(event) {
    const value = event.target.value;
    this.filterForm.sortBy = parseInt(value);
    this.projectFilter.sortBy = parseInt(value);
    this.projectFilter.countries = null;
    this.projectFilter.PageNumber = 1;
    this.page = 1;

    this.projectService.getEnabledProjectsByPaging(this.projectFilter).subscribe((resp) => {
      if (resp.success === true && resp.totalRecords > 0) {

        this.projects = resp.data;
        this.paginateData = resp.data;
        this.collectionSize = resp.totalRecords;

        if (this.userSharingService.currentUser.favouriteProjects) {
          this.favoriteProjects = this.projectsAll.slice()
            .filter((elt) => this.userSharingService.currentUser.favouriteProjects.includes(elt._id));
        } else {
          this.favoriteProjects = [];
        }

        const tempProjects = this.projectsAll.slice().map((elt) => elt._id).join(',');
        const tempVessels = this.vessels.slice().map((elt) => elt._id).join(',');
        // const tempVessels = this.getFilteredVessels(this.projects);

        forkJoin([
          this.analysisService.getLastAnalysisForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
            .pipe(takeUntil(this.isAnalysisDead$)),
          this.weatherService.getLastForecastsForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
            .pipe(takeUntil(this.isWeatherDead$)),
        ]).subscribe((resp) => {
          this.analysis = resp[0].data;
          this.forecasts = resp[1].data;
          this.resetCache = false;
          this.state.canConnect = true;
          this.state.isLoaded = true;
        }, () => {
          this.analysis = [];
          this.forecasts = [];
          this.resetCache = false;
          this.state.canConnect = true;
          this.state.isLoaded = true;
        });
      }
      else {
        this.projects = resp.data;
        this.paginateData = resp.data;
        this.collectionSize = resp.totalRecords;
      }
    });
  }

  public onChangeRegion(event) {
    this.analysis = [];
    this.forecasts = [];
    const value = event._id;
    this.region = value;
    // this.projectFilter.region = value;
    this.projectFilter.PageNumber = 1;
    this.page = 1;
    // this.generateMap(event.continent);

    this.projectService.getEnabledProjectsByPaging(this.projectFilter).subscribe((resp) => {
      if (resp.success === true && resp.totalRecords > 0) {

        this.projects = resp.data;
        this.paginateData = resp.data;
        this.collectionSize = resp.totalRecords;

        if (this.userSharingService.currentUser.favouriteProjects) {
          this.favoriteProjects = this.projectsAll.slice()
            .filter((elt) => this.userSharingService.currentUser.favouriteProjects.includes(elt._id));
        } else {
          this.favoriteProjects = [];
        }

        const tempProjects = this.projectsAll.slice().map((elt) => elt._id).join(',');
        const tempVessels = this.vessels.slice().map((elt) => elt._id).join(',');
        // const tempVessels = this.getFilteredVessels(this.projects);

        forkJoin([
          this.analysisService.getLastAnalysisForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
            .pipe(takeUntil(this.isAnalysisDead$)),
          this.weatherService.getLastForecastsForSelectedFieldsAndVessels(tempProjects, tempVessels, this.resetCache)
            .pipe(takeUntil(this.isWeatherDead$)),
        ]).subscribe((resp) => {
          this.analysis = resp[0].data;
          this.forecasts = resp[1].data;
          this.resetCache = false;
          this.state.canConnect = true;
          this.state.isLoaded = true;
        }, () => {
          this.analysis = [];
          this.forecasts = [];
          this.resetCache = false;
          this.state.canConnect = true;
          this.state.isLoaded = true;
        });

      }
      else {
        this.projects = resp.data;
        this.paginateData = resp.data;
        this.collectionSize = resp.totalRecords;
      }
    });
  }

  onProjectInput(e: any) {
    this.inputProjectValue.next(e.target.value);
  }

  onVesselInput(e: any) {
    this.inputVesselValue.next(e.target.value);
  }

  getFilteredVessels(projectArr) {
    const resultVess = [];
    const vessArr = projectArr.map((element) => {
      return element.vessels;
    });

    for (let i = 0; i < vessArr.length; i++) {
      vessArr[i].map((e1) => {
        resultVess.push(e1.vessel_id);
      });
    }

    const res = [...new Set(resultVess)];
    const tempVessels = res
      .slice()
      .map((elt) => elt)
      .join(',');

    return tempVessels;
  }

  async generateMap(): Promise<void> {
    const that = this;
    this.highcharts = Highcharts;

    const caMapData = require('../../../../assets/maps/world-continents.geo.json');
    let caMap = Highcharts.geojson(caMapData);

    for (const item of caMap) {
      item.drilldown = item.properties.name.toLowerCase().trim().replace(' ', '-');
      item.color = this.colorWorld[item.drilldown];
    }

    this.chartOptions = {
      chart: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        panning: true,
        panKey: 'shift',
        zoomKey: 'ctrl',
        // height: '700px',
        // spacing: [5, 5, 5, 5],

        events: {  // This event is for selections of countries within the world continents on click
          drilldown(e) {
            const chart = this as any;
            const mapData = require(`../../../../assets/maps/${e.point.drilldown}.geo.json`);

            const countriesData = [];
            for (const elt of Highcharts.geojson(mapData)) {
              const searchElt = that.countries.find((country) => country.code.toUpperCase() === elt.properties['iso-a2']);
              if (!searchElt) {
                elt.color = '#f3f3f3';
                elt.showLabel = false;
              } else {
                elt.showLabel = true;
              }
              countriesData.push(elt);
            }

            const options = {
              name: e.point.name,
              data: countriesData,
              dataLabels: {
                style: {
                  color: 'white',
                  fontSize: '15px'
                },
                enabled: true,
                // format: '{point.name}',
                formatter() {
                  if (!this.point.showLabel) {
                    return '';
                  } else {
                    return this.point.name;
                  }
                }
              },
              cursor: 'pointer',
              events: {
                click: (evt) => {
                  // This event is for selections of countries within the world continents on click
                  if (evt.point.showLabel === true && evt.point.properties['iso-a2']) {
                    that.selectedCountry = { iso: evt.point.properties['iso-a2'].toLowerCase(), name: evt.point.properties.name };
                  }

                }
              }
            };
            chart.addSeriesAsDrilldown(e.point, options);
            chart.setTitle(null, { text: e.point.name });

          },
          drillup(e) {
            const chart = this as any;
            that.resetCache = true;
            that.getData();
          }
        }
      },
      exporting: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030'
        }
      },
      title: {
        text: ''
      },
      colorAxis: {
        visible: false
      },
      mapNavigation: {
        enabled: true,
        enableDoubleClickZoomTo: true,
        buttonOptions: {
          verticalAlign: 'top'
        }
      },
      plotOptions: {
        series: {
          dragDrop: {
            draggableX: true,
            draggableY: true
          },
          point: {
            events: {
              click: (function (component) {
                return function (e: any) {
                  let countriesResult = component.countries.filter((elt) => elt.name.includes(this.name));

                  component.analysis = [];
                  component.forecasts = [];
                  component.projectFilter.countries = countriesResult[0]._id;
                  component.projectFilter.PageNumber = 1;
                  component.page = 1;

                  component.projectService.getEnabledProjectsByPaging(component.projectFilter).subscribe((resp) => {

                    component.projects = resp.data;
                    component.paginateData = resp.data;
                    component.collectionSize = resp.totalRecords;

                    if (component.userSharingService.currentUser.favouriteProjects) {
                      component.favoriteProjects = component.projectsAll.slice()
                        .filter((elt) => component.userSharingService.currentUser.favouriteProjects.includes(elt._id));
                    } else {
                      component.favoriteProjects = [];
                    }

                    const tempProjects = component.projectsAll.slice().map((elt) => elt._id).join(',');
                    const tempVessels = component.vessels.slice().map((elt) => elt._id).join(',');
                    // const tempVessels = component.getFilteredVessels(component.projects);

                    forkJoin([
                      component.analysisService.getLastAnalysisForSelectedFieldsAndVessels(tempProjects, tempVessels, component.resetCache)
                        .pipe(takeUntil(component.isAnalysisDead$)),
                      component.weatherService.getLastForecastsForSelectedFieldsAndVessels(tempProjects, tempVessels, component.resetCache)
                        .pipe(takeUntil(component.isWeatherDead$)),
                    ]).subscribe((resp) => {
                      component.analysis = resp[0].data;
                      component.forecasts = resp[1].data;
                      component.resetCache = false;
                      component.state.canConnect = true;
                      component.state.isLoaded = true;
                    }, () => {
                      component.analysis = [];
                      component.forecasts = [];
                      component.resetCache = false;
                      component.state.canConnect = true;
                      component.state.isLoaded = true;
                    });

                  });

                }
              })(this)
            }
          }
        },
        map: {
          states: {
            // hover: {
            //   color: '#00a3e0'
            // }
          }
        }
      },
      series: [
        {
          name: 'World',
          data: caMap,
          color: '#512d6d',
          dataLabels: {
            style: {
              color: '#ffffff',
              fontSize: '15px'
            },
            enabled: true,
            format: '{point.name}',
            events: {
              click: (evt) => { }
            }
          },
          cursor: 'pointer',
          nullInteraction: true,
          point: {
            events: {
              click: (e) => { }
            }
          }
        }
      ],
      tooltip: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
          }
        }]
      },
      drilldown: {
        activeDataLabelStyle: {
          color: 'white',
          textDecoration: ''
        },
        drillUpButton: {
          position: {
            align: 'left',
            x: 0,
            y: 60
          }
        }
      }
    }
  }
}


import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Log } from '@app/shared/models/log';
import { DataTableDirective } from 'angular-datatables';
import { forkJoin, from, Observable, Subject } from 'rxjs';
import { Project } from '@app/shared/models/project';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TitlePageService } from '@app/core/services/title-page.service';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { LogsService } from '@app/core/services/logs.service';
import { ProjectsService } from '@app/core/services/projects.service';
import { Country } from '@app/shared/models/country';
import { CountriesService } from '@app/core/services/countries.service';
import { Vessel } from '@app/shared/models/vessel';
import { VesselsService } from '@app/core/services/vessels.service';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { formatNumber } from '@app/shared/helpers/math';
import { RegionsService } from '@app/core/services/regions.service';
import { Region } from '@app/shared/models/region';
import { Continents } from '@app/shared/enums/continents.enum';
import { Client } from '@app/shared/models/client';
import { ClientsService } from '@app/core/services/clients.service';
import { Product } from '@app/shared/models/product';
import { ProductsService } from '@app/core/services/products.service';
import { User } from '@app/shared/models/user';
import { UsersService } from '@app/core/services/users.service';
import { VesselType } from '@app/shared/models/vessel-type';
import { VesselsTypesService } from '@app/core/services/vessels-types.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {

  title = 'Projects management';

  resetCache = true;
  errorModal = false;
  loading = false;

  dtOptions: any = {};
  vesselsProjectsEdit: any[];
  timezones = [];
  timezonesBuffer = [];
  validateVM: any[] = [];
  validationModal = false;

  projects: Project[];
  countries: Country[];
  vessels: Vessel[];
  regions: Region[];
  clients: Client[];
  products: Product[];
  contacts: User[];
  vesselTypes: VesselType[];
  isDisabledSchedulerStatus: boolean = false;

  vesselsProjects: [string, { productType: string, productName: string, contact: string, hideScheduler: boolean }][];
  project: Project = {
    _id: null, name: '', description: '', latitude: 0, longitude: 0, disabled: false, countries: [],
    marker: './assets/images/vessel_group.svg', timezone: 'Europe/Dublin', vessels: [], region: null, code: '', client_name: null, client: null
  };

  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };
  state = { isLoaded: false, canConnect: null };

  schedulerStatus = [
    { value: 'Hide', label: 'Hide' },
    { value: 'Show', label: 'Show' },
  ]

  selectedPCode: string = "";
  validationMessage: string = "";
  errorMessageModal: string = "";
  input$ = new Subject<string>();

  deleteSuccessRespType: boolean = true;
  deleteSuccesResp: string = "";

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
  private isRegionsDead$ = new Subject();
  private isClientsDead$ = new Subject();
  private isProductsTypeDead$ = new Subject();
  private isContactsDead$ = new Subject();
  private isVesselTypesDead$ = new Subject();

  constructor(
    private modalService: NgbModal,
    private projectsService: ProjectsService,
    private titlePageService: TitlePageService,
    private userSharingService: UserSharingService,
    private countriesService: CountriesService,
    private vesselsService: VesselsService,
    private regionsService: RegionsService,
    private clientsService: ClientsService,
    private productsService: ProductsService,
    private usersService: UsersService,
    private vesselTypesService: VesselsTypesService,
    private logsService: LogsService
  ) {
    this.titlePageService.setTitle(this.title);
  }

  ngOnInit() {
    this.getTimezones();
    const that = this;
    this.dtOptions = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[1, 'desc']],
      deferRender: true,
      ajax: (dataTablesParameters: any, callback) => {
        forkJoin([
          that.countriesService.getCountries(that.resetCache).pipe(takeUntil(this.isCountriesDead$)),
          that.projectsService.getProjects(that.resetCache).pipe(takeUntil(this.isProjectDead$)),
          that.vesselsService.getEnabledVessels(that.resetCache).pipe(takeUntil(this.isVesselsDead$)),
          that.regionsService.getRegions(that.resetCache).pipe(takeUntil(this.isRegionsDead$)),
          that.clientsService.getClients(that.resetCache).pipe(takeUntil(this.isClientsDead$)),
          that.productsService.getProducts(that.resetCache).pipe(takeUntil(this.isProductsTypeDead$)),
          that.usersService.getUsers(that.resetCache).pipe(takeUntil(this.isContactsDead$)),
          that.vesselTypesService.getVesselTypes(that.resetCache).pipe(takeUntil(this.isVesselTypesDead$)),
        ]).subscribe((responses) => {
          that.countries = responses[0].data;
          that.projects = responses[1].data;
          that.vessels = responses[2].data;
          that.regions = responses[3].data;
          that.clients = responses[4].data;
          that.products = responses[5].data;
          that.contacts = responses[6].data;
          that.vesselTypes = responses[7].data;
          that.vesselsProjects = [];
          that.state.canConnect = true;
          that.state.isLoaded = true;
          that.resetCache = false;
          callback({
            data: that.projects
          });
        }, error => {
          that.countries = [];
          that.projects = [];
          that.regions = [];
          that.vessels = [];
          that.clients = [];
          that.products = [];
          that.contacts = [];
          that.vesselTypes = [];
          that.vesselsProjects = [];
          that.state.canConnect = false;
          that.state.isLoaded = true;
          callback({
            data: []
          });
        });
      },
      columns: [{ data: null }, { data: 'name' }, { data: 'code' }, { data: 'client' }, { data: 'latitude' }, { data: 'longitude' },
      { data: 'countries' }, { data: 'region' }, { data: 'disabled' }, { data: 'timezone' }, { data: 'vessels' }],
      columnDefs: [
        {
          orderable: false,
          targets: [0],
          className: 'td-action',
          render: (data, type, full, meta) => {
            return '<div class="btn-group btn-group-sm" role="group">' +
              '<button class="btn btn-outline-dark btn-view btn-sm"><i class="material-icons md-center md-sm">remove_red_eye</i></button>' +
              '<button class="btn btn-outline-info btn-edit btn-sm"><i class="material-icons md-center md-sm">edit</i></button>' +
              '<button class="btn btn-outline-danger btn-delete btn-sm"><i class="material-icons md-center md-sm">delete</i></button>' +
              '</div>';
          }
        },
        {
          targets: [3],
          render: (data, type, full, meta) => {
            if (data) {
              const client = that.getClient(data);
              return (!client) ? '' : `<img src="${client.image}" alt="" height="45"/> ${client.name}`;
            } else {
              return data;
            }
          }
        },
        {
          targets: [4, 5],
          render: (data, type, full, meta) => {
            if (type === 'sort' || type === 'filter') {
              return data;
            } else {
              return formatNumber(data, 3, 4, 4);
            }
          }
        },
        {
          targets: [6],
          render: (data, type, full, meta) => {
            if (!data || data === '') {
              return data;
            } else {
              const fundCountries = (that.countries || []).filter(elt => data.includes(elt._id));
              if (fundCountries !== undefined) {
                let render = '';
                let index = 0;
                for (const c of fundCountries) {
                  render += `<img alt="" src="./assets/images/flags/${c.code}.svg" height="52.94"/>`;
                  if (index % 2 === 0 && index !== fundCountries.length && index > 0) {
                    render += '<br/>';
                  }
                  index++;
                }
                return render;
              }
              return '';
            }
          }
        },
        {
          targets: [7],
          render: (data, type, full, meta) => {
            return that.regionToString(data);
          }
        },
        {
          targets: [8],
          render: (data, type, full, meta) => {
            if (data === null || data === undefined || data === '') {
              return data;
            } else {
              if (data === true) {
                return '<span class="badge badge-pill badge-warning">Disabled</span>';
              } else {
                return '<span class="badge badge-pill badge-success">Enabled</span>';
              }
            }
          }
        },
        {
          targets: [9],
          render: (data, type, full, meta) => {
            return data;
          }
        },
        {
          targets: [10],
          render: (data, type, full, meta) => {
            if (data === null || data === undefined || data === '') {
              return data;
            }
            let render = '';
            // for (const v of Object.keys(data)) {
            //   const fundVessel = that.getVessel(v);
            //   if (fundVessel !== undefined) {
            //     render += `<span><img src="${fundVessel.image}" alt="" width="70" height="20"> ${fundVessel.name}</span><br>`;
            //   }
            // }

            data.map((elt) => {
              const fundVessel = that.getVessel(elt.vessel_id);
              if (fundVessel !== undefined) {
                render += `<span><img src="${fundVessel.image}" alt="" width="70" height="20"> ${fundVessel.name}</span><br>`;
              }
            });
            return render;

          }
        }
      ],
      dom:
        '<"row"<"col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-12"l><"col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-6 text-center"B><"col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-3"f>>' +
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
            this.project = {
              _id: null, name: '', description: '', latitude: 0, longitude: 0, disabled: false, countries: [],
              marker: './assets/images/vessel_group.svg', timezone: 'Europe/Dublin', vessels: [], region: null, code: '',
              client_name: null, client: null
            };

            // this.vesselsProjects = Object.entries(this.project.vessels);
            this.vesselsProjects = this.project.vessels;
            this.errorModal = false;
            this.errorMessageModal = "";
            this.modalService.open(this.modalAdd, { centered: true, size: 'xl', backdrop: 'static', scrollable: true });
          },
          init: (api, node, config) => {
            $(node).removeClass('btn-secondary');
          }
        }
      ],
      rowCallback: (row: Node, data: Project, index: number) => {
        const self = this;
        // Unon first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        const eltView = $('td', row).find('button.btn-view');
        if (eltView) {
          eltView.off('click');
          eltView.on('click', () => {
            that.project = Object.assign({}, data);
            that.vesselsProjects = that.project.vessels;
            that.modalService.open(that.modalView, { centered: true, size: 'xl', backdrop: 'static', scrollable: true });
          });
        }
        const eltEdit = $('td', row).find('button.btn-edit');
        if (eltEdit) {
          eltEdit.off('click');
          eltEdit.on('click', () => {
            that.validationModal = false;
            that.project = Object.assign({}, data);
            that.vesselsProjectsEdit = that.project.vessels;
            that.selectedPCode = that.project.code;
            that.errorModal = false;
            that.errorMessageModal = "";
            that.modalService.open(that.modalEdit, { centered: true, size: 'xl', backdrop: 'static', scrollable: true });
            if(that.project.disabled === true) { this.isDisabledSchedulerStatus = true; } else { this.isDisabledSchedulerStatus = false; }
          });
        }
        const eltDelete = $('td', row).find('button.btn-delete');
        if (eltDelete) {
          eltDelete.off('click');
          eltDelete.on('click', () => {
            that.project = Object.assign({}, data);
            that.vesselsProjects = that.project.vessels;
            that.modalService.open(that.modalDelete, { centered: true, size: 'lg', backdrop: 'static' });
          });
        }
        return row;
      }
    };

    this.socketEvent = this.projectsService.socketEvent;
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
    this.isCountriesDead$.next();
    this.isRegionsDead$.next();
    this.isClientsDead$.next();
    this.isProductsTypeDead$.next();
    this.isContactsDead$.next();
    this.isVesselTypesDead$.next();
  }

  refresh(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  regionToString(regionId: string): string {
    const region = this.regions.find((elt) => elt._id === regionId);
    return (region) ? region.name : 'Unknown';
  }

  getContinent(continent: string): string {
    return Continents[continent] || 'Others';
  }

  getCountry(countryId: string): Country {
    return this.countries.find((elt) => elt._id === countryId);
  }

  getClient(clientId: string): Client {
    return this.clients.find((elt) => elt._id === clientId);
  }

  getVessel(vesselId: string): Vessel {
    return this.vessels.find((elt) => elt._id === vesselId);
  }

  getVesselType(typeId: string): VesselType {
    return this.vesselTypes.find((elt) => elt._id === typeId);
  }

  getProductsForVessel(item: { productType: string, productName: string, contact: string }): any[] {
    const occs = {};
    for (const p of this.products) {
      if (!occs.hasOwnProperty(p._id)) {
        occs[p._id] = { color: p.color, name: p.name, occ: 0 };
      }
      if (item.productType.includes(p._id)) {
        occs[p._id].occ = 1;
      }
    }
    const tab = [];
    for (const o of Object.keys(occs)) {
      tab.push(occs[o]);
    }
    return tab;
  }

  getContact(contactId: string): User {
    return this.contacts.find((elt) => elt._id === contactId);
  }

  addVesselRow() {
    for (let i = 0; i < this.vesselsProjects.length; i++) {
      this.vesselsProjects
    }

    if (this.vesselsProjects.length < this.vessels.length) {
      this.vesselsProjects.push([null, { contact: null, productType: null, productName: null, hideScheduler: false }]);
    }
  }

  addVesselRowEdit() {
    for (let i = 0; i < this.vesselsProjectsEdit.length; i++) {
      this.vesselsProjectsEdit
    }

    if (this.vesselsProjectsEdit.length < this.vessels.length) {
      this.vesselsProjectsEdit.push({ vessel_id: null, Product_Details: { productType: null, productName: null, contact: null, hideScheduler: false } });
    }
  }

  deleteVesselRow(index: number): void {
    this.vesselsProjects.splice(index, 1);
  }

  deleteVesselRowEdit(index: number): void {
    this.vesselsProjectsEdit.splice(index, 1);
  }

  validateProject() {
    this.validateVM = [];
    for (const prop in this.project) {
      if ((Array.isArray(this.project[prop]) && prop.endsWith('ries') && this.project.countries.length <= 0) || (prop !== '_id' && prop !== 'marker' && prop !== 'client_name') && (this.project[prop] === undefined || this.project[prop] === null ||
        this.project[prop] === '')) {
        this.validateVM.push(prop);
      }
    }
    return this.validateVM;
  }

  verifyProject(): [string, boolean] {
    for (const prop in this.project) {
      if ((prop !== '_id' && prop !== 'marker' && prop !== 'client_name') && (this.project[prop] === undefined || this.project[prop] === null ||
        this.project[prop] === '')) {
        return [prop, false];
      }
    }
    return ["noFieldToValidate", true];
  }

  addRow(modal: NgbActiveModal) {
    this.project.vessels = this.vesselsProjects;
    
    // save in db
    if (this.validateProject().length <= 0) {
      // For Project Code Checking
      this.validationModal = false;
      this.project.client_name = this.getClient(this.project.client).name;
      this.projectsService.getProjectCode(null, this.project.code).subscribe((res: any) => {
        if (res.type == "NOT EXISTS" && res.statuscode == 200) {
          this.projectsService.addProject(this.project).pipe(takeUntil(this.isProjectDead$)).subscribe((response) => {
            if (response.status == "WARNING" && response.type == "FAILURE") {

              let result = [];
              this.errorModal = true;
              this.errorMessageModal = "";
              for (let i = 0; i < response.data.length; i++) {
                result = Object.keys(response.data[i].Product_Details).filter((k) => {
                  if (response.data[i].Product_Details[k] === "" || response.data[i].Product_Details[k] === null || response.data[i].Product_Details[k] === undefined) {
                    return k;
                  }
                });

                let vessName = this.vessels.filter((ele) => {
                  if (response.data[i].vessel_id === ele._id) {
                    return ele;
                  }
                });

                result.map((elem) => {
                  // this.errorModal = true;
                  this.errorMessageModal += 'For Row No- ' + (response.data[i].rowNo) + ': Vessel (' + vessName[0].name + ') - ' + elem + ' is Required' + '\n';
                });
              }

            }
            else if (response.status == "WARNING" && response.type == "EXISTS") {
              this.errorModal = true;
              this.errorMessageModal = "";

              for (let i = 0; i < response.data.length; i++) {
                let vessName = this.vessels.filter((elm) => {
                  if (response.data[i].vessel_id === elm._id) {
                    return elm;
                  }
                });

                this.errorMessageModal += 'Duplicate entries of Vessel - ' + vessName[0].name + '\n';
              }
            }
            else {
              const projectName = `${this.project.code} - ${this.getClient(this.project.client).name} ${this.project.name}`;
              this.project = {
                _id: '-1', name: '', description: '', latitude: 0, longitude: 0, disabled: false, countries: [],
                marker: './assets/images/vessel_group.svg', timezone: 'Europe/Dublin', vessels: [], region: null, code: '', client_name: null, client: null
              };
              this.vesselsProjects = [];
              modal.close('Close click');
              const tempLog = Object.assign({}, this.log);
              const user = this.userSharingService.currentUser;
              tempLog.user = (user.firstname + ' ' + user.lastname).trim();
              tempLog.date = Date.now();
              tempLog.severity = 1;
              tempLog.message = `Added the project ${projectName}`;
              this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
            }

          }, (error) => {
            this.errorModal = true;
            this.errorMessageModal = 'An error occurred on the server side.';
          });

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

  transform(value: string): string {
    switch (value) {
      case 'name':
        return this.validationMessage = "Project Name is required";

      case 'description':
        return this.validationMessage = "Description is required";

      case 'region':
        return this.validationMessage = "Region is required";

      case 'code':
        return this.validationMessage = "Project code is required";

      case 'client':
        return this.validationMessage = "Client is required";

      case 'timezone':
        return this.validationMessage = "Timezone is required";

      default:
        return this.validationMessage = "Please fill all the required fields";
    }
  }

  saveEditRow(modal: NgbActiveModal) {
    // save in db
    this.project.vessels = this.vesselsProjectsEdit;
    if (this.validateProject().length <= 0) {
      // For Project Code Checking
      this.project.client_name = this.getClient(this.project.client).name;
      this.projectsService.getProjectCode(this.selectedPCode, this.project.code).subscribe((res: any) => {
        if ((res.type == "NOT EXISTS" || res.type == "SAMECODE") && res.statuscode == 200) {
          
          this.projectsService.updateProject(this.project).pipe(takeUntil(this.isProjectDead$)).subscribe((response) => {
            if (response.status == "WARNING" && response.type == "FAILURE") {
              let result = [];
              this.errorModal = false;
              this.errorMessageModal = "";
              for (let i = 0; i < response.data.length; i++) {
                result = Object.keys(response.data[i].Product_Details).filter((k) => {
                  if (response.data[i].Product_Details[k] === "" || response.data[i].Product_Details[k] === null || response.data[i].Product_Details[k] === undefined) {
                    return k;
                  }
                });

                let vessName = this.vessels.filter((ele) => {
                  if (response.data[i].vessel_id === ele._id) {
                    return ele;
                  }
                });

                result.map((elem) => {
                  this.errorModal = false;
                  this.validationModal = true;
                  this.validateVM.push('For Row No - ' + response.data[i].rowNo + ': Vessel (' + vessName[0].name + ') - ' + elem + ' is Required');
                  // this.errorMessageModal += 'For Row No- ' + (response.data[i].rowNo) + ': Vessel (' + vessName[0].name + ') - ' + elem + ' is Required' + '\n';
                });
              }
            }
            else if (response.status == "WARNING" && response.type == "EXISTS") {
              this.errorModal = false;
              this.errorMessageModal = "";

              for (let i = 0; i < response.data.length; i++) {
                let vessName = this.vessels.filter((elm) => {
                  if (response.data[i].vessel_id === elm._id) {
                    return elm;
                  }
                });
                
                this.validationModal = true;
                this.validateVM.push('Duplicate entries of Vessel - ' + vessName[0].name );
                // this.errorMessageModal += 'Duplicate entries of Vessel - ' + vessName[0].name + '\n';
              }
            }
            else {
              const projectName = `${this.project.code} - ${this.getClient(this.project.client).name} ${this.project.name}`;
              this.project = {
                _id: '-1', name: '', description: '', latitude: 0, longitude: 0, disabled: false, countries: [],
                marker: './assets/images/vessel_group.svg', timezone: 'Europe/Dublin', vessels: [], region: null, code: '', client_name: null, client: null
              };
              this.vesselsProjects = [];
              modal.close('Close click');
              this.selectedPCode = "";
              const tempLog = Object.assign({}, this.log);
              const user = this.userSharingService.currentUser;
              tempLog.user = (user.firstname + ' ' + user.lastname).trim();
              tempLog.date = Date.now();
              tempLog.severity = 1;
              tempLog.message = `Updated the project ${projectName}`;
              this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
            }

          }, (error) => {
            this.errorModal = true;
            this.errorMessageModal = 'An error occurred on the server side.';
          });
        }
        else {
          this.errorModal = true;
          this.errorMessageModal = res.message;
          setInterval(() => {
            this.errorModal = false;
          }, 3000);
        }
      });
    }
    else {
      this.validationModal = true;
    }
  }

  deleteRow(modal: NgbActiveModal) {
    // save in db
    this.project.vessels = this.vesselsProjects;
    if (this.project._id !== undefined || this.project._id !== null || this.project._id !== '') {
      this.projectsService.deleteProject(this.project._id).pipe(takeUntil(this.isProjectDead$)).subscribe((response) => {
        if (response.success === true) {
          const projectName = `${this.project.code} - ${this.getClient(this.project.client).name} ${this.project.name}`;
          this.project = {
            _id: '-1', name: '', description: '', latitude: 0, longitude: 0, disabled: false, countries: [],
            marker: './assets/images/vessel_group.svg', timezone: 'Europe/Dublin', vessels: [], region: null, code: '', client_name: null, client: null
          };
          this.vesselsProjects = [];
          modal.close('Close click');
          const tempLog = Object.assign({}, this.log);
          const user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 2;
          tempLog.message = `Deleted the project ${projectName}`;
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
      this.errorMessageModal = 'No project to delete.';
    }
  }

  public accept(modal: NgbActiveModal) {
    this.modalService.dismissAll(this.modalEdit);
    this.modalService.dismissAll(this.modalAdd);
    this.modalService.dismissAll(this.modalDelete);
    modal.close('Close click');

    this.project = {
      _id: null, name: '', description: '', latitude: 0, longitude: 0, disabled: false, countries: [],
      marker: './assets/images/vessel_group.svg', timezone: 'Europe/Dublin', vessels: [], region: null, code: '', client_name: null, client: null
    };
    this.deleteSuccessRespType = true;
    this.deleteSuccesResp = "";
    this.refresh();
  }

  getCountryFlag(item: Country) {
    if (item.code) {
      return `./assets/images/flags/${item.code.trim().toLowerCase()}.svg`;
    } else {
      return '';
    }
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

  getTimezones(): void {
    const t = moment.tz.names().filter((elt) => elt.toLowerCase().startsWith('africa') ||
      elt.toLowerCase().startsWith('america') || elt.toLowerCase().startsWith('asia') ||
      elt.toLowerCase().startsWith('australia') || elt.toLowerCase().startsWith('europe') ||
      elt.toLowerCase().startsWith('antarctica') || elt.toLowerCase().startsWith('pacific') ||
      elt.toLowerCase().startsWith('atlantic') || elt.toLowerCase().startsWith('indian') ||
      elt.toLowerCase().startsWith('artic')
    );
    this.timezones = t.map((elt) => Object.assign({}, { continent: elt.split('/')[0], value: elt }));
    this.timezonesBuffer = this.timezones.slice(0, 50);
    this.onSearch();
  }

  onScrollToEnd(term: string): void {
    this.fetchMore(term);
  }

  onScroll({ end }): void {
    if (this.loading || this.timezones.length <= this.timezonesBuffer.length) {
      return;
    }

    if (end + 10 >= this.timezonesBuffer.length) {
      this.fetchMore(null);
    }
  }

  onSearch() {
    this.input$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if (term && term.length > 0) {
          return from<any[]>([this.timezones.filter(x => x.value.toLowerCase().includes(term.toLowerCase()))]);
        } else {
          return from<any[]>([this.timezones]);
        }
      })
    )
      .subscribe(data => {
        this.timezonesBuffer = data.slice(0, 50);
      });
  }

  fetchMore(term: string): void {
    const len = this.timezonesBuffer.length;
    let more = [];
    if (term) {
      term = term.toLowerCase();
      more = this.timezones.filter(x => x.value.toLowerCase().includes(term)).slice(len, 50 + len);
    } else {
      more = this.timezones.slice(len, 50 + len);
    }
    this.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.loading = false;
      this.timezonesBuffer = this.timezonesBuffer.concat(more);
    }, 200);
  }

  contactSearchFn(term: string, item: User) {
    term = term.toLowerCase();
    return item.firstname.toLowerCase().includes(term) || item.lastname.toLowerCase().includes(term);
  }

  public decline(modal: NgbActiveModal) {
    modal.close(false);
  }

  hideVesselsOfScheduler(event) {
    console.log(event);
  }
  
  onDisabledProject(event) {
    if (event.target.checked === true) {
      this.isDisabledSchedulerStatus = true;
    } else {
      this.isDisabledSchedulerStatus = false;
    }
  }

}

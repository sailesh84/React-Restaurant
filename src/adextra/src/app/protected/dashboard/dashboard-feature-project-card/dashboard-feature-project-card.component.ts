import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Project } from '@app/shared/models/project';
import { VesselType } from '@app/shared/models/vessel-type';
import { Vessel } from '@app/shared/models/vessel';
import { Settings } from '@app/shared/enums/settings.enums';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '@app/core/services/users.service';
import { takeUntil } from 'rxjs/operators';
import { LogsService } from '@app/core/services/logs.service';
import { Subject } from 'rxjs';
import { Log } from '@app/shared/models/log';
import { Client } from '@app/shared/models/client';
import { Analysis } from '@app/shared/models/analysis';
import { Product } from '@app/shared/models/product';

@Component({
  selector: 'app-dashboard-feature-project-card',
  templateUrl: './dashboard-feature-project-card.component.html',
  styleUrls: ['./dashboard-feature-project-card.component.scss']
})
export class DashboardFeatureProjectCardComponent implements OnInit, OnDestroy, OnChanges {

  @Input() project: Project;
  @Input() vesselsTypes: VesselType[] = [];
  @Input() vessels: Vessel[] = [];
  @Input() clients: Client[] = [];
  @Input() analysis: Analysis[] = [];
  // @Input() analysis: any[] = [];
  @Input() forecasts: any[] = [];
  @Input() products: Product[] = [];
  @Input() searchVesselsText: string = "";
  @Input() isCollapsedPanel: boolean;
  @Input() expandIconItem: string;

  log: Log = { _id: '-1', date: 0, userAgent: '', severity: 0, user: '', sourceIP: '', message: '' };

  isCollapsed: boolean;
  expandIcon: string;
  limitFavoriteProjects: number;

  private isUserDead$ = new Subject();
  private isLogsDead$ = new Subject();

  constructor(
    private userSharingService: UserSharingService,
    private usersService: UsersService,
    private toastrService: ToastrService,
    private logsService: LogsService
  ) { }

  ngOnInit(): void {
    this.limitFavoriteProjects = Settings.FavoriteProjectLimit;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isCollapsed = this.isCollapsedPanel;
    this.expandIcon = this.expandIconItem;
  }

  ngOnDestroy(): void {
    this.isUserDead$.next();
    this.isLogsDead$.next();
  }

  collapsePanel(): void {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.expandIcon = 'expand_more';
    } else {
      this.expandIcon = 'expand_less';
    }
  }

  getBorderLeftColorVesselType(vesselId: string) {
    const vessById = this.vessels.find(
      (e1) => e1._id === vesselId
    )

    const type = this.vesselsTypes.find((t) => t._id.toString() === vessById.type.toString());
    if (type !== undefined) {
      return type.color;
    }
  }

  getVesselName(vesselId: string) {
    const vessById = this.vessels.find(
      (e1) => e1._id === vesselId
    )
    return vessById.name;
  }

  getVesselImage(vesselId: string) {
    const vessById = this.vessels.find(
      (e1) => e1._id === vesselId
    )
    return vessById.image;
  }

  getVesselVirtual(vesselId: string) {
    const vessById = this.vessels.find(
      (e1) => e1._id === vesselId
    )
    return vessById.virtual;
  }

  getClient(id: string): Client {
    return this.clients.find(elt => elt._id === id);
  }

  getAnalysis(projectId: string, vesselId: string): Analysis {
    return (this.analysis || []).find((elt) => elt.project === projectId && elt.vessel === vesselId);
  }

  getForecast(projectId: string, vesselId: string, productTypeId: string, session: string): any {
    return (this.forecasts || []).find((elt) => elt.project === projectId && elt.vessel === vesselId && elt.productTypeId === productTypeId && elt.session === session);
  }

  filterVessel() {
    let filteredVess = this.project.vessels.map((elt) => {
      return elt;
    });
    return filteredVess;
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id
  }

  addOrDeleteToFavouriteProjects(add: boolean) {
    let user = this.userSharingService.currentUser;
    if (add) {
      if (user.favouriteProjects && user.favouriteProjects.length < this.limitFavoriteProjects) {
        user.favouriteProjects.push(this.project._id); //code here

        this.usersService.updatePartiallyUser(user).pipe(takeUntil(this.isUserDead$)).subscribe((response) => {
          const projectName = `${this.project.code} - ${this.getClient(this.project.client).name} ${this.project.name}`;
          this.userSharingService.updateUser(response.data);
          const tempLog = Object.assign({}, this.log);
          user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 1;
          tempLog.message = `Added the project "${projectName}" to his/her favourite project(s)`;
          this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
          this.toastrService.success(
            `Adding project "${projectName}" to favourites successful`,
            'Adding a project to favourites',
            {
              closeButton: true, positionClass: 'toast-top-right', timeOut: 3000
            });
        });
      } else {
        this.toastrService.warning(
          `Warning, favourite projects number reached (Max : ${this.limitFavoriteProjects} project(s))`,
          'Adding a project to favourites',
          {
            closeButton: true, positionClass: 'toast-top-right', timeOut: 3000
          });
      }
    } else {
      const findIndex = (user.favouriteProjects || []).findIndex((elt) => elt === this.project._id); //code here
      if (findIndex >= 0) {
        (user.favouriteProjects || []).splice(findIndex, 1);

        this.usersService.updatePartiallyUser(user).pipe(takeUntil(this.isUserDead$)).subscribe((response) => {
          const projectName = `${this.project.code} - ${this.getClient(this.project.client).name} ${this.project.name}`;
          this.userSharingService.updateUser(response.data);
          const tempLog = Object.assign({}, this.log);
          user = this.userSharingService.currentUser;
          tempLog.user = (user.firstname + ' ' + user.lastname).trim();
          tempLog.date = Date.now();
          tempLog.severity = 1;
          tempLog.message = `Deleted the project "${projectName}" to his/her favourite project(s)`;
          this.logsService.addLog(tempLog).pipe(takeUntil(this.isLogsDead$)).subscribe();
          this.toastrService.success(
            `Deleting project "${projectName}" to favourites successful`,
            'Deleting a project to favourites',
            {
              closeButton: true, positionClass: 'toast-top-right', timeOut: 3000
            });
        });
      }
    }
  }

  isFavourite(): boolean {
    return !!(this.userSharingService.currentUser.favouriteProjects || []).find((elt) => elt === this.project._id);
  }

  getIcon(): string {
    return this.isFavourite() ? 'star' : 'star_border';
  }

  getMessage(): string {
    return `${this.isFavourite() ? 'Removing' : 'Adding'} to favourite project(s)`;
  }

  getLastSession(projectId: string, vesselId: string, productTypeId: string, productName: string): any[] {
    const sessionData = [];
    let prevSession = null;
    const prevForecaster = [];

    for (const a of this.analysis) {
      if (a.productName === undefined || a.productName === ""  || a.productName === null) {
        if (a.project === projectId && a.vessel === vesselId && a.productTypeId === productTypeId) {
          if (!prevSession) {
            prevSession = a.session;
          }
          if (prevSession === a.session && !prevForecaster.includes(a.forecaster)) {
            prevForecaster.push(a.forecaster);
            sessionData.push(a);
          }
        }
      }
      else {
        if (a.project === projectId && a.vessel === vesselId && a.productTypeId === productTypeId && a.productName.trim() === productName.trim()) {
          if (!prevSession) {
            prevSession = a.session;
          }
          if (prevSession === a.session && !prevForecaster.includes(a.forecaster)) {
            prevForecaster.push(a.forecaster);
            sessionData.push(a);
          }
        }
      }
    }
    return sessionData;
  }

  getProduct(productTypeId: string, vesselId: string) {
    let res = this.project.vessels.find((elt) => elt.Product_Details.productType === productTypeId && elt.vessel_id === vesselId);
    let resProd = this.products.find((elt) => elt._id === res.Product_Details.productType);
    return resProd;
  }

  getProductName(productTypeId: string, contact: string, vesselId: string) {
    let res = this.project.vessels.find((elt) => elt.Product_Details.productType === productTypeId && elt.Product_Details.contact === contact && elt.vessel_id === vesselId);
    return res.Product_Details.productName;
  }
}

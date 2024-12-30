import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Project } from '@app/shared/models/project';
import { forkJoin, Subject } from 'rxjs';
import { ClientsService } from '@app/core/services/clients.service';
import { VesselsService } from '@app/core/services/vessels.service';
import { Vessel } from '@app/shared/models/vessel';
import { Client } from '@app/shared/models/client';
import { takeUntil } from 'rxjs/operators';
import { Country } from '@app/shared/models/country';
import { Region } from '@app/shared/models/region';
import { RegionsService } from '@app/core/services/regions.service';
import { CountriesService } from '@app/core/services/countries.service';
import { VesselType } from '@app/shared/models/vessel-type';
import { User } from '@app/shared/models/user';
import { VesselsTypesService } from '@app/core/services/vessels-types.service';
import { UsersService } from '@app/core/services/users.service';
import { icon, latLng, marker, Marker, tileLayer } from 'leaflet';
import { formatNumber } from '@app/shared/helpers/math';
import { ProductsService } from '@app/core/services/products.service';
import { Product } from '@app/shared/models/product';

@Component({
  selector: 'app-project-feature-info',
  templateUrl: './project-feature-info.component.html',
  styleUrls: ['./project-feature-info.component.scss']
})
export class ProjectFeatureInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() project: Project;
  @Input() vesselID = '-1';
  @Input() projectTypeID: '-1';
  @Input() productName: '-1';
  @Input() contactID = '-1';
  @Output() isCurrentForecasterActive = new EventEmitter<boolean>();

  state = { isLoaded: false, canConnect: null };

  private isVesselDead$ = new Subject();
  private isClientDead$ = new Subject();
  private isCountryDead$ = new Subject();
  private isRegionDead$ = new Subject();
  private isVesselTypeDead$ = new Subject();
  private isUserDead$ = new Subject();
  private isProductDead$ = new Subject();

  client: Client;
  vessel: Vessel;
  region: Region;
  contact: User;
  product: Product;
  vesselType: VesselType;
  vesselInfos: any;
  countries: Country[];

  // Leaflet bindings
  zoom = 5;
  center = latLng([55.9412846, -3.275378]);
  options = {
    layers: [tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Open Street Map' })],
    zoom: this.zoom,
    center: this.center
  };
  ready = false;

  constructor(
    private clientsService: ClientsService,
    private vesselService: VesselsService,
    private countriesService: CountriesService,
    private regionService: RegionsService,
    private vesselTypeService: VesselsTypesService,
    private userService: UsersService,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.isCurrentForecasterActive.emit(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getInformation();
  }

  ngOnDestroy(): void {
    this.isClientDead$.next();
    this.isVesselDead$.next();
    this.isRegionDead$.next();
    this.isCountryDead$.next();
    this.isVesselTypeDead$.next();
    this.isUserDead$.next();
    this.isProductDead$.next();
  }

  refresh(): void {
    this.getInformation();
  }

  private getVesselInfos(): { productType: string, productName: string, contact: string } {
    return this.project.vessels.find((elt) => elt.vessel_id === this.vesselID && elt.Product_Details.productType === this.projectTypeID && elt.Product_Details.contact === this.contactID);
  }

  private getInformation(): void {
    forkJoin([
      this.vesselService.getVessel(this.vesselID, true).pipe(takeUntil(this.isVesselDead$)),
      this.clientsService.getClient(this.project.client, true).pipe(takeUntil(this.isClientDead$)),
      this.countriesService.getManyCountries(this.project.countries.join(','), true).pipe(takeUntil(this.isCountryDead$)),
      this.regionService.getRegion(this.project.region, true).pipe(takeUntil(this.isRegionDead$)),
    ]).subscribe((responses) => {
      this.vessel = responses[0].data;
      this.client = responses[1].data;
      this.countries = responses[2].data;
      this.region = responses[3].data;
      this.center = latLng(this.project.latitude, this.project.longitude);
      if (this.vessel) {
        this.vesselInfos = this.getVesselInfos();
        forkJoin([
          this.vesselTypeService.getVesselType(this.vessel.type, true).pipe(takeUntil(this.isVesselTypeDead$)),
          this.userService.getUserById(this.vesselInfos.Product_Details.contact, true).pipe(takeUntil(this.isUserDead$)),
          this.productsService.getProduct(this.vesselInfos.Product_Details.productType, true).pipe(takeUntil(this.isProductDead$)),
        ]).subscribe((resp) => {
          this.vesselType = resp[0].data;
          this.contact = resp[1].data;
          this.product = resp[2].data;
          this.state.canConnect = true;
          this.state.isLoaded = true;
          this.ready = true;
        }, () => {
          this.client = null;
          this.vessel = null;
          this.countries = null;
          this.region = null;
          this.vesselType = null;
          this.product = null;
          this.contact = null;
          this.state.canConnect = false;
          this.state.isLoaded = true;
          this.ready = true;
        });
      } else {
        this.state.canConnect = true;
        this.state.isLoaded = true;
        this.ready = true;
      }
    }, () => {
      this.client = null;
      this.vessel = null;
      this.countries = null;
      this.region = null;
      this.vesselType = null;
      this.product = null;
      this.contact = null;
      this.state.canConnect = false;
      this.state.isLoaded = true;
      this.ready = true;
    });
  }

  getFlag(code: string): string {
    return `/assets/images/flags/${code.trim().toLowerCase()}.svg`;
  }

  getMarker(): Marker {
    return marker(
      [this.project.latitude, this.project.longitude],
      {
        icon: icon({
          iconSize: [120, 52.94],
          iconUrl: this.project.marker,
        }),
        title: this.project.name,
        alt: 'field-marker-' + this.project._id
      }
    ).bindTooltip(
      `<div style="min-width: 80px" class="text-secondary"><span>Latitude :
        ${formatNumber(this.project.latitude, 3, 4, 4)}</span><br>
        <span>Longitude : ${formatNumber(this.project.longitude, 3, 4, 4)}</span>
        </div>`, { permanent: false, direction: 'left', offset: [-60, 0] });
  }

  trackByFn(index: number, item: any): any {
    return index;
  }
}

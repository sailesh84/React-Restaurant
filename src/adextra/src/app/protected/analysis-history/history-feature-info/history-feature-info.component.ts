import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Project } from '@app/shared/models/project';
import { forkJoin, Subject } from 'rxjs';
import { ClientsService } from '@app/core/services/clients.service';
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
import { Product } from '@app/shared/models/product';
import { ProductsService } from '@app/core/services/products.service';

@Component({
  selector: 'app-history-feature-info',
  templateUrl: './history-feature-info.component.html',
  styleUrls: ['./history-feature-info.component.scss']
})
export class HistoryFeatureInfoComponent implements OnInit, OnChanges, OnDestroy {

  @Input() project: Project;
  @Input() vessel: Vessel;
  @Input() productType: any;
  @Input() productName: any;
  @Input() contactID: any;

  state = { isLoaded: false, canConnect: null };

  private isClientDead$ = new Subject();
  private isCountryDead$ = new Subject();
  private isRegionDead$ = new Subject();
  private isVesselTypeDead$ = new Subject();
  private isUserDead$ = new Subject();
  private isProductDead$ = new Subject();

  client: Client;
  countries: Country[];
  region: Region;
  vesselType: VesselType;
  contact: User;
  product: Product;
  vesselInfos: any;

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
    private countryService: CountriesService,
    private regionService: RegionsService,
    private vesselTypeService: VesselsTypesService,
    private userService: UsersService,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.project && this.vessel && this.productType) {
      this.vesselInfos = this.getVesselInfos();
      this.getInformation();
    }
  }

  ngOnDestroy(): void {
    this.isClientDead$.next();
    this.isRegionDead$.next();
    this.isCountryDead$.next();
    this.isVesselTypeDead$.next();
    this.isUserDead$.next();
    this.isProductDead$.next();
  }

  refresh(): void {
    this.vesselInfos = this.getVesselInfos();
    this.getInformation();
  }

  private getVesselInfos(): { productType: string, productName: string, contact: string } {
    return this.project.vessels.find((elt) => elt.vessel_id === this.vessel._id && elt.Product_Details.productType === this.productType._id && elt.Product_Details.contact === this.contactID);
  }

  private getInformation(): void {
    forkJoin([
      this.clientsService.getClient(this.project.client, true).pipe(takeUntil(this.isClientDead$)),
      this.countryService.getManyCountries(this.project.countries.join(','), true).pipe(takeUntil(this.isCountryDead$)),
      this.regionService.getRegion(this.project.region, true).pipe(takeUntil(this.isRegionDead$)),
      this.vesselTypeService.getVesselType(this.vessel.type, true).pipe(takeUntil(this.isVesselTypeDead$)),
      this.userService.getUserById(this.vesselInfos.Product_Details.contact, true).pipe(takeUntil(this.isUserDead$)),
      this.productsService.getProduct(this.vesselInfos.Product_Details.productType, true).pipe(takeUntil(this.isProductDead$)),
    ]).subscribe((responses) => {
      this.client = responses[0].data;
      this.countries = responses[1].data;
      this.region = responses[2].data;
      this.vesselType = responses[3].data;
      this.contact = responses[4].data;
      // this.product = responses[5].data;
      this.product = this.productType;
      this.center = latLng(this.project.latitude, this.project.longitude);
      this.state.canConnect = true;
      this.state.isLoaded = true;
      this.ready = true;
    }, () => {
      this.client = null;
      this.countries = null;
      this.region = null;
      this.vesselType = null;
      this.contact = null;
      this.product = null;
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

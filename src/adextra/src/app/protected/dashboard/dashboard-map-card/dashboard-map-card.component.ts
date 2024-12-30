import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Project } from '@app/shared/models/project';
import { icon, latLng, Marker, marker, tileLayer } from 'leaflet';
import { VesselType } from '@app/shared/models/vessel-type';
import { Vessel } from '@app/shared/models/vessel';
import { Country } from '@app/shared/models/country';
import { Region } from '@app/shared/models/region';
@Component({
  selector: 'app-dashboard-map-card',
  templateUrl: './dashboard-map-card.component.html',
  styleUrls: ['./dashboard-map-card.component.scss']
})
export class DashboardMapCardComponent implements OnInit, OnChanges {

  @Input() markers: Project[];
  @Input() vesselsTypes: VesselType[];
  @Input() vessels = [];
  @Input() countries: Country[] = [];
  @Input() region: Region = null;

  // Leaflet bindings
  zoom = 2;
  // center = latLng([55.9412846, -3.275378]);
  center = latLng(0, 0);
  options = {
    layers: [tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Open Street Map' })],
    zoom: this.zoom,
    center: this.center
  };
  ready = false;

  constructor() { }

  ngOnInit(): void {
    // if (this.markers.length > 0) {
    //   let centerX = 0;
    //   let centerY = 0;
    //   for (const f of this.markers) {
    //     centerX += f.latitude;
    //     centerY += f.longitude;
    //   }
    //   // this.center = latLng([ centerX / this.markers.length, centerY / this.markers.length ]);
    //   this.center = latLng(56.940788, 2.994066);
    // }
    this.ready = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.region) {
      this.center = latLng(this.region.latitude, this.region.longitude);
    }
  }

  getCountsType(field: Project): string {
    
    const types = this.vesselsTypes.filter((elt) => elt.virtual !== true);
    const sizeElt = 100 / types.length;

    let selectedVessProj = field.vessels.map((elt) => elt.vessel_id);

    let filteredVessMain = [];
    for (let i = 0; i < selectedVessProj.length; i++) {
      for (let j = 0; j < this.vessels.length; j++) {
        if (this.vessels[j]._id === selectedVessProj[i]) {
          filteredVessMain.push(this.vessels[j]);
        }
      }
    }

    let filteredVessTypeCount = [];
    let key = 'type';

    filteredVessMain.forEach((x) => {
      if (
        filteredVessTypeCount.some((val) => {
          return val[key] == x[key];
        })
      ) {
        filteredVessTypeCount.forEach((k) => {
          if (k[key] === x[key]) {
            k['count']++;
          }
        });
      } else {
        let a = {};
        a[key] = x[key];
        a['count'] = 1;
        filteredVessTypeCount.push(a);
      }
    });

    let filteredVessType = [];
    for (let i = 0; i < filteredVessTypeCount.length; i++) {
      for (let j = 0; j < types.length; j++) {
        if (filteredVessTypeCount[i].type === types[j]._id) {
          filteredVessType.push({
            count: filteredVessTypeCount[i].count,
            color: types[j].color,
            name: types[j].name,
            type_id: filteredVessTypeCount[i].type,
          });
        }
      }
    }

    let filteredVessTypeNonMatch = types.filter(
      (o1) => !filteredVessType.some((o2) => o1._id === o2.type_id)
    );

    for (let k = 0; k < filteredVessTypeNonMatch.length; k++) {
      filteredVessType.push({
        count: 0,
        color: filteredVessTypeNonMatch[k].color,
        name: filteredVessTypeNonMatch[k].name,
        type_id: filteredVessTypeNonMatch[k]._id,
      });
    }

    let content = '';
    for (const item of filteredVessType) {
      content += '<div class="progress-bar" role="progressbar" style="width:' + sizeElt + '%; background-color: ' + item.color + ';" ' +
        'aria-valuenow="' + sizeElt + '" aria-valuemin="0" aria-valuemax="100" title="' + item.name + '">' + item.count + '</div>';
    }

    return content;
  }

  getMarker(field: Project): Marker {
    return marker(
      [field.latitude, field.longitude],
      {
        icon: icon({
          iconSize: [120, 52.94],
          iconUrl: field.marker,
        }),
        title: field.name,
        alt: 'field-marker-' + field._id
      }
    ).bindTooltip(
      `<div style="min-width: 80px"><div class="mb-1">${this.getFlagCountries(field)}<span>
       ${field.name}</span></div><div class="progress" style="height: 15px; min-width: 100%">${this.getCountsType(field)}</div></div>`,
      { permanent: true, direction: 'left', offset: [-60, 0] });
  }

  getVessel(id: string) {
    return this.vessels.find(elt => elt._id === id);
  }

  getFlagCountries(field) {
    const fundCountries = this.countries.filter(elt => field.countries.includes(elt._id));
    if (fundCountries !== undefined) {
      let render = '';
      for (const f of fundCountries) {
        render += `<img src="${`./assets/images/flags/${f.code}.svg`}" alt="" height="24" width="auto">`;
      }
      return render;
    } else {
      return '';
    }
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id
  }
}

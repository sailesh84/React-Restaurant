import {Component, Input, OnInit} from '@angular/core';
import {divIcon, latLng, Marker, marker, tileLayer} from 'leaflet';
import {formatNumber} from '@app/shared/helpers/math';

@Component({
  selector: 'app-map-location-logs',
  templateUrl: './map-location-logs.component.html',
  styleUrls: ['./map-location-logs.component.scss']
})
export class MapLocationLogsComponent implements OnInit {

  @Input() locations: {ip: string, latitude: number, longitude: number, countConnection: number}[] = [];

  // Leaflet bindings
  zoom = 4;
  center = latLng([ 55.9412846, -3.275378 ]);
  options = {
    layers: [ tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Open Street Map' }) ],
    zoom: this.zoom,
    center: this.center
  };
  ready = false;

  constructor() {}

  ngOnInit() {
    if (this.locations.length > 0) {
      let centerX = 0;
      let centerY = 0;
      for (const f of this.locations) {
        centerX += f.latitude;
        centerY += f.longitude;
      }
      this.center = latLng([ centerX / this.locations.length, centerY / this.locations.length ]);
    }
    this.ready = true;
  }

  getMarker(location): Marker {
    return marker(
      [location.latitude, location.longitude],
      {
        icon: divIcon({
          html: '<i class="material-icons md-48 md-center text-secondary">business</i>',
          iconSize: [ 48, 48 ]
        }),
        title: location.ip,
        alt: 'field-marker-' + location.ip
      }
    ).bindTooltip(
      `<div style="width: 120px"><table><tbody>
       <tr class="text-secondary"><td class="text-left"><i class="material-icons md-center">dns</i></td>
       <td class="text-left">${location.ip}</td></tr><tr class="text-secondary"><td class="text-left">
       <i class="material-icons md-center">language</i></td><td class="text-left">Lat : ${formatNumber(
         location.latitude, 3, 4, 4)}</td></tr><tr class="text-secondary">
       <td class="text-left"><i class="material-icons md-center">language</i></td><td class="text-left">Lon : ${formatNumber(
         location.longitude, 3, 4, 4)}
       </td></tr><tr class="text-secondary"><td class="text-left"><i class="material-icons md-center">desktop_windows</i></td
       ><td class="text-left">Connection(s) : ${location.countConnection}</td></tr></tbody></table></div>`,
      {permanent: true, direction: 'top', offset: [0, -22]});
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

}

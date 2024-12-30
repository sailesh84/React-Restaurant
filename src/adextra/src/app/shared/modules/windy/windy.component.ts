import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

/**
 * This component create a Windy interactive map.
 */
@Component({
  selector: 'app-windy',
  templateUrl: './windy.component.html',
  styleUrls: ['./windy.component.scss']
})
export class WindyComponent implements OnInit, OnChanges {
  /**
   * Latitude of map center
   */
  @Input() latitude = 0;
  /**
   * Longitude of map center
   */
  @Input() longitude = 0;
  /**
   * Zoom of the map
   */
  @Input() zoom = 8;
  /**
   * Width of the map
   */
  @Input() width = '100%';
  /**
   * Height of the map
   */
  @Input() height = '500';
  /**
   * Unit system to display
   */
  @Input() unitSystem = '0';

  @ViewChild('embedElement', { static: true }) embedElement: ElementRef;

  /**
   * The default url for calling Windy.
   */
  private defaultUrl = 'https://embed.windy.com/embed2.html';
  /**
   * The secured url for calling Windy.
   */
  public mapUrl;

  /**
   * Constructor
   * The parameter `sanitizer` represents the sanitizer that allows to make the call url of Windy secured.
   */
  constructor(private sanitizer: DomSanitizer) { }

  /**
   * This method called during the first loading of the component
   */
  ngOnInit() {
    this.updateMapUrl();
  }

  /**
   * This method called if there are a change on the component property.
   * The parameter `changes` represents the component changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.unitSystem && !changes.unitSystem.firstChange) {
      this.updateMapUrl();
    }
  }

  /**
   * This method refresh the call url of Windy.
   */
  updateMapUrl(): void {
    const url = this.defaultUrl + '?lat=' + this.latitude + '&lon=' + this.longitude + '&zoom=' + this.zoom + '&level=' +
      'surface&overlay=pressure&menu=&message=true&marker=&calendar=&pressure=true&type=map&location=coordinates&detail=&detailLat=' +
      this.latitude + '&detailLon=' + this.longitude + '&metricWind=' + ((this.unitSystem === '0') ? 'm%2Fs' : 'kt') + '&metricTemp=' +
      ((this.unitSystem === '0') ? '%C2%B0C' : '%C2%B0F') + '&radarRange=-1';
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

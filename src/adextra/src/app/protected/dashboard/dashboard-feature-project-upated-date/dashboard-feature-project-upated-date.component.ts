import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-feature-project-upated-date',
  templateUrl: './dashboard-feature-project-upated-date.component.html',
  styleUrls: ['./dashboard-feature-project-upated-date.component.scss']
})
export class DashboardFeatureProjectUpatedDateComponent implements OnInit {
  @Input() forecast: any;
  @Input() timezone: any;
  forecastUpdate: string;

  constructor() { }

  ngOnInit() {
  }

}

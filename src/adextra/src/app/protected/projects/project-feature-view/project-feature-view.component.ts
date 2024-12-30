import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Project } from '@app/shared/models/project';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';

// For highcharts, load moment in global
(window as any).moment = moment;
momentTZ();

@Component({
  selector: 'app-project-feature-view',
  templateUrl: './project-feature-view.component.html',
  styleUrls: ['./project-feature-view.component.scss']
})
export class ProjectFeatureViewComponent implements OnInit, OnChanges {

  @Input() project: Project;
  @Input() vesselID = '-1';
  @Input() projectTypeID = '-1';
  @Input() productName = '-1';
  @Input() contactID = '-1';
  @Input() schedulerID = '-1';
  @Input() schedulerCurrent: boolean;
  @Input() schedulerCurrentData: string;
  @Input() session: string;
  @Input() forecaster: string;
  @Input() isAlphaFactor: boolean;
  @Input() isFatigue: boolean;
  @Output() notifyStatusToProjectView = new EventEmitter();
  @Output() notifyStatusToProjectViewFromSummary = new EventEmitter();
  @Output() notifyStatusToProjectViewFromAnalysis= new EventEmitter();
  @Output() notifyStatusToProjectViewFromWF= new EventEmitter();
  @Output() notifyStatusToProjectViewFromWI= new EventEmitter();
  @Output() notifyStatusToProjectViewFromInformation= new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.project && this.project.timezone) {
      // overrides global time config for Highcharts
      Highcharts.setOptions({
        time: {
          timezone: this.project.timezone
        },
      });
      // add custom format : zone hour offset format
      Highcharts.dateFormats.Z = (timestamp) => {
        return `GMT ${momentTZ(timestamp).tz(this.project.timezone).format('Z')}`;
      };
    }
  }

  checkCurrentForecasterStatus(event: any) {
    this.notifyStatusToProjectView.emit(event);
  }

  checkCurrentForecasterStatusFromSummary(event: any) {
    this.notifyStatusToProjectViewFromSummary.emit(event);
  }

  checkCurrentForecasterStatusFromAnalysis(event: any) {
    this.notifyStatusToProjectViewFromAnalysis.emit(event);
  }
  
  checkCurrentForecasterStatusFromWF(event: any) {
    this.notifyStatusToProjectViewFromWF.emit(event);
  }
  
  checkCurrentForecasterStatusFromWI(event: any) {
    this.notifyStatusToProjectViewFromWI.emit(event);
  }
  
  checkCurrentForecasterStatusFromInformation(event: any) {
    this.notifyStatusToProjectViewFromInformation.emit(event);
  }
}

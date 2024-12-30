import {Component, Input, OnInit} from '@angular/core';
import {Scheduler} from '@app/shared/models/scheduler';

@Component({
  selector: 'app-scheduler-feature-view',
  templateUrl: './scheduler-feature-view.component.html',
  styleUrls: ['./scheduler-feature-view.component.scss']
})
export class SchedulerFeatureViewComponent implements OnInit {
  @Input() scheduler: Scheduler;
  @Input() timezone: string;

  constructor() { }

  ngOnInit() {
  }

}

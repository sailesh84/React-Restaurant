import {Component, Input, OnInit} from '@angular/core';
import {Scheduler} from '@app/shared/models/scheduler';

@Component({
  selector: 'app-scheduler-feature-table',
  templateUrl: './scheduler-feature-table.component.html',
  styleUrls: ['./scheduler-feature-table.component.scss']
})
export class SchedulerFeatureTableComponent implements OnInit {
  @Input() scheduler: Scheduler;

  constructor() { }

  ngOnInit() {
  }

  hasTableToShow(): boolean {
    if (!this.scheduler || !this.scheduler._id || !this.scheduler.alphaFactor) {
      return false;
    } else {
      let noNull = true;
      for (const c of this.scheduler.alphaFactorTable.cols) {
        if (!c) {
          noNull = false;
          break;
        }
      }
      for (const r of this.scheduler.alphaFactorTable.rows) {
        if (!r.value) {
          noNull = false;
          break;
        }
      }
      return noNull;
    }
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

}

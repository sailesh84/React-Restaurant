import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Analysis} from '@app/shared/models/analysis';
import {Project} from '@app/shared/models/project';
import {Explanation} from '@app/shared/models/explanation';
import {Vessel} from '@app/shared/models/vessel';


@Component({
  selector: 'app-history-feature-view',
  templateUrl: './history-feature-view.component.html',
  styleUrls: ['./history-feature-view.component.scss']
})
export class HistoryFeatureViewComponent implements OnInit {
  @Input() analysis: Analysis;
  @Input() forecast: any;
  @Input() forecaster: any;
  @Input() session: any;
  @Input() explanation: Explanation;
  @Input() project: Project;
  @Input() vessel: Vessel;
  @Input() productType: any;
  @Input() productName: any;
  @Input() contactID: any;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

}

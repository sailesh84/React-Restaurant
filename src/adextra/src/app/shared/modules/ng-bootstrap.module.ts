import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbAlertModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbTabsetModule,
  NgbTimepickerModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';

/**
 * Module used for configure the use of Bootstrap with Angular.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbTabsetModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgbAlertModule,
    NgbTimepickerModule
  ],
  exports: [
    NgbDropdownModule,
    NgbTabsetModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgbAlertModule,
    NgbTimepickerModule
  ]
})
export class NgBootstrapModule { }

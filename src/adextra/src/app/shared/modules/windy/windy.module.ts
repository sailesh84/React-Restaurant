import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindyComponent } from './windy.component';

/**
 * Module used for configure the use of Windy with Angular.
 */
@NgModule({
  declarations: [WindyComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    WindyComponent
  ]
})
export class WindyModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';

/**
 * Module used for configure the use of Leaflet with Angular.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LeafletModule.forRoot()
  ],
  exports: [
    LeafletModule
  ]
})
export class NgLeafletModule { }

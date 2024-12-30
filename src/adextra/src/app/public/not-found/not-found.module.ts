import { NgModule } from '@angular/core';
import {SharedModule} from '@app/shared';
import { NotFoundComponent } from './not-found/not-found.component';
import {NotFoundRoutingModule} from './not-found-routing.module';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    SharedModule,
    NotFoundRoutingModule,
  ]
})
export class NotFoundModule { }

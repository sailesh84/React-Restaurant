import { NgModule } from '@angular/core';
import {SharedModule} from '@app/shared';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileFeatureComponent } from './profile-feature/profile-feature.component';
import { ProfileFeatureCardComponent } from './profile-feature-card/profile-feature-card.component';

@NgModule({
  declarations: [ProfileComponent, ProfileFeatureComponent, ProfileFeatureCardComponent],
  imports: [
    SharedModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }

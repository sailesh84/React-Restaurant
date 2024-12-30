import { NgModule } from '@angular/core';

import { AdminUsersRoutingModule } from './admin-users-routing.module';
import { UsersComponent } from './users/users.component';
import {SharedModule} from '@app/shared';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    SharedModule,
    AdminUsersRoutingModule
  ]
})
export class AdminUsersModule { }

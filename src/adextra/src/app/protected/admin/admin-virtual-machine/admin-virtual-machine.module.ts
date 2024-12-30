import { NgModule } from '@angular/core';
import { AdminVirtualMachineRoutingModule } from './admin-virtual-machine.routing.module';
import { VirtualMachineComponent } from "@app/protected/admin/admin-virtual-machine/virtual-machine/virtual-machine.component";
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    VirtualMachineComponent
  ],
  imports: [
    SharedModule,
    AdminVirtualMachineRoutingModule
  ]
})
export class AdminVirtualMachineModule { }

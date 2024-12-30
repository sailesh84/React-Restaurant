import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { VirtualMachineComponent } from "@app/protected/admin/admin-virtual-machine/virtual-machine/virtual-machine.component";

const routes: Routes = [
    { path: '', component: VirtualMachineComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminVirtualMachineRoutingModule { }
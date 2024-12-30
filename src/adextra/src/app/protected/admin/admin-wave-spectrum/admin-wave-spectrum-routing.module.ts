import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebSpectrumComponent } from '@app/protected/admin/admin-wave-spectrum/wave-spectrum/wave-spectrum.component';

const routes: Routes = [
  { path: '', component: WebSpectrumComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminWebSpectrumRoutingModule { }

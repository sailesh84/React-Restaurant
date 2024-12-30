import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExplanationsComponent} from '@app/protected/admin/admin-explanations/explanations/explanations.component';

const routes: Routes = [
  { path: '', component: ExplanationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminExplanationsRoutingModule { }

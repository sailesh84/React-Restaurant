import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProjectsComponent} from '@app/protected/admin/admin-projects/projects/projects.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminProjectsRoutingModule { }

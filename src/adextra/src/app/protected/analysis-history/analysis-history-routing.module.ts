import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HistoryComponent} from '@app/protected/analysis-history/history/history.component';


const routes: Routes = [
  { path: '', component: HistoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisHistoryRoutingModule { }

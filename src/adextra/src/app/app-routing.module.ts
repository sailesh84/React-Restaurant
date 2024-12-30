import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {AuthenticationGuard} from './core/guards/authentication.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule),
    canActivate: [AuthenticationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

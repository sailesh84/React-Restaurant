import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProtectedComponent } from './protected.component';
import { AccessGuard } from '@app/core/guards/access.guard';

const routes: Routes = [
  {
    path: '',
    component: ProtectedComponent,
    children: [
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'prefix'
      },
      {
        path: 'access-denied', loadChildren: () => import('./access-denied/access-denied.module').then(m => m.AccessDeniedModule)
      },
      {
        path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'requests', loadChildren: () => import('./requests/requests.module').then(m => m.RequestsModule)
      },
      {
        path: 'scheduler',
        loadChildren: () => import('./scheduler/scheduler.module').then(m => m.SchedulerModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'scheduler-logs',
        loadChildren: () => import('./scheduler-logs/scheduler-logs.module').then(m => m.SchedulerLogsModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'analysis-history',
        loadChildren: () => import('./analysis-history/analysis-history.module').then(m => m.AnalysisHistoryModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'weather', loadChildren: () => import('./weather/weather.module').then(m => m.WeatherModule)
      },
      {
        path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
      },
      // {
      //   path: 'download-center',
      //   loadChildren: () => import('./download-center/download-center.module').then(m => m.DownloadCenterModule)
      // },
      {
        path: 'admin-panel',
        loadChildren: () => import('./admin/admin-panel/admin-panel.module').then(m => m.AdminPanelModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-applications-accesses',
        loadChildren: () => import('./admin/admin-applications-accesses/admin-applications-accesses.module')
          .then(m => m.AdminApplicationsAccessesModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-clients',
        loadChildren: () => import('./admin/admin-clients/admin-clients.module').then(m => m.AdminClientsModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-countries',
        loadChildren: () => import('./admin/admin-countries/admin-countries.module').then(m => m.AdminCountriesModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-explanations',
        loadChildren: () => import('./admin/admin-explanations/admin-explanations.module').then(m => m.AdminExplanationsModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-forecasters',
        loadChildren: () => import('./admin/admin-forecasters/admin-forecasters.module').then(m => m.AdminForecastersModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-current-wave',
        loadChildren: () => import('./admin/admin-current-wave/admin-current-wave.module').then(m => m.AdminCurrentWaveModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-logs',
        loadChildren: () => import('./admin/admin-logs/admin-logs.module').then(m => m.AdminLogsModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-products',
        loadChildren: () => import('./admin/admin-products/admin-products.module').then(m => m.AdminProductsModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-projects',
        loadChildren: () => import('./admin/admin-projects/admin-projects.module').then(m => m.AdminProjectsModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-regions',
        loadChildren: () => import('./admin/admin-regions/admin-regions.module').then(m => m.AdminRegionsModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-requests',
        loadChildren: () => import('./admin/admin-requests/admin-requests.module').then(m => m.AdminRequestsModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-users',
        loadChildren: () => import('./admin/admin-users/admin-users.module').then(m => m.AdminUsersModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-vessels',
        loadChildren: () => import('./admin/admin-vessels/admin-vessels.module').then(m => m.AdminVesselsModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-vessels-types',
        loadChildren: () => import('./admin/admin-vessels-types/admin-vessels-types.module').then(m => m.AdminVesselsTypesModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-virtual-machine',
        loadChildren: () => import('./admin/admin-virtual-machine/admin-virtual-machine.module').then(m => m.AdminVirtualMachineModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-alpha-factor',
        loadChildren: () => import('./admin/admin-alpha-factor/admin-alpha-factor.module').then(m => m.AdminAlphaFactorModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'admin-wave-spectrum',
        loadChildren: () => import('./admin/admin-wave-spectrum/admin-wave-spectrum.module').then(m => m.AdminWebSpectrumModule),
        canActivate: [AccessGuard]
      },
      {
        path: 'not-found',
        loadChildren: () => import('../public/not-found/not-found.module').then(m => m.NotFoundModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }

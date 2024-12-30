import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgBootstrapModule } from './modules/ng-bootstrap.module';
import {FooterComponent} from './components/footer/footer.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { RisksProgressbarDirective } from './directives/risks-progressbar.directive';
import {HighchartsChartModule} from 'highcharts-angular';
import { WindyModule } from './modules/windy/windy.module';
import { NgLeafletModule } from './modules/ng-leaflet.module';
import { DataTablesModule } from 'angular-datatables';
import {ColorPickerModule} from 'ngx-color-picker';
import { LoaderComponent } from './components/loader/loader.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {ToastrModule} from 'ngx-toastr';
import { NgSocketsModule } from './modules/ng-sockets.module';
import {InternationalPhoneNumberModule} from 'ngx-international-phone-number';
import { UploadComponent } from './components/upload/upload.component';
import { NotificationsCenterComponent } from './components/notifications-center/notifications-center.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import { MomentDatePipe } from './pipes/moment-date.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { DashboardFeatureProjectProductComponent } from '@app/protected/dashboard/dashboard-feature-project-product/dashboard-feature-project-product.component';
import { DashboardFeatureProjectUpatedDateComponent } from '@app/protected/dashboard/dashboard-feature-project-upated-date/dashboard-feature-project-upated-date.component';
import { DashboardFeatureProjectProgressbarComponent } from '@app/protected/dashboard/dashboard-feature-project-progressbar/dashboard-feature-project-progressbar.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { PaginationPipe } from './pipes/pagination.pipe';

/**
 * The shared module.
 * This module is used for the recurrent imports.
 */
@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    FeedbackComponent,
    RisksProgressbarDirective,
    LoaderComponent,
    UploadComponent,
    NotificationsCenterComponent,
    DashboardFeatureProjectProductComponent,
    DashboardFeatureProjectUpatedDateComponent,
    DashboardFeatureProjectProgressbarComponent,
    MomentDatePipe,
    FilterPipe,
    PaginationPipe,
  ],
  imports: [
    CommonModule,
    NgBootstrapModule,
    RouterModule,
    FormsModule,
    HighchartsChartModule,
    WindyModule,
    NgLeafletModule,
    DataTablesModule,
    ColorPickerModule,
    CKEditorModule,
    ToastrModule.forRoot({preventDuplicates: true}),
    NgSocketsModule,
    InternationalPhoneNumberModule,
    NgSelectModule,
    NgbModule,
    PdfViewerModule,
  ],
  exports: [
    CommonModule,
    NgBootstrapModule,
    FormsModule,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    FeedbackComponent,
    RisksProgressbarDirective,
    HighchartsChartModule,
    WindyModule,
    NgLeafletModule,
    DataTablesModule,
    ColorPickerModule,
    LoaderComponent,
    CKEditorModule,
    ToastrModule,
    NgSocketsModule,
    InternationalPhoneNumberModule,
    UploadComponent,
    NotificationsCenterComponent,
    DashboardFeatureProjectProductComponent,
    DashboardFeatureProjectUpatedDateComponent,
    DashboardFeatureProjectProgressbarComponent,
    NgSelectModule,
    NgbModule,
    PdfViewerModule,
    MomentDatePipe,
    PaginationPipe,
    FilterPipe
  ]
})
export class SharedModule { }

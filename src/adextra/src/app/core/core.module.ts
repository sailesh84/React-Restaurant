import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicModule } from '../public';
import { ProtectedModule } from '../protected';
import {NgbDateAdapter, NgbDateNativeUTCAdapter} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {HTTP_INTERCEPTOR_PROVIDERS} from './interceptors';
import {GUARD_PROVIDERS} from './guards';
import {SERVICE_PROVIDERS} from './services';
import {DATE_ADAPTERS} from '@app/core/adapters';
import {DATE_FORMATTERS} from '@app/core/formatters';

/**
 * The core module.
 * This module work in singleton pattern, that is to say it loads in unique instance.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    PublicModule,
    ProtectedModule
  ],
  providers: [
    // custom services

    HTTP_INTERCEPTOR_PROVIDERS,

    // { provide: NgbDateAdapter, useClass: NgbDateNativeUTCAdapter },

    DATE_ADAPTERS,
    DATE_FORMATTERS,

    GUARD_PROVIDERS,

    ToastrService,

    SERVICE_PROVIDERS
  ]
})
export class CoreModule {
  /**
   * Make sure CoreModule is imported only by one NgModule the AppModule.
   * @Optional {Annotation} It applied on a constructor parameter and allows to indicate that a dependency is optional. It is the null
   * value that injected if there no supplied dependency.
   * @SkipSelf {Annotation} Like above, it applied on a constructor parameter. This role is to indicate at Angular dependency injection
   * mechanism that the resolution of this dependency starts from the parent injector.
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded');
    }
  }
}

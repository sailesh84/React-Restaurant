import { NgModule } from '@angular/core';
import {SharedModule} from '@app/shared';

import { AdminProductsRoutingModule } from './admin-products-routing.module';
import { ProductsComponent } from './products/products.component';


@NgModule({
  declarations: [ProductsComponent],
  imports: [
    SharedModule,
    AdminProductsRoutingModule
  ]
})
export class AdminProductsModule { }

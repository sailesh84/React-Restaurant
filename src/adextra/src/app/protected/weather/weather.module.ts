import { NgModule } from '@angular/core';
import { WeatherComponent } from './weather/weather.component';
import {SharedModule} from '@app/shared';
import {WeatherRoutingModule} from './weather-routing.module';

@NgModule({
  declarations: [WeatherComponent],
  imports: [
    SharedModule,
    WeatherRoutingModule
  ]
})
export class WeatherModule { }

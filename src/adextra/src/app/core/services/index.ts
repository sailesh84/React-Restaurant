import {AnalysisService} from './analysis.service';
import {AuthenticationService} from './authentication.service';
import {CacheService} from './cache.service';
import {ErrorService} from './error.service';
import {EventsService} from './events.service';
import {ExplanationsService} from './explanations.service';
import {ProjectsService} from './projects.service';
import {LoaderService} from './loader.service';
import {UsersService} from './users.service';
import {TitlePageService} from './title-page.service';
import {VesselsTypesService} from './vessels-types.service';
import {WeatherService} from './weather.service';
import {WebsocketsServiceService} from './websockets-service.service';
import {ForecastersService} from './forecasters.service';
import {RequestsService} from './requests.service';
import {CountriesService} from './countries.service';
import {VesselsService} from './vessels.service';
import {UserSharingService} from './user-sharing.service';
import {LogsService} from './logs.service';
import {ProfilerService} from './profiler.service';
import {UploadService} from '@app/core/services/upload.service';
import {RegionsService} from '@app/core/services/regions.service';
import {ClientsService} from '@app/core/services/clients.service';
import {ProductsService} from '@app/core/services/products.service';
import {ApplicationsAccessesService} from '@app/core/services/applications-accesses.service';
import {SchedulersService} from '@app/core/services/schedulers.service';
import { VirtualMachineService } from './virtual-machine.service';
import { AlphaFactorService } from './alpha-factor.service';
import { WebSpectrumService } from './web-spectrum.service';


/**
 * This variable contains the service providers list to loading.
 */
export const SERVICE_PROVIDERS = [
  AnalysisService,
  AuthenticationService,
  CacheService,
  ErrorService,
  EventsService,
  ExplanationsService,
  ProjectsService,
  LoaderService,
  TitlePageService,
  UsersService,
  VesselsTypesService,
  WeatherService,
  WebsocketsServiceService,
  ForecastersService,
  RequestsService,
  CountriesService,
  VesselsService,
  UserSharingService,
  LogsService,
  ProfilerService,
  UploadService,
  RegionsService,
  ClientsService,
  ProductsService,
  ApplicationsAccessesService,
  SchedulersService,
  VirtualMachineService,
  AlphaFactorService,
  WebSpectrumService
];

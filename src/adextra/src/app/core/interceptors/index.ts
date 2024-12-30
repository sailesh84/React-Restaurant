import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthenticationInterceptor} from './authentication.interceptor';
import {CacheInterceptor} from './cache.interceptor';
import {ConvertInterceptor} from './convert.interceptor';
import {ErrorInterceptor} from './error.interceptor';
import {RetryInterceptor} from './retry.interceptor';
import {HeaderInterceptor} from './header.interceptor';
import {LoaderInterceptor} from './loader.interceptor';
import {ProfilerInterceptor} from './profiler.interceptor';

/**
 * This variable contains the HTTP interceptors list to loading.
 */
export const HTTP_INTERCEPTOR_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ConvertInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: RetryInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ProfilerInterceptor, multi: true },
];

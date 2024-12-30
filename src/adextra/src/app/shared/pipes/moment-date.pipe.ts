import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common';
import * as moment from 'moment-timezone';

/**
 * A moment timezone pipe to support parsing based on time zone abbreviations covers all cases of offset variation due to daylight saving.
 *
 * Same API as DatePipe with additional timezone abbreviation support
 * Official date pipe dropped support for abbreviations names fromAngular V5
 */
@Pipe({
  name: 'momentDate'
})
export class MomentDatePipe extends DatePipe implements PipeTransform {

  transform(value: any, format?: string, timezone?: string, locale?: string): string | null {
    if (timezone && timezone.includes('/')) {
      return super.transform(value, format, moment(value).tz(timezone).format('Z'), locale);
    }
    return super.transform(value, format, timezone, locale);
  }

}

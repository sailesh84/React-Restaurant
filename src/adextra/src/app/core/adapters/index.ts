import {NgbDateAdapter, NgbTimeAdapter} from '@ng-bootstrap/ng-bootstrap';
import {TimestampAdapter} from '@app/core/adapters/timestamp.adapter';
import {TimeAdapter} from '@app/core/adapters/time.adapter';

/**
 * This variable contains the custom date adapter for the NgbDateAdapter module.
 */
export const DATE_ADAPTERS = [
  {provide: NgbDateAdapter, useClass: TimestampAdapter},
  {provide: NgbTimeAdapter, useClass: TimeAdapter}
];

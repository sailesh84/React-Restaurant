import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {TimestampFormatter} from '@app/core/formatters/timestamp.formatter';

/**
 * This variable contains the custom date formatter for the NgbDateParserFormatter module.
 */
export const DATE_FORMATTERS = [
  {provide: NgbDateParserFormatter, useClass: TimestampFormatter}
];

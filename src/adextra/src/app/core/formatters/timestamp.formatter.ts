import { Injectable } from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class TimestampFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  format(date: NgbDateStruct): string {
    let result: string = null;
    if (date) {
      if (date.day < 10) {
        result = '0';
      } else {
        result = '';
      }
      result += date.day + this.DELIMITER;
      if (date.month < 10) {
        result += '0';
      }
      result += date.month + this.DELIMITER + date.year;
    }
    return result;
  }

  parse(value: string): NgbDateStruct {
    let result: NgbDateStruct = null;
    if (value) {
      const date = value.split(this.DELIMITER);
      result = {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return result;
  }
}

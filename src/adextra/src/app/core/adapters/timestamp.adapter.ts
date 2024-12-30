import { Injectable } from '@angular/core';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class TimestampAdapter extends NgbDateAdapter<number> {
  fromModel(value: number): NgbDateStruct {
    let result: NgbDateStruct = null;
    if (value) {

      const date = new Date(value);
      result = {
        day : date.getUTCDate(),
        month : date.getUTCMonth() + 1,
        year : date.getUTCFullYear()
      };
    }
    return result;
  }

  toModel(date: NgbDateStruct): number {
    let result = 0;
    if (date) {
      result = Date.UTC(date.year, date.month - 1, date.day);
    }
    return result;
  }
}

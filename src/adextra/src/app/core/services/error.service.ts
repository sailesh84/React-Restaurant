import { Injectable } from '@angular/core';
import {ErrorResponse} from '@app/shared/models/error-response';
import {ToastrService} from 'ngx-toastr';

/**
 * This service is used to manage the display of error notification.
 */
@Injectable()
export class ErrorService {

  /**
   * Constructor
   * toastrService is the notification service
   */
  constructor(private toastrService: ToastrService) { }

  /**
   * This method allows to display the notification
   * The parameter `data` contains the data to display coming from the HTTP error.
   */
  generateAlert(data: ErrorResponse): void {
    this.toastrService.error(data.reason, data.name, { closeButton: true, disableTimeOut: false });
  }
}

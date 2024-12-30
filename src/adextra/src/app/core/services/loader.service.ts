import { Injectable } from '@angular/core';

/**
 * This service is used to show / displays a loader windows.
 */
@Injectable()
export class LoaderService {
  /**
   * Boolean indicating if we display or not the loader window
   */
  isLoading = false;

  /**
   * Constructor
   */
  constructor() { }

  /**
   * This method allows to show the loader windows.
   */
  show() {
    this.isLoading = true ;
  }

  /**
   * This method allows to hide the loader windows.
   */
  hide() {
    this.isLoading = false;
  }
}

import { Injectable } from '@angular/core';
import {environment} from '@env/environment';

/**
 * This service is used only by the ProfilerInterceptor for write messages in developer console.
 */
@Injectable()
export class ProfilerService {
  /**
   * This variable indicates if we are in production mode or in development mode.
   */
  private isProductionMode: boolean = environment.production;

  /**
   * Constructor
   */
  constructor() { }

  /**
   * This method displays only in the development mode in the developer console the log message to show.
   * The parameter `log` represents a message to write in the developer console.
   */
  add(log: string) {
    if (this.isProductionMode === false) {
      console.log(log);
    }
  }

  /**
   * This method returns the value of the variable 'isProductionMode' indicating if we are in production mode or in development mode.
   */
  getIsProductionMode(): boolean {
    return this.isProductionMode;
  }
}

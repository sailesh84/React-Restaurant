import { Injectable } from '@angular/core';

/**
 * This service is used to manage the data cache.
 */
@Injectable()
export class CacheService {
  /**
   * Set that contains the data cache
   */
  private cache = new Map<string, any>();

  /**
   * Constructor
   */
  constructor() { }

  /**
   * This method returns the data cache for a given url.
   * The parameter `key` represents the way to access a data cache.
   */
  get(key: string): any {
    return this.cache.get(key);
  }

  /**
   * This method updates the data cache for a given url.
   * The parameter `key` represents the way to access a data cache.
   * The parameter `value` represents the new data cache.
   */
  set(key: string, value: any): Map<string, any> {
    return this.cache.set(key, value);
  }

  /**
   * This method deletes the data cache for a given url.
   * The parameter `key` represents the way to access a data cache.
   */
  delete(key): boolean {
    return this.cache.delete(key);
  }
}

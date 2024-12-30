import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {share} from 'rxjs/operators';

/**
 * This service is used to manage the change of title to displays for each page change.
 */
@Injectable()
export class TitlePageService {
  /**
   * Observable string source
   */
  private titlePageSource = new Subject<string>();

  /**
   * Observable string stream
   */
  private titlePage$ = this.titlePageSource.asObservable().pipe(share());

  /**
   * Constructor
   */
  constructor() { }

  /**
   * This method allows to edit the title value.
   * The parameter `title` represent the new title to display.
   */
  setTitle(title: string): void {
    this.titlePageSource.next(title.trim());
  }

  /**
   * This method allows to get the title value.
   * It returns an observable of type `string`.
   */
  getTitle(): Observable<string> {
    this.titlePage$ = this.titlePageSource.asObservable().pipe(share());
    return this.titlePage$;
  }
}

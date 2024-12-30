import { Component } from '@angular/core';

/**
 * It is the main module of the application. It it the first to be loaded.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /**
   * Title of the page
   */
  title = 'Infield Portal';

  /**
   * Constructor
   */
  constructor() {}
}

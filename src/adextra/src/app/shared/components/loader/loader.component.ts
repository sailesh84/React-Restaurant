import { Component, OnInit } from '@angular/core';
import {LoaderService} from '@app/core/services/loader.service';

/**
 * This component is the displayed loader window.
 */
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  /**
   * Constructor
   * We use the LoaderService for know if we display or not the loader component.
   */
  constructor(public loaderService: LoaderService) { }

  /**
   * Called as soon as the creation of the component
   */
  ngOnInit() {}
}

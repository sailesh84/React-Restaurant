import {Directive, ElementRef, Input, OnInit} from '@angular/core';

/**
 * This directive is used for apply a given width (0-100) on a progressbar (Used only on the progressbars of the dashboard page).
 */
@Directive({
  selector: '[appRisksProgressbar]'
})
export class RisksProgressbarDirective implements OnInit {

  /**
   * The width to apply.
   */
  @Input('appRisksProgressbar') value: number;

  /**
   * Default value
   */
  private defaultValue = 0;

  /**
   * Constructor
   * The parameter `el` represents the progressbar where we have to apply the width.
   */
  constructor(private el: ElementRef) {
    this.setValue(this.defaultValue);
  }

  /**
   * This method allows to update the width of the progressbar.
   * The parameter `value` is the new value of the width.
   */
  private setValue(value: number) {
    this.el.nativeElement.style.width = value + '%';
  }

  /**
   * Called as soon as the creation of the directive.
   */
  ngOnInit(): void {
    this.setValue(this.value || this.defaultValue);
  }
}

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UserSharingService } from '@app/core/services/user-sharing.service';
import { Accesses } from '@app/shared/enums/accesses.enum';

/**
 * This component represents the sidebar
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnChanges {
  /**
   * Represents the state of the sidebar.
   */
  isToggled = true;
  isToggledSidebar: boolean = false;
  /**
   * The chevron to show according to the state of the sidebar.
   */
  arrow = 'chevron_right';
  /**
   * Indicates the default state of the sidebar.
   */
  @Input() isCollapsed = true;

  /**
   * Accesses right of the current user.
   */
  @Input() levelAccess = Accesses.General;

  /**
   * Constructor
   */
  constructor(private userSharingService: UserSharingService) { }

  /**
   * Called as soon as the creation of the component
   */
  ngOnInit() {
    this.getSidebarToggledStatus();
  }

  /**
   * Called during the changes of the component.
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.collapseSidebar();
  }

  /**
   * This method allows to toggle the state of the sidebar.
   */
  toggleSidebar() {
    if (this.arrow === 'chevron_left' && !this.isToggled) {
      this.arrow = 'chevron_right';
      this.isToggled = true;
    } else {
      this.arrow = 'chevron_left';
      this.isToggled = false;
    }
  }

  /**
   * This method allows to reduce / extend the sidebar.
   */
  collapseSidebar() {
    this.isToggled = this.isCollapsed;
  }

  /**
   * This method allows to determine if a user is admin / lead or not.
   */
  isAdmin() {
    // return this.levelAccess && (this.levelAccess === Accesses.Lead || this.levelAccess === Accesses.Administrator);
    return this.levelAccess === Accesses.General || (this.levelAccess === Accesses.Lead || this.levelAccess === Accesses.Administrator);
  }

  /**
   * This method allows to determine if a user is operator lead or not.
   */
  isOperatorLead() {
    // return this.levelAccess && (this.levelAccess === Accesses.Offshore || this.levelAccess === Accesses.InstallAnalyst);
    return this.levelAccess === Accesses.General || (this.levelAccess === Accesses.Offshore || this.levelAccess === Accesses.InstallAnalyst);
  }

  getSidebarToggledStatus() {
    this.userSharingService.toggleSidebar.subscribe(response => {
      this.isToggledSidebar = response;
    });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import {Accesses} from '@app/shared/enums/accesses.enum';
import { UserSharingService } from '@app/core/services/user-sharing.service';

@Component({
  selector: 'app-admin-panel-feature',
  templateUrl: './admin-panel-feature.component.html',
  styleUrls: ['./admin-panel-feature.component.scss']
})
export class AdminPanelFeatureComponent implements OnInit {

  @Input() levelAccess: any;
  panels = {
    section1: [
      {
        id: 1.0, title: 'Explanations management', icon: 'insert_comment', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-explanations'
      },
      {
        id: 1.1, title: 'Products management', icon: 'settings_input_component', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-products'
      },
      {
        id: 1.2, title: 'Projects management', icon: 'place', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-projects'
      },
      {
        id: 1.3, title: 'Vessels management', icon: 'directions_boat', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-vessels'
      },
    ],
    section2: [
      {
        id: 2.0, title: 'Application access management', icon: 'settings_applications', colorTitle: 'text-info',
        colorBorder: 'border-left-info', href: '/admin-applications-accesses'
      },
      {
        id: 2.1, title: 'Clients management', icon: 'business', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-clients'
      },
      {
        id: 2.2, title: 'Countries management', icon: 'language', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-countries'
      },
      {
        id: 2.3, title: 'Forecasters management', icon: 'cast', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-forecasters'
      },
      {
        id: 2.4, title: 'Logs management', icon: 'history', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-logs'
      },
      {
        id: 2.5, title: 'Regions management', icon: 'satellite', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-regions'
      },
      {
        id: 2.6, title: 'Requests management', icon: 'receipt', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-requests'
      },
      {
        id: 2.7, title: 'Users management', icon: 'group', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-users'
      },
      {
        id: 2.8, title: 'Vessels types management', icon: 'category', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-vessels-types'
      },
      {
        id: 2.8, title: 'Virtual Machine management', icon: 'display_settings', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-virtual-machine'
      },
      {
        id: 2.9, title: 'Alpha Factor management', icon: 'waves', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-alpha-factor'
      },
      {
        id: 3.0, title: 'Web Spectrum management', icon: 'cast', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-wave-spectrum'
      },
      // {
      //   id: 3.0, title: 'Current wave management', icon: 'sort', colorTitle: 'text-info', colorBorder: 'border-left-info',
      //   href: '/admin-current-wave'
      // }
    ],
    section3: [
      {
        id: 2.0, title: 'Application access management', icon: 'settings_applications', colorTitle: 'text-info',
        colorBorder: 'border-left-info', href: '/admin-applications-accesses'
      },
      {
        id: 2.3, title: 'Forecasters management', icon: 'cast', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-forecasters'
      },
      {
        id: 2.4, title: 'Logs management', icon: 'history', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-logs'
      },
      {
        id: 2.6, title: 'Requests management', icon: 'receipt', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-requests'
      },
      {
        id: 2.7, title: 'Users management', icon: 'group', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-users'
      },
      {
        id: 2.8, title: 'Virtual Machine management', icon: 'display_settings', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-virtual-machine'
      },
      {
        id: 2.9, title: 'Alpha Factor management', icon: 'waves', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-alpha-factor'
      },
      {
        id: 3.0, title: 'Web Spectrum management', icon: 'cast', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-wave-spectrum'
      }
      // {
      //   id: 3.0, title: 'Current wave management', icon: 'sort', colorTitle: 'text-info', colorBorder: 'border-left-info',
      //   href: '/admin-current-wave'
      // }
    ],
    section4: [
      {
        id: 2.7, title: 'Users management', icon: 'group', colorTitle: 'text-info', colorBorder: 'border-left-info',
        href: '/admin-users'
      }
    ]
  };

  constructor(private userSharingService: UserSharingService) { }

  ngOnInit() {
    this.levelAccess = this.userSharingService.currentUser.access;
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

  /**
   * This method allows to determine if a user is admin.
   */
   isAdmin() {
    return this.levelAccess === Accesses.Administrator;
  }

  /**
   * This method allows to determine if a user is lead.
   */
   isLead() {
    return this.levelAccess === Accesses.Lead;
  }

  /**
   * This method allows to determine if a user is general.
   */
   isGeneral() {
    return this.levelAccess === Accesses.General;
  }
}

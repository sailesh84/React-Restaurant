import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserSharingService} from '@app/core/services/user-sharing.service';
import {User} from '@app/shared/models/user';
import {UsersService} from '@app/core/services/users.service';
import {AuthenticationService} from '@app/core/services/authentication.service';
import {of} from 'rxjs';
import {Accesses} from '@app/shared/enums/accesses.enum';

/**
 * Guard for authorize the access to a page for the current user else there are redirection toward the access denied page.
 */
@Injectable()
export class AccessGuard implements CanActivate {

  /**
   * With the constructor, we load the service whose we needed.
   */
  constructor(
    private router: Router,
    private userSharingService: UserSharingService,
    private userService: UsersService,
    private authService: AuthenticationService
  ) {}

  /**
   * Static method for helping to determine if a user is admin / lead or not.
   * The parameter `access` represents the user access level.
   */
  static isAdminOrLead(access: number) {
    return access || (access === Accesses.Lead || access === Accesses.Administrator);
  }

  /**
   * Static method for helping to determine if a user is operator lead.
   * The parameter `access` represents the user access level.
   */
  static isOperatorLead(access: number) {
    return access || (access === Accesses.Offshore || access === Accesses.InstallAnalyst);
  }

  /**
   * It is this function that allows to manage the access to a page.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const highLevelRoutes = ['/admin-regions', '/admin-countries', '/admin-vessels-types', '/admin-clients'];
    const specifiedRoutes = ['/scheduler', '/scheduler-logs', '/analysis-history'];

    let user: User = this.userSharingService.currentUser;
    
    if (user === undefined || user === null) {
      // try too get my user
      const keys = { uid: localStorage.getItem('user-uid'), email: localStorage.getItem('user-email') };
      if (keys.uid !== null && keys.email !== null) {
        this.userService.getUser(keys.email).subscribe(response => {
          this.userSharingService.updateUser(response.data);
          user = response.data;
          if (!AccessGuard.isAdminOrLead(user.access)) {
            if (specifiedRoutes.includes(state.url) && AccessGuard.isOperatorLead(user.access)) {
              this.router.navigate([state.url]); // redirection to the calling page
              return of(true);
            } else  {
              this.router.navigate(['/access-denied']);
              return of(false);
            }
          } else {
            if (specifiedRoutes.includes(state.url) &&
              (AccessGuard.isOperatorLead(user.access) || AccessGuard.isAdminOrLead(user.access))) {
              this.router.navigate([state.url]); // redirection to the calling page
              return of(true);
            }
            if (highLevelRoutes.includes(state.url)) {
              if (user.access === Accesses.Administrator) {
                this.router.navigate([state.url]); // redirection to the calling page
                return of(true);
              } else {
                this.router.navigate(['/access-denied']);
                return of(false);
              }
            } else {
              this.router.navigate([state.url]); // redirection to the calling page
              return of(true);
            }
          }
        });
      } else {
        this.authService.logout();
        return of(false);
      }
    } else {
      if (!AccessGuard.isAdminOrLead(user.access)) { 
        // users who do not have access of admin or lead (like: visitor, offshore, install-analyst)
        if (specifiedRoutes.includes(state.url) && AccessGuard.isOperatorLead(user.access)) { // 1,2,3,4
          return of(true);
        } else  {
          this.router.navigate(['/access-denied']);
          return of(false);
        }
      } else {
        if (specifiedRoutes.includes(state.url) &&
          (AccessGuard.isOperatorLead(user.access) || AccessGuard.isAdminOrLead(user.access))) {
          return of(true);
        }
        if (highLevelRoutes.includes(state.url)) {
          if (user.access === Accesses.Administrator) {
            // this.router.navigate([state.url]); // redirection to the calling page
            return of(true);
          } else {
            this.router.navigate(['/access-denied']);
            return of(false);
          }
        } else {
          // this.router.navigate([state.url]); // redirection to the calling page
          return of(true);
        }
      }
    }
  }
}

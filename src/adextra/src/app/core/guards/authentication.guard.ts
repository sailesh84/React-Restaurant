import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';

/**
 * Guard for know if a user is connected or not for accessed to the protected part of the application.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {

  /**
   * With the constructor, we load the service whose we needed.
   */
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  /**
   * With this function, we try to know if a user is connected or not. In the case where the user is connected, there are an access the
   * protected part of the application else the user is redirected toward the login page.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isLogged = this.authService.isLogged;
    if (isLogged === true) {
      // this.router.navigate([state.url]); // redirection to the calling page
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}

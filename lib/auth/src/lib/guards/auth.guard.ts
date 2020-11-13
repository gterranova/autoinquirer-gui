import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService, TokenService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private helper: JwtHelperService,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate() {
    const { token } = this.tokenService.currentUser;
    if (
      token !== '' &&
      (!this.helper.getTokenExpirationDate(token) ||
        !this.helper.isTokenExpired(token))
    ) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page
    this.authenticationService.logout();
    this.router.navigate(['/auth/login']);
    return false;
  }
}

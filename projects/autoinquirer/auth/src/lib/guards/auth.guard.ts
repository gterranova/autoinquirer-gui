import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private helper: JwtHelperService,
    private authenticationService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate() {
    const token = this.tokenService.token;
    if (
      token !== '' &&
      (!this.helper.getTokenExpirationDate(token) ||
        !this.helper.isTokenExpired(token))
    ) {
      this.authenticationService.logout();
    }

    return this.authenticationService.isLoggedIn.pipe(
      take(1),                              
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn){
          this.router.navigate(['/auth/login']);
          return false;
        }
        return true;
      })
    );    
  }
}

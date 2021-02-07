import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer } from 'rxjs';

import { TokenService } from './token.service';
import { FormlyService } from '@autoinquirer/shared';
import { User, LocalData, NewUser, UserActivation } from '../models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { Action } from '@autoinquirer/shared';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token: string;
  private refreshSubscription: any;
  private prefix = 'auth';
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private formlyService: FormlyService,
    private tokenService: TokenService,
    private helper: JwtHelperService
  ) {
    // set token if saved in local storage
    this.token = tokenService.token;
    this.scheduleRenewal();
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable(); 
  }

  login(user: User): Observable<boolean> {
    // add authorization header with jwt token
    return this.formlyService.request(Action.UPDATE, `${this.prefix}/login`, user).pipe(
      map((response: any) => {
        // login successful if there's a jwt token in the response
        const { uid, token } = response;
        if (token) {
          // set token property
          this.token = token;

          // store username and jwt token in local storage to keep user logged in between page refreshes
          this.tokenService.token = token;
          this.tokenService.uid = uid;

          this.scheduleRenewal();
          this.loggedIn.next(true);

          return true;
        }
        return false;
      })
    );
  }

  register(user: NewUser): Observable<boolean> {
    // add authorization header with jwt token
    return this.formlyService.request(Action.UPDATE, `${this.prefix}/register`, user).pipe(
      map((response: any) => {
        // login successful if there's a jwt token in the response
        const { uid, token } = response;
        if (token) {
          // set token property
          this.token = token;

          // store username and jwt token in local storage to keep user logged in between page refreshes
          this.tokenService.token = token;
          this.tokenService.uid = uid;

          this.scheduleRenewal();
          this.loggedIn.next(true);

          return true;
        }
        return false;
      })
    );
  }

  activate(user: UserActivation): Observable<any> {
    // add authorization header with jwt token
    return this.formlyService.request(Action.UPDATE, `${this.prefix}/activate`, user);
  }

  refreshToken() {
    // add authorization header with jwt token
    return this.formlyService.request(Action.SET, `${this.prefix}/renew`, {
      token: this.tokenService.token
    }).subscribe((response: any) => {
      // login successful if there's a jwt token in the response
      const { token } = response;
      if (token) {
        this.token = token;
        // store username and jwt token in local storage to keep user logged in between page refreshes
        this.tokenService.token = token;
        this.scheduleRenewal();
      }
    });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = '';
    this.unscheduleRenewal();
    this.tokenService.reset();
    this.loggedIn.next(false);
  }

  currentUser() {
    return this.formlyService.request(Action.GET, `${this.prefix}/me`);
  }

  private scheduleRenewal() {
    if (!this.tokenService.token || this.helper.isTokenExpired()) {
      this.logout();
      return;
    }
    this.unscheduleRenewal();

    //console.log("Schedule renewal");
    const now = Date.now();
    const expiresAt = this.helper.getTokenExpirationDate(this.token);
    const offset = expiresAt? expiresAt.getTime() - now - 10 * 1000 : 1000;

    // Once the delay time from above is
    // reached, get a new JWT and schedule
    // additional refreshes
    this.refreshSubscription = timer(Math.max(1, offset)).subscribe(() => {
      //console.log("TOKEN RENEW");
      this.unscheduleRenewal();
      this.refreshToken();
    });
  }

  private unscheduleRenewal() {
    if (!this.refreshSubscription) {
      return;
    }
    //console.log("Unschedule renewal");
    this.refreshSubscription.unsubscribe();
  }

}

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { User, LocalData } from '../models';

@Injectable()
export class TokenService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get currentUser(): LocalData {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser)
      : { uid: '', token: '' };
  }

  set currentUser(currentUser: LocalData) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  get uid(): string {
    // set token if saved in local storage
    return this.currentUser.uid;
  }

  set uid(uid: string) {
    // set token if saved in local storage
    this.currentUser = { ...this.currentUser, uid };
  }

  get token(): string {
    // set token if saved in local storage
    return this.currentUser.token;
  }

  set token(token: string) {
    // set token if saved in local storage
    this.currentUser = { ...this.currentUser, token };
  }

  reset() {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}

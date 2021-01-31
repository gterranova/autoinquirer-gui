import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromptComponent, PromptCallbackType } from '@autoinquirer/shared';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-autoinquirer-auth-logout',
  template: `<div></div>`
})
export class AutoinquirerAuthLogoutComponent implements OnInit, PromptComponent, OnInit {
  prompt: any = {};
  callback: PromptCallbackType;
  
  constructor(
      private authService: AuthService,
      protected router: Router
    ) { }

  ngOnInit() {
    this.authService.logout();
    setTimeout(()=> this.router.navigate(['/']), 1000);
  }

}

import { Component, OnInit } from '@angular/core';
import { PromptComponent, PromptCallbackType } from '@autoinquirer/shared';

interface SidenavItem {
  title: string,
  path: string
}

interface SidenavConfig {
  type: string, 
  title: string, 
  user: any, 
  items: SidenavItem[]
}

@Component({
  selector: 'app-autoinquirer-sidenav',
  templateUrl: './autoinquirer-sidenav.component.html',
  styleUrls: ['./autoinquirer-sidenav.component.scss']
})
export class AutoinquirerSidenavComponent implements PromptComponent, OnInit {
  prompt: any = {};
  callback: PromptCallbackType;
  sidenav: SidenavConfig;
  
  constructor() { 
  }
  ngOnInit() {
    this.sidenav = <SidenavConfig>this.prompt;
  }
  select(url?: any) {
    this.callback('navigate', url||'');
  }

  login() {
    this.callback('navigate', '/auth/login');
  }
  
  logout() {
    this.callback('navigate', '/auth/logout');
  }
  
}

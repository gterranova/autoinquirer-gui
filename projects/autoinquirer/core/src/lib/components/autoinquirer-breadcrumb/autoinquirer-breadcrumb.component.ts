import { Component, OnInit } from '@angular/core';
import { PromptComponent, IServerResponse, PromptCallbackType } from '@autoinquirer/shared';


@Component({
  selector: 'app-autoinquirer-breadcrumb',
  templateUrl: './autoinquirer-breadcrumb.component.html',
  styleUrls: ['./autoinquirer-breadcrumb.component.scss']
})
export class AutoinquirerBreadcrumbComponent implements PromptComponent, OnInit {
  prompt: any = {};
  callback: PromptCallbackType;
  
  constructor() { 
  }

  ngOnInit() {
  }

  select(url?: any) {
    this.callback('navigate', url||'');
  }

}

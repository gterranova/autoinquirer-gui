import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PromptComponent, IServerResponse, PromptCallbackType } from '@autoinquirer/shared';


@Component({
  selector: 'app-autoinquirer-breadcrumb',
  templateUrl: './autoinquirer-breadcrumb.component.html',
  styleUrls: ['./autoinquirer-breadcrumb.component.scss']
})
export class AutoinquirerBreadcrumbComponent implements PromptComponent, OnInit {
  prompt: any = {};
  callback: PromptCallbackType;
  
  constructor(private titleService: Title) { 
  }

  ngOnInit() {
    this.titleService.setTitle(this.prompt.pathParts[this.prompt.pathParts.length-1].label);
  }

  select(url?: any) {
    this.callback('navigate', url||'');
  }

}

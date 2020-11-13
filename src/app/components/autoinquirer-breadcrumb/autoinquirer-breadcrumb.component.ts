import { Component, OnInit } from '@angular/core';
import { PromptComponent, IServerResponse } from '../../models';
import { PromptService } from '../../prompt.service';

@Component({
  selector: 'app-autoinquirer-breadcrumb',
  templateUrl: './autoinquirer-breadcrumb.component.html',
  styleUrls: ['./autoinquirer-breadcrumb.component.scss']
})
export class AutoinquirerBreadcrumbComponent implements PromptComponent, OnInit {
  prompt: any = {};
  
  constructor(private promptService: PromptService) { 
  }

  ngOnInit() {
  }

  select(selection?: any) {
    this.promptService.navigate(selection? selection.value:'/');
  }

}

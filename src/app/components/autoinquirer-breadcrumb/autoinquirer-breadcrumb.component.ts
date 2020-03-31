import { Component, OnInit } from '@angular/core';
import { PromptComponent, IServerResponse } from 'src/app/models';
import { PromptService } from 'src/app/prompt.service';

@Component({
  selector: 'app-autoinquirer-breadcrumb',
  templateUrl: './autoinquirer-breadcrumb.component.html',
  styleUrls: ['./autoinquirer-breadcrumb.component.scss']
})
export class AutoinquirerBreadcrumbComponent implements PromptComponent, OnInit {
  prompt: IServerResponse;
  
  constructor(private promptService: PromptService) { 
  }

  ngOnInit() {
  }

  select(selection?: any) {
    this.promptService.navigate(selection? selection.value:'/');
  }

}

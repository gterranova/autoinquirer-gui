import { Component, OnInit } from '@angular/core';
import { PromptComponent, IPrompt, IState, Action } from 'src/app/models';
import { PromptService } from 'src/app/prompt.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-autoinquirer-breadcrumb',
  templateUrl: './autoinquirer-breadcrumb.component.html',
  styleUrls: ['./autoinquirer-breadcrumb.component.scss']
})
export class AutoinquirerBreadcrumbComponent implements PromptComponent, OnInit {
  prompt: any;
  
  constructor(private promptService: PromptService) { 
  }

  ngOnInit() {
  }

  select(selection?: any) {
    this.promptService.navigate(selection? selection.path:'/');
  }

}

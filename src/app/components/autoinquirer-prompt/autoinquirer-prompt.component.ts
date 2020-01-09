import { Component, OnInit, ViewChild, ComponentFactoryResolver, Input, Inject, ComponentRef  } from '@angular/core';
import { PromptHostDirective } from './prompt-host.directive';
import { IPrompt, PromptComponent } from 'src/app/models';
import { ComponentTypes } from '../dynamic-components';

import { PromptService } from 'src/app/prompt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-autoinquirer-prompt',
  template: `<div><ng-template prompt-host></ng-template></div>`,
  styleUrls: ['./autoinquirer-prompt.component.scss']
})
export class AutoinquirerPromptComponent implements OnInit {
  @ViewChild(PromptHostDirective, { static: true }) promptHost: PromptHostDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private promptService: PromptService, private router: Router) { }


    ngOnInit() {
      this.promptService.currentPrompt.subscribe( prompt => {
        if (prompt.path !== this.promptService.getStatus().path) {
          this.router.navigate(['/', ...prompt.path.split('/')]);
        } else {
          this.setupComponent(prompt);
        }
      });
    }
  
    setupComponent(data: IPrompt) {
      if (data.type === 'list' && data.choices.every( choice => typeof choice === 'string' || choice.hasOwnProperty('value'))) {
        data.type = 'select';
      }
      const componentType = ComponentTypes[data.type];
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
      const viewContainerRef = this.promptHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<PromptComponent>componentRef.instance).prompt = data;
    }
  
}

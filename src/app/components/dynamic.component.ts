import { Component, OnInit, ViewChild, ComponentFactoryResolver, Input } from '@angular/core';
import { IServerResponse, PromptComponent } from 'src/app/models';
import { Directive, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AutoinquirerFormComponent } from './autoinquirer-form/autoinquirer-form.component';
import { AutoinquirerBreadcrumbComponent } from './autoinquirer-breadcrumb/autoinquirer-breadcrumb.component';
//import { AutoinquirerConfirmComponent } from './autoinquirer-confirm/autoinquirer-confirm.component';
//import { AutoinquirerCheckboxComponent } from './autoinquirer-checkbox/autoinquirer-checkbox.component';
//import { AutoinquirerSelectComponent } from './autoinquirer-select/autoinquirer-select.component';
//import { AutoinquirerTextareaComponent } from './autoinquirer-textarea/autoinquirer-textarea.component';

export const DYNAMIC_COMPONENTS = [
  AutoinquirerFormComponent,
  AutoinquirerBreadcrumbComponent,
  //AutoinquirerConfirmComponent,
  //AutoinquirerCheckboxComponent,
  //AutoinquirerSelectComponent,
  //AutoinquirerTextareaComponent
];

export const ComponentTypes = {
  'form': AutoinquirerFormComponent,
  'breadcrumb': AutoinquirerBreadcrumbComponent,
  //'textarea': AutoinquirerTextareaComponent,
  //'confirm': AutoinquirerConfirmComponent,
  //'checkbox': AutoinquirerCheckboxComponent,
  //'select': AutoinquirerSelectComponent,
};

@Directive({
  selector: '[prompt-host]'
})
export class PromptHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
  selector: 'dynamic-component',
  template: `<ng-template prompt-host></ng-template>`
})
export class DynamicComponent implements OnInit {
  @ViewChild(PromptHostDirective, { static: true }) promptHost: PromptHostDirective;
  @Input() prompt: IServerResponse;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private route: ActivatedRoute) { }


  ngOnInit() {
    //this.prompt.subscribe(data => {
      this.setupComponent(this.prompt);
    //});
  }

  setupComponent(data: IServerResponse) {
    if (data) {
      const componentType = ComponentTypes[data.type];
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
      const viewContainerRef = this.promptHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<PromptComponent>componentRef.instance).prompt = data;  
    }
  }

}


@Component({
  selector: 'dynamic-container',
  template: `<dynamic-component [prompt]="c" *ngFor="let c of data.components"></dynamic-component>`
})
export class DynamicContainer implements OnInit {
  data = { components: []};
  constructor(private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.data.subscribe(({ promptInfo }) => {
      this.data = promptInfo;
    });
  }
}

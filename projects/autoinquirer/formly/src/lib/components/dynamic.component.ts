import { Component, OnInit, ViewChild, ComponentFactoryResolver, Input, OnDestroy, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { IServerResponse, PromptComponent, PromptCallbackType } from '../autoinquirer-formly.models';
import { Directive, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

import { ComponentType } from '@angular/cdk/portal';
import { DynamicComponentConfig, FormlyService } from '../services';

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
export class DynamicComponent implements OnInit, PromptComponent {
  @ViewChild(PromptHostDirective, { static: true }) promptHost: PromptHostDirective;
  @Input() prompt: IServerResponse;
  @Input() callback: PromptCallbackType;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private configService: DynamicComponentConfig) { }


  ngOnInit() {
    //this.prompt.subscribe(data => {
      this.setupComponent(this.prompt);
    //});
  }

  setupComponent(data: IServerResponse) {
    if (!data) {
      return;
    }
    const { component: componentData = DynamicEmptyComponent } = this.configService.getType(data.type || 'layout');
    if (componentData) {
      const componentType: ComponentType<PromptComponent> = componentData;
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
      const viewContainerRef = this.promptHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
      componentRef.instance.prompt = data;  
      componentRef.instance.callback = this.callback;
    }
  }

}

@Component({
  selector: 'dynamic-layout',
  template: `<dynamic-component [callback]="callback" [prompt]="c" *ngFor="let c of prompt.children"></dynamic-component>`
})
export class DynamicLayoutComponent implements PromptComponent {
  prompt: any = {};
  callback: PromptCallbackType; 
}

@Component({
  selector: 'dynamic-empty-component',
  template: `<br/>`
})
export class DynamicEmptyComponent implements PromptComponent {
  prompt: any = {};
  callback: PromptCallbackType; 
}

@Component({
  selector: 'dynamic-redirect-component',
  template: `&nbsp;`,
})
export class DynamicRedirectComponent implements PromptComponent, AfterViewInit {
  prompt: any = {};
  callback: PromptCallbackType; 

  constructor(private location: Location) {}

  ngAfterViewInit() {
    window.open(this.prompt.url, this.prompt.target || undefined);
    if (this.prompt.target) this.location.back();
  }
}

@Component({
  selector: 'dynamic-container',
  template: `<ng-container *ngIf="loading"><mat-progress-bar mode="indeterminate"></mat-progress-bar>
  </ng-container><dynamic-component [callback]="onAction" [prompt]="c" *ngFor="let c of data"></dynamic-component>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicContainer implements OnInit, OnDestroy {
  data: any;
  loading: boolean = true;
  navigationSubscription;
  routeDataSubscription;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private promptService: FormlyService,
    private cdref: ChangeDetectorRef) { }

  ngOnInit() { 
   // subscribe to the router events. Store the subscription so we can
   // unsubscribe later.
   this.navigationSubscription = this.router.events.subscribe((e: any) => {
    // If it is a NavigationEnd event re-initalise the component
      //if (e instanceof NavigationEnd) {
      //  console.log("NavigationEND")
      //  this.loading = false;
      //} else 
      if (e instanceof NavigationStart) {
        //console.log("NavigationSTART")
        this.loading = true;
        this.cdref.detectChanges();
      }

    });    
    this.routeDataSubscription = this.route.data.subscribe(({ promptInfo }) => {
      //console.log("Got info", promptInfo);
      this.loading = false;
      this.data = [promptInfo];
      this.cdref.detectChanges();
    });
  }

  onAction: PromptCallbackType = (action, ...args) => {
    //console.log(action, args)
    return this.promptService[action].call(this.promptService, ...args);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe();
    }
  }  
}

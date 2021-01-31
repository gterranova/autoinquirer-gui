import { NgModule, ModuleWithProviders, Inject, Optional } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DynamicContainer, DynamicComponent, PromptHostDirective, DynamicLayoutComponent } from './components';
import { AutoinquirerBreadcrumbComponent } from './components/autoinquirer-breadcrumb/autoinquirer-breadcrumb.component';
import { DynamicEmptyComponent, DynamicRedirectComponent } from './components/dynamic.component';

import { DynamicComponentConfig, DYNAMIC_COMPONENT_CONFIG } from '@autoinquirer/shared';


import { DynamicComponentConfigOption, SharedModule } from '@autoinquirer/shared';

export function defaultDynamicComponentConfig(): DynamicComponentConfigOption {
  return {
    types: [
      { name: 'layout', component: DynamicLayoutComponent },
      { name: 'breadcrumb', component: AutoinquirerBreadcrumbComponent },
      { name: 'redirect', component: DynamicRedirectComponent },      
    ]
  };
}

const DYNAMIC_COMPONENTS = [
  AutoinquirerBreadcrumbComponent,
  DynamicLayoutComponent,
  DynamicEmptyComponent,
  DynamicRedirectComponent,
];


@NgModule({
  declarations: [
    DynamicContainer,
    DynamicComponent,
    PromptHostDirective,
    ...DYNAMIC_COMPONENTS,        
  ],
  entryComponents: [
    ...DYNAMIC_COMPONENTS
  ],
  imports: [
    CommonModule, 
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    SharedModule,
  ],
  exports: []
})
export class AutoinquirerCoreModule { 
  static forRoot(config: DynamicComponentConfigOption = {}): ModuleWithProviders<AutoinquirerCoreModule> {
    return {
      ngModule: AutoinquirerCoreModule,
      providers: [
        [
          { provide: DYNAMIC_COMPONENT_CONFIG, multi: true, useFactory: defaultDynamicComponentConfig, deps: [DynamicComponentConfig] },
          { provide: DYNAMIC_COMPONENT_CONFIG, useValue: config, multi: true },          
        ],
      ]
    };
  }

  constructor(@Inject(DynamicComponentConfig) configService: DynamicComponentConfig, @Optional() @Inject(DYNAMIC_COMPONENT_CONFIG) configs: DynamicComponentConfigOption[] = []) {
    if (!configs) {
      return;
    }

    configs.forEach((config) => configService.addConfig(config));
  }  
}

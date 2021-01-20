import { NgModule, ModuleWithProviders, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { FormlyJsonModule } from './formly/formly-json.module';
import { DynamicContainer, DynamicComponent, PromptHostDirective, DynamicLayoutComponent } from './components';
import { FormlyService, DynamicComponentConfig, DYNAMIC_COMPONENT_CONFIG } from './services';
import { DynamicComponentConfigOption } from './autoinquirer-formly.models';

import { AutoinquirerFormComponent } from './components/autoinquirer-form/autoinquirer-form.component';
import { AutoinquirerBreadcrumbComponent } from './components/autoinquirer-breadcrumb/autoinquirer-breadcrumb.component';
import { Inject } from '@angular/core';
import { DynamicEmptyComponent, DynamicRedirectComponent } from './components/dynamic.component';


export function defaultDynamicComponentConfig(config: DynamicComponentConfig): DynamicComponentConfigOption {
  return {
    types: [
      { name: 'layout', component: DynamicLayoutComponent },
      { name: 'form', component: AutoinquirerFormComponent },
      { name: 'breadcrumb', component: AutoinquirerBreadcrumbComponent },
      { name: 'redirect', component: DynamicRedirectComponent },      
    ]
  };
}

const DYNAMIC_COMPONENTS = [
  AutoinquirerFormComponent,
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
  imports: [
    CommonModule, 
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormlyJsonModule,
  ],
  entryComponents: [
    ...DYNAMIC_COMPONENTS
  ],
  exports: [
  ]
})
export class AutoinquirerFormlyModule { 
  static forRoot(config: DynamicComponentConfigOption = {}): ModuleWithProviders<AutoinquirerFormlyModule> {
    return {
      ngModule: AutoinquirerFormlyModule,
      providers: [
        FormlyService,
        [
          { provide: DYNAMIC_COMPONENT_CONFIG, multi: true, useFactory: defaultDynamicComponentConfig, deps: [DynamicComponentConfig] },
          { provide: DYNAMIC_COMPONENT_CONFIG, useValue: config, multi: true },          
        ],
      ]
    };
  }

  constructor(configService: DynamicComponentConfig, @Optional() @Inject(DYNAMIC_COMPONENT_CONFIG) configs: DynamicComponentConfigOption[] = []) {
    if (!configs) {
      return;
    }

    configs.forEach((config) => configService.addConfig(config));
  }  
}

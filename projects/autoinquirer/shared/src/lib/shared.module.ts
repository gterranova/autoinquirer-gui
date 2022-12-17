import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';

import { FormlyService } from './formly.service';
import { DYNAMIC_COMPONENT_CONFIG, DynamicComponentConfig } from './dynamic.component.config';

@NgModule({
  imports: [
    CommonModule, 
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule.forChild()
  ],
  providers: [],
  exports: [
    MaterialModule
  ]
})
export class SharedModule { 

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        FormlyService,
        [
          DynamicComponentConfig,
          { provide: DYNAMIC_COMPONENT_CONFIG, useValue: {}, multi: true, deps: [DynamicComponentConfig] }
        ],
      ]
    };
  }
}

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JsonFormlyModule } from './formly/formly.module';
import { PromptService } from './prompt.service';
import { DynamicContainer, DynamicComponent, PromptHostDirective, DYNAMIC_COMPONENTS } from './components';
import { AuthenticationService, AuthModule, TokenService } from '@ngx-juda/auth';

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
    //SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    JsonFormlyModule,
    AuthModule.forRoot()
  ],
  entryComponents: [
    ...DYNAMIC_COMPONENTS
  ],
  exports: [
  ]
})
export class CoreModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        PromptService
      ]
    };
  }
}

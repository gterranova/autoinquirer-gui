import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { AutoinquirerPromptComponent, PromptHostDirective, DYNAMIC_COMPONENTS } from './components';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    AutoinquirerPromptComponent,
    PromptHostDirective,
    ...DYNAMIC_COMPONENTS,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    MaterialModule,
    FormlyModule.forRoot(),
    FormlyMaterialModule
  ],
  entryComponents: [
    ...DYNAMIC_COMPONENTS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

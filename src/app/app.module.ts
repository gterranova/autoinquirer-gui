import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { DynamicContainer, DynamicComponent, PromptHostDirective, DYNAMIC_COMPONENTS } from './components';
import { HttpClientModule } from '@angular/common/http';
import { JsonFormlyModule } from './formly/formly.module';

//const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    DynamicContainer,
    DynamicComponent,
    PromptHostDirective,
    ...DYNAMIC_COMPONENTS,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    //SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    JsonFormlyModule,
  ],
  entryComponents: [
    ...DYNAMIC_COMPONENTS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

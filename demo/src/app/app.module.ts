import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { DynamicContainer, DynamicComponent, PromptHostDirective, DYNAMIC_COMPONENTS } from './components';
import { HttpClientModule } from '@angular/common/http';

import { AutoinquirerCoreModule } from '@autoinquirer/core';
import { SharedModule } from '@autoinquirer/shared';
import { AutoinquirerFormlyModule } from '@autoinquirer/formly';
import { AuthModule } from '@autoinquirer/auth';
import { MarkdownModule } from '@autoinquirer/markdown';
import { MarkedOptions, MarkedRenderer } from '@autoinquirer/markdown';

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.blockquote = (text: string) => {
    return '<blockquote class="blockquote"><p>' + text + '</p></blockquote>';
  };

  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, //
    FormsModule, //
    ReactiveFormsModule, //
    AppRoutingModule,
    HttpClientModule,
    //SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    AutoinquirerCoreModule.forRoot(),
    AutoinquirerFormlyModule.forRoot(),
    AuthModule.forRoot(),
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      },
    }),
  ],
  entryComponents: [
    //...DYNAMIC_COMPONENTS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicContainer, DynamicComponent, PromptHostDirective, DYNAMIC_COMPONENTS } from './components';
import { HttpClientModule } from '@angular/common/http';
import { JsonFormlyModule } from './formly/formly.module';

import { MarkedOptions, MarkedRenderer, MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';

//const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };
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
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      },
    }),
    JsonFormlyModule,
  ],
  entryComponents: [
    ...DYNAMIC_COMPONENTS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

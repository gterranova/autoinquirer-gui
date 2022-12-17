import { ModuleWithProviders, NgModule, Provider, SecurityContext } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import {MatFormFieldModule} from '@angular/material/form-field'; 

import { LanguagePipe } from './language.pipe';
import { MarkdownComponent } from './markdown.component';
import { MarkdownPipe } from './markdown.pipe';
import { MarkdownService, SECURITY_CONTEXT } from './markdown.service';
import { MarkdownTypeComponent } from './markdown.type';

import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule, MaterialModule } from '@autoinquirer/shared';

// having a dependency on `HttpClientModule` within a library
// breaks all the interceptors from the app consuming the library
// here, we explicitely ask the user to pass a provider with
// their own instance of `HttpClientModule`
export interface MarkdownModuleConfig {
  loader?: Provider;
  markedOptions?: Provider;
  sanitize?: SecurityContext;
}

const sharedDeclarations = [
  LanguagePipe,
  MarkdownComponent,
  MarkdownPipe,
  MarkdownTypeComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    LMarkdownEditorModule,
    SharedModule, 
    MaterialModule.forChild(),
    FormlyModule.forChild({
      types: [{ name: 'markdown', component: MarkdownTypeComponent }],
    })
  ],
  exports: [...sharedDeclarations, MatFormFieldModule, LMarkdownEditorModule],
  declarations: sharedDeclarations,
})
export class MarkdownModule {
  static forRoot(markdownModuleConfig?: MarkdownModuleConfig): ModuleWithProviders<MarkdownModule> {
    return {
      ngModule: MarkdownModule,
      providers: [
        MarkdownService,
        markdownModuleConfig && markdownModuleConfig.loader || [],
        markdownModuleConfig && markdownModuleConfig.markedOptions || [],
        {
          provide: SECURITY_CONTEXT,
          useValue: markdownModuleConfig && markdownModuleConfig.sanitize != null
            ? markdownModuleConfig.sanitize
            : SecurityContext.HTML,
        }
      ],
    };
  }

  static forChild(): ModuleWithProviders<MarkdownModule> {
    return {
      ngModule: MarkdownModule,
    };
  }
}

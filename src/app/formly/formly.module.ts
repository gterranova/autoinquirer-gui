import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MarkdownModule } from 'ngx-markdown';

import { NullTypeComponent } from './null.type';
import { ArrayTypeComponent } from './array.type';
import { ObjectTypeComponent } from './object.type';
import { MultiSchemaTypeComponent } from './multischema.type';
import { LinkTypeComponent } from './link.type';
import { MaterialModule } from '../material/material.module';
import { AppRoutingModule } from '../app-routing.module';
import { FormlyWrapperFormFieldLink } from './form-field-link.wrapper';
import { AccordionWrapperComponent } from './accordion.wrapper';
import { MarkdownTypeComponent } from './markdown.type';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { FormsModule } from '@angular/forms';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FilesystemWrapperComponent } from './filesystem.wrapper';

export function minItemsValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT have fewer than ${field.templateOptions.minItems} items`;
}

export function maxItemsValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT have more than ${field.templateOptions.maxItems} items`;
}

export function minlengthValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT be shorter than ${field.templateOptions.minLength} characters`;
}

export function maxlengthValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT be longer than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field: FormlyFieldConfig) {
  return `should be >= ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field: FormlyFieldConfig) {
  return `should be <= ${field.templateOptions.max}`;
}

export function multipleOfValidationMessage(err, field: FormlyFieldConfig) {
  return `should be multiple of ${field.templateOptions.step}`;
}

export function exclusiveMinimumValidationMessage(err, field: FormlyFieldConfig) {
  return `should be > ${field.templateOptions.step}`;
}

export function exclusiveMaximumValidationMessage(err, field: FormlyFieldConfig) {
  return `should be < ${field.templateOptions.step}`;
}

export function constValidationMessage(err, field: FormlyFieldConfig) {
  return `should be equal to constant "${field.templateOptions.const}"`;
}

export function serverValidationMessage(err) {
  return err;
}

@NgModule({
  declarations: [
    ArrayTypeComponent,
    ObjectTypeComponent,
    MultiSchemaTypeComponent,
    NullTypeComponent,
    LinkTypeComponent,
    FormlyWrapperFormFieldLink,
    AccordionWrapperComponent,
    MarkdownTypeComponent,
    FilesystemWrapperComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    FormlyModule.forRoot({
        validationMessages: [
          { name: 'required', message: 'This field is required' },
          { name: 'null', message: 'should be null' },
          { name: 'minlength', message: minlengthValidationMessage },
          { name: 'maxlength', message: maxlengthValidationMessage },
          { name: 'min', message: minValidationMessage },
          { name: 'max', message: maxValidationMessage },
          { name: 'multipleOf', message: multipleOfValidationMessage },
          { name: 'exclusiveMinimum', message: exclusiveMinimumValidationMessage },
          { name: 'exclusiveMaximum', message: exclusiveMaximumValidationMessage },
          { name: 'minItems', message: minItemsValidationMessage },
          { name: 'maxItems', message: maxItemsValidationMessage },
          { name: 'uniqueItems', message: 'should NOT have duplicate items' },
          { name: 'const', message: constValidationMessage },
          { name: 'server-error', message: serverValidationMessage },
        ],
        types: [
          { name: 'string', extends: 'input' },
          {
            name: 'number',
            extends: 'input',
            defaultOptions: {
              templateOptions: {
                type: 'number',
              },
            },
          },
          {
            name: 'integer',
            extends: 'input',
            defaultOptions: {
              templateOptions: {
                type: 'number',
              },
            },
          },
          { name: 'boolean', extends: 'checkbox' },
          { name: 'enum', extends: 'select' },
          { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
          { name: 'array', component: ArrayTypeComponent, wrappers: ['accordion'] },
          { name: 'object', component: ObjectTypeComponent, wrappers: ['accordion'] },
          { name: 'multischema', component: MultiSchemaTypeComponent },
          { name: 'link', component: LinkTypeComponent },
          { name: 'markdown', component: MarkdownTypeComponent }
        ],
        wrappers: [
          { name: 'form-field-link', component: FormlyWrapperFormFieldLink },
          { name: 'accordion', component: AccordionWrapperComponent },
          { name: 'filesystem', component: FilesystemWrapperComponent }
        ],
      }),
      FormlyMaterialModule,
      FormlyMatDatepickerModule,
      MarkdownModule.forChild(),
      LMarkdownEditorModule
  ],
  exports: [
    FormlyModule,
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    MaterialModule,
    MarkdownModule,
    LMarkdownEditorModule
  ]
})
export class JsonFormlyModule { }

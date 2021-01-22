import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';

import { formlyConfig } from './formly.config';

import { MaterialModule } from '../material/material.module';

import { NullTypeComponent } from './types/null.type';
import { ArrayTypeComponent } from './types/array.type';
import { ObjectTypeComponent } from './types/object.type';
import { MultiSchemaTypeComponent } from './types/multischema.type';
import { LinkTypeComponent } from './types/link.type';
import { ButtonTypeComponent } from './types/button.type';
import { FormlyWrapperFormFieldLink } from './wrappers/form-field-link.wrapper';
import { CardWrapperComponent } from './wrappers/card.wrapper';
import { AccordionWrapperComponent } from './wrappers/accordion.wrapper';
import { FilesystemWrapperComponent } from './wrappers/filesystem.wrapper';
import { GroupsWrapperComponent } from './wrappers/groups.wrapper';
import { NgxMaskModule } from 'ngx-mask';
import { FormlyFieldMaskedInput } from './types/masked-input.type';

@NgModule({
  declarations: [
    ArrayTypeComponent,
    ObjectTypeComponent,
    MultiSchemaTypeComponent,
    NullTypeComponent,
    LinkTypeComponent,
    ButtonTypeComponent,
    FormlyWrapperFormFieldLink,
    CardWrapperComponent,
    AccordionWrapperComponent,
    FilesystemWrapperComponent,
    GroupsWrapperComponent,
    FormlyFieldMaskedInput,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FormlyModule.forRoot(formlyConfig),
      FormlyMaterialModule,
      NgxMaskModule.forRoot(),
      FormlyMatDatepickerModule,
  ],
  exports: [
    FormlyModule,
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    MaterialModule,
  ]
})
export class FormlyJsonModule { }

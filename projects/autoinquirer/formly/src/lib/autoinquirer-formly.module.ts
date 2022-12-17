import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';

import { formlyConfig } from './formly.config';

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
import { DragAndDropAreaDirective } from './directives/drag-and-drop-area.directive';
import { ArrayPushDirective } from './directives/array-push.directive';
import { ArrayDeleteDirective } from './directives/array-item-delete.directive';
import { FieldActionDirective } from './directives/field-action.directive';
import { SafePipe } from './safe.pipe';

import { DynamicComponentConfig, DYNAMIC_COMPONENT_CONFIG } from '@autoinquirer/shared';
import { DynamicComponentConfigOption, SharedModule, MaterialModule } from '@autoinquirer/shared';

import { AutoinquirerFormComponent } from './components/autoinquirer-form.component';
import { FileTypeComponent } from './types/file.type';
import { FileValueAccessor } from './directives/file-value-accessor';

export function defaultDynamicComponentConfig(): DynamicComponentConfigOption {
  return {
    types: [
      { name: 'form', component: AutoinquirerFormComponent },
    ]
  };
}

const DYNAMIC_COMPONENTS = [
  AutoinquirerFormComponent,
];

@NgModule({
  declarations: [
    SafePipe,
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
    DragAndDropAreaDirective,
    ArrayPushDirective,
    ArrayDeleteDirective,
    FieldActionDirective,
    FileTypeComponent,
    FileValueAccessor,
    ...DYNAMIC_COMPONENTS,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(formlyConfig),
    FormlyMaterialModule,
    NgxMaskModule.forRoot(),
    FormlyMatDatepickerModule,
    SharedModule,
    MaterialModule.forChild(),
  ],
  entryComponents: [
    ...DYNAMIC_COMPONENTS,
  ],
  exports: [
    FormlyModule,
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    ...DYNAMIC_COMPONENTS,
  ]
})
export class AutoinquirerFormlyModule { 
  
  static forRoot(config: DynamicComponentConfigOption = {}): ModuleWithProviders<AutoinquirerFormlyModule> {
    return {
      ngModule: AutoinquirerFormlyModule,
      providers: [
        { provide: DYNAMIC_COMPONENT_CONFIG, multi: true, useFactory: defaultDynamicComponentConfig, deps: [DynamicComponentConfig] },
        { provide: DYNAMIC_COMPONENT_CONFIG, useValue: config, multi: true },
      ]
    };
  }

  constructor(@Inject(DynamicComponentConfig) configService: DynamicComponentConfig, @Optional() @Inject(DYNAMIC_COMPONENT_CONFIG) configs: DynamicComponentConfigOption[] = []) {
    if (!configs) {
      configService.addConfig(defaultDynamicComponentConfig());
      return;
    }

    configs.forEach((config) => configService.addConfig(config));
  }

}

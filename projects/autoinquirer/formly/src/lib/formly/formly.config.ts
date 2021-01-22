import { ConfigOption, FormlyFieldConfig } from '@ngx-formly/core';

import { AbstractControl, ValidationErrors } from '@angular/forms';
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
import { FormlyFieldMaskedInput } from './types/masked-input.type';
import { GroupsWrapperComponent } from './wrappers/groups.wrapper';
//import { MarkdownTypeComponent } from '../markdown/markdown.type';

export function minItemsValidationMessage(err: any, field: FormlyFieldConfig) {
  return `should NOT have fewer than ${field.templateOptions?.minItems} items`;
}

export function maxItemsValidationMessage(err: any, field: FormlyFieldConfig) {
  return `should NOT have more than ${field.templateOptions?.maxItems} items`;
}

export function minlengthValidationMessage(err: any, field: FormlyFieldConfig) {
  return `should NOT be shorter than ${field.templateOptions?.minLength} characters`;
}

export function maxlengthValidationMessage(err: any, field: FormlyFieldConfig) {
  return `should NOT be longer than ${field.templateOptions?.maxLength} characters`;
}

export function minValidationMessage(err: any, field: FormlyFieldConfig) {
  return `should be >= ${field.templateOptions?.min}`;
}

export function maxValidationMessage(err: any, field: FormlyFieldConfig) {
  return `should be <= ${field.templateOptions?.max}`;
}

export function multipleOfValidationMessage(err: any, field: FormlyFieldConfig) {
  return `should be multiple of ${field.templateOptions?.step}`;
}

export function exclusiveMinimumValidationMessage(err: any, field: FormlyFieldConfig) {
  return `should be > ${field.templateOptions?.step}`;
}

export function exclusiveMaximumValidationMessage(err: any, field: FormlyFieldConfig) {
  return `should be < ${field.templateOptions?.step}`;
}

export function constValidationMessage(err: any, field: FormlyFieldConfig) {
  return `should be equal to constant "${field.templateOptions?.const}"`;
}

export function patternValidationMessage(err: any, field: FormlyFieldConfig) {
  return `"${err.actualValue}" does not match with required pattern "${err.requiredPattern}"`;
}

export function serverValidationMessage(err: any) {
  return err;
}

export function fieldMatchValidator(control: AbstractControl) {
  const { password, passwordConfirm } = control.value;

  // avoid displaying the message error when values are empty
  if (!passwordConfirm || !password) {
    return null;
  }

  if (passwordConfirm === password) {
    return null;
  }

  return { fieldMatch: { message: 'Password Not Matching' } };
}

export function emailValidator(control: AbstractControl): ValidationErrors {
  return !control.value || /[A-Za-z0-9]+@([A-Za-z0-9]+\.)+[A-Za-z0-9]+/.test(control.value) ? null : 
    { 'email': { message: `"${control.value}" is not a valid email address`} };
}

export const formlyConfig : ConfigOption = {
    validators: [
      { name: 'fieldMatch', validation: fieldMatchValidator },
      { name: 'email', validation: emailValidator },
    ],
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
      { name: 'pattern', message: patternValidationMessage },
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
      {
        name: 'password',
        extends: 'input',
        defaultOptions: {
          templateOptions: {
            type: 'password',
          },
        },
      },
      {
        name: 'email',
        extends: 'input',
        defaultOptions: {
          templateOptions: {
            type: 'email',
          },
          validators: {
            validation: ['email'],
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
      { name: 'button', component: ButtonTypeComponent },
      { name: 'masked-input', component: FormlyFieldMaskedInput, wrappers: ['form-field'] },
      //{ name: 'markdown', component: MarkdownTypeComponent },
    ],
    wrappers: [
      { name: 'form-field-link', component: FormlyWrapperFormFieldLink },
      { name: 'accordion', component: AccordionWrapperComponent },
      { name: 'card', component: CardWrapperComponent},
      { name: 'filesystem', component: FilesystemWrapperComponent },
      { name: 'groups', component: GroupsWrapperComponent },
    ],
};


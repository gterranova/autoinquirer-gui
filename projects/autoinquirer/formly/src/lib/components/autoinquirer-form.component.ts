import { Component, OnInit } from '@angular/core';
import { PromptComponent, PromptCallbackType, Action, IProperty } from '@autoinquirer/shared';
import { FormGroup } from '@angular/forms';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { debounceTime, skip, filter, startWith, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';

@Component({
  selector: 'app-autoinquirer-form',
  template: `<form [formGroup]="form"><formly-form [form]="form" [fields]="fields" [model]="prompt.model"></formly-form></form><br />`,
  styles: [`
  :host {
    display: block;
    margin: 0 100px;
    /*border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 5px; */
  }

  form {
      margin: 10px;
  }

  mat-list-item.disabled{
      cursor: not-allowed !important;
      opacity: 0.5;
      text-decoration: none;
  }`]
})
export class AutoinquirerFormComponent implements PromptComponent, OnInit {
  prompt: any = {};
  fields: FormlyFieldConfig[] = [];
  lastValues: any;
  callback: PromptCallbackType;

  form = new FormGroup({});

  fieldMap(form: FormGroup) {
    return (mappedField: FormlyFieldConfig, mapSource: any) => {
      if (!mappedField.templateOptions) { mappedField.templateOptions = {}; }
      mappedField.templateOptions.disabled = mappedField.templateOptions.disabled || mapSource.readOnly;
      if (mappedField.templateOptions.groupBy) {
        const groupField = mappedField.templateOptions.groupBy;
        mappedField.hooks = {
          onInit: field => {
            if (field) {
              if (!field.templateOptions) { field.templateOptions = {}; }
              const selectOptionsData = [...(<any[]>mappedField.templateOptions?.options || [])];
              const depField = form.get(groupField);
              field.templateOptions.options = depField?.valueChanges.pipe(
                startWith(depField.value),
                map(depFieldId => selectOptionsData.filter(o => o[`${groupField}Id`] === depFieldId)),
                tap((options) => {
                  const optionValues = options.map(o => o.value);
                  if (field.templateOptions.multiple) {
                    const currentValue: string[] = field.formControl?.value || [];
                    field.formControl?.setValue(currentValue.filter( v => _.includes(optionValues, v)));
                  } else if (!_.includes(optionValues, field.formControl?.value)) {
                    form.markAsDirty();
                    field.formControl?.setValue("");
                  }
                })
              );
            }
          },
        };
      }
      return mappedField;
    };
  }

  //onSubmit(v: any) {
    //console.log(v);
  //}

  constructor(private formlyJsonschema: FormlyJsonschema) { }

  private compactValues(myObj: any, excludeSameFrom: any = {}, schema: any = {}): any {
    if (myObj instanceof FileList) {
      const isEqual = myObj.length == excludeSameFrom.length && _.every(_.map(myObj, (x, idx) => _.isEqual(_.pick(x, ['name', 'size']), _.pick(excludeSameFrom[idx], ['name', 'size']))));
      if (!isEqual) {
        return _.map(myObj, x => {return {..._.pick(x, ['name', 'size']), file: x}});
      }
    } else if (_.isArray(myObj)) {
      return _.map(myObj, (o, idx) => this.compactValues(o, excludeSameFrom[idx], schema.items));
    } else if (myObj instanceof Date || myObj._isAMomentObject) {
      return myObj.toISOString();
    } else if (_.isObject(myObj)) {
      return _.chain(_.keys(myObj)).map(key => {
        if (schema.required && _.includes(schema.required, key)) {
          return [key, myObj[key]];
        }
        if (key[0] !== '_' && myObj[key] !== null && !(myObj[key] instanceof File) && !_.isEqual(excludeSameFrom[key], myObj[key])) {
          return [key, this.compactValues(myObj[key], excludeSameFrom[key], schema.properties?.[key])];
        }
        return;
      }).filter().fromPairs().value()
    }
    return myObj;
  }

  private cleanFormData(obj: any, last: any, schema: IProperty, path: string) {
    last = last || {};
    return _.chain(obj).map((value, key: string) => {
      if (schema.required?.length && _.includes(schema.required, key)) {
        return [key, value];
      }
      if (!_.isArray(value) && _.isObject(value)) {
        value = this.cleanFormData(value, last[key], <IProperty>schema.properties?.[key], path + '/' + key);
        if (Object.keys(value).length === 0) {
          return;
        }
      } else {
        let testProperty = <any>schema.properties?.[key];
        if ((testProperty?.type === 'string' || testProperty?.type === 'array') &&
          testProperty?.widget?.formlyConfig?.type === 'select') {
          this.callback('request', Action.SET, path + '/' + key, value).toPromise();
          last[key] = value;
          return;
          //this.promptService.request(Action.SET, path+'/'+key, value).toPromise();
        }
        if (testProperty?.type === 'file' && value.length) {
          const formData: FormData = new FormData();
          for (let i=0;i<value.length;i++) {
            const fileToUpload = value[i].file;
            formData.append('file', fileToUpload, fileToUpload.name);
          }
          this.callback('request', Action.UPLOAD, _.compact([path, key]).join('/'), formData, { /* do: 'formly' */ }).toPromise().then(response => {
            last[key] = response.body;
          });
          return;
        }
      }
      return [key, value];
    }).filter().fromPairs().value();
  }

  async handleUpdate(selectedValue) {
    let cleaned = this.cleanFormData(this.compactValues(selectedValue, this.lastValues, this.prompt.schema), this.lastValues, this.prompt.schema, this.prompt.path);
    if (this.callback && Object.keys(cleaned).length > 0) {
      this.callback('request', Action.UPDATE, this.prompt.path, cleaned).subscribe(
        newValue => {
          const compact = this.compactValues(_.pick(newValue, _.keys(cleaned)), this.lastValues, this.prompt.schema);
          cleaned = this.cleanFormData(compact, this.lastValues, this.prompt.schema, this.prompt.path);
          this.form.patchValue(cleaned, { emitEvent: false });
          this.lastValues = _.merge(this.lastValues, cleaned);
        },
        ({ error }) => {
          console.log(error)
          if (error.ajv) {
            _.each(error.errors, validationError => {
              const fieldPath = validationError.dataPath?.replace(/^\./, '');
              if (!fieldPath) {
                this.form.setErrors({ 'server-error': validationError.message })
              } else {
                this.form.get(fieldPath)?.setErrors({ 'server-error': validationError.message });
              }
              //console.log(this.form, this.form.get(fieldPath));
            })
          }
        }
      );
    }
    this.lastValues = _.merge(this.lastValues, cleaned);
  }

  ngOnInit() {
    this.fields = [this.formlyJsonschema.toFieldConfig(this.prompt.schema, { map: this.fieldMap(this.form) })];
    this.lastValues = this.compactValues(this.prompt.model, {}, this.prompt.schema);
    if (this.prompt.schema.type === 'object') {
      this.form.valueChanges.pipe(skip(1), filter(() => this.form.valid), debounceTime(1000)).subscribe({ next: this.handleUpdate.bind(this) });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { PromptComponent, IServerResponse, Action, IProperty } from '../../models';
import { FormGroup } from '@angular/forms';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { debounceTime, skip, filter, startWith, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { PromptService } from '../../prompt.service';
import { Moment } from 'moment';

@Component({
  selector: 'app-autoinquirer-form',
  templateUrl: './autoinquirer-form.component.html',
  styleUrls: ['./autoinquirer-form.component.scss']
})
export class AutoinquirerFormComponent implements PromptComponent, OnInit {
  prompt: any = {};
  fields: FormlyFieldConfig[] = [];
  lastValues: any;

  form = new FormGroup({});

  fieldMap(form: FormGroup) {
    return (mappedField: FormlyFieldConfig, mapSource: any) => {
      if (!mappedField.templateOptions) { mappedField.templateOptions = {}; }
      mappedField.templateOptions.disabled = mappedField.templateOptions.disabled || mapSource.readOnly;
      if (mappedField.templateOptions.groupBy) {
        const groupField = mappedField.templateOptions.groupBy;
        mappedField.hooks =  {
          onInit: field => {
            if (field) {
              if (!field.templateOptions) { field.templateOptions = {}; }
              const selectOptionsData = [...(<any[]>mappedField.templateOptions?.options || []) ];
              const depField = form.get(groupField);
              field.templateOptions.options = depField?.valueChanges.pipe(
                startWith(depField.value),
                map(depFieldId => selectOptionsData.filter(o => o[`${groupField}Id`] === depFieldId)),
                tap((options) => {
                  _.includes(options.map(o => o.value), field.formControl?.value) || field.formControl?.setValue(null)
                })
              );
            }
          },
        };
      }
      return mappedField;
    };
  }

  onSubmit(v: any) {
    console.log(v);
  }  

  constructor(private formlyJsonschema: FormlyJsonschema, private promptService: PromptService) { }

  private compactValues(myObj: any, excludeSameFrom: any = {}, required: string[] = []): any {
    if (_.isArray(myObj)) {
      return _.map(myObj, (o, idx) => this.compactValues(o, excludeSameFrom[idx]) );
    } else if (myObj instanceof Date || myObj._isAMomentObject) {
      return myObj.toISOString();
    } else if (_.isObject(myObj)) {
      return _.chain(myObj).map( (value, key) => {
        if (required && _.includes(required, key)) {
          return [key, value];
        }
        if (key !== undefined && key[0] !== '_' && value !== null && !_.isEqual(excludeSameFrom[key], value)) {
          return [key, this.compactValues(value, excludeSameFrom[key])];
        }
        return;
      }).filter().fromPairs().value()
    }
    return myObj;
  }

  private cleanFormData(obj: any, last: any, schema: IProperty, path: string) {
    last = last || {};
    return _.chain(obj).map( (value, key: string) => {
      if (schema.required?.length && _.includes(schema.required, key)) {
        return [key, value];
      }
      if (!_.isArray(value) && _.isObject(value)) {
        value = this.cleanFormData(value, last[key], <IProperty>schema.properties?.[key], path+'/'+key);
        if (Object.keys(value).length===0) {
          return;
        }
      } else {
        let testProperty = <any>schema.properties?.[key];
        if ((testProperty?.type === 'string' || testProperty?.type === 'array') && 
              testProperty?.widget?.formlyConfig?.type === 'select') {
          this.promptService.request(Action.SET, path+'/'+key, value).toPromise();
          last[key] = value;
          return;
        }
      }
      return [key, value];
    }).filter().fromPairs().value();        
  }

  ngOnInit() {
    this.fields = [this.formlyJsonschema.toFieldConfig(this.prompt.schema, { map: this.fieldMap(this.form) })];
    this.lastValues = this.compactValues(this.prompt.model, {}, this.prompt.schema.required);
    if (this.prompt.schema.type === 'object') {
      this.form.valueChanges.pipe(skip(1), filter( () => this.form.valid), debounceTime(1000)).subscribe(async selectedValue => {
        let cleaned = this.cleanFormData(this.compactValues(selectedValue, this.lastValues, this.prompt.schema.required), this.lastValues, this.prompt.schema, this.prompt.path);
        if (Object.keys(cleaned).length>0) {
          this.promptService.request(Action.UPDATE, this.prompt.path, cleaned).subscribe(
            newValue => {
              const compact = this.compactValues(_.pick(newValue, _.keys(cleaned)), this.lastValues, this.prompt.schema.required);
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
                    this.form.setErrors({'server-error': validationError.message })
                  } else {
                    this.form.get(fieldPath)?.setErrors({'server-error': validationError.message });
                  }
                  //console.log(this.form, this.form.get(fieldPath));
                })
              }
            }
          );
        }
        this.lastValues = _.merge(this.lastValues, cleaned);
      });  
    }
  }

}

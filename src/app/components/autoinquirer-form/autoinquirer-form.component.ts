import { Component, OnInit } from '@angular/core';
import { PromptComponent, IServerResponse, Action, IProperty } from 'src/app/models';
import { FormGroup } from '@angular/forms';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { debounceTime, skip, filter } from 'rxjs/operators';

import * as _ from 'lodash';
import { PromptService } from 'src/app/prompt.service';
import { Moment } from 'moment';

@Component({
  selector: 'app-autoinquirer-form',
  templateUrl: './autoinquirer-form.component.html',
  styleUrls: ['./autoinquirer-form.component.scss']
})
export class AutoinquirerFormComponent implements PromptComponent, OnInit {
  prompt: IServerResponse;
  fields: FormlyFieldConfig[];
  lastValues: any;

  form = new FormGroup({});

  fieldMap(mappedField: FormlyFieldConfig, mapSource: any) : FormlyFieldConfig {
    mappedField.templateOptions.disabled = mapSource.disabled;
    return mappedField;
  }

  onSubmit(v) {
    console.log(v);
  }  

  constructor(private formlyJsonschema: FormlyJsonschema, private promptService: PromptService) { }

  private compactValues(myObj, excludeSameFrom = {}) {
    if (_.isArray(myObj)) {
      return _.map(myObj, (o, idx) => this.compactValues(o, excludeSameFrom[idx]) );
    } else if (myObj instanceof Date || myObj._isAMomentObject) {
      return myObj.toISOString();
    } else if (_.isObject(myObj)) {
      return _.chain(myObj).map( (value, key) => {
        if (key !== undefined && key[0] !== '_' && value !== null && !_.isEqual(excludeSameFrom[key], value)) {
          return [key, this.compactValues(value, excludeSameFrom[key])];
        }
        return;
      }).filter().fromPairs().value()
    }
    return myObj;
  }

  private cleanFormData(obj, last: any, schema: IProperty, path: string) {
    last = last || {};
    return _.chain(obj).map( (value, key) => {
      if (!_.isArray(value) && _.isObject(value)) {
        value = this.cleanFormData(value, last[key], <IProperty>schema.properties[key], path+'/'+key);
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
    this.fields = [this.formlyJsonschema.toFieldConfig(this.prompt.schema, { map: this.fieldMap })];
    this.lastValues = this.compactValues(this.prompt.model);
    if (this.prompt.schema.type === 'object') {
      this.form.valueChanges.pipe(skip(1), filter( () => this.form.valid), debounceTime(1000)).subscribe(async selectedValue => {
        let cleaned = this.cleanFormData(this.compactValues(selectedValue, this.lastValues), this.lastValues, this.prompt.schema, this.prompt.path);
        if (Object.keys(cleaned).length>0) {
          this.promptService.request(Action.UPDATE, this.prompt.path, cleaned).subscribe(
            newValue => {
              const compact = this.compactValues(_.pick(newValue, _.keys(cleaned)), this.lastValues);
              cleaned = this.cleanFormData(compact, this.lastValues, this.prompt.schema, this.prompt.path);
              this.form.patchValue(cleaned, { emitEvent: false });
              this.lastValues = _.merge(this.lastValues, cleaned);
            },
            ({ error }) => {
              if (error.ajv) {
                _.each(error.errors, validationError => {
                  const fieldPath = validationError.dataPath.replace(/^\./, '');
                  this.form.get(fieldPath).setErrors({'server-error': validationError.message });
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

import { Component, OnInit } from '@angular/core';
import { PromptComponent, IServerResponse, Action, IProperty } from 'src/app/models';
import { FormGroup } from '@angular/forms';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { debounceTime, skip } from 'rxjs/operators';

import * as _ from 'lodash';
import { PromptService } from 'src/app/prompt.service';

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

  private cleanFormData(obj, last: any, schema: IProperty, path: string) {
    last = last || {};
    const filteredOut = _.clone(obj);
    Object.keys(obj).forEach(key => {  
      // if key has a period, replace all occurences with an underscore
      if (key[0] === '_') {
        delete filteredOut[key];
      } else if (!_.isArray(filteredOut[key]) && _.isObject(filteredOut[key])) {
        filteredOut[key] = this.cleanFormData(filteredOut[key], last[key], <IProperty>schema.properties[key], path+'/'+key);
        if (!Object.keys(filteredOut[key]).length) {
          delete filteredOut[key];
        }
      } else {
        let testProperty = <any>schema.properties?.[key];
        //console.log(key, testProperty)
        if ((testProperty?.type === 'string' || testProperty?.type === 'array') && 
              testProperty?.widget?.formlyConfig?.type === 'select' && !_.isEqual(obj[key], last[key]) ) {
          this.promptService.request(Action.SET, path+'/'+key, filteredOut[key]).toPromise();
          last[key] = filteredOut[key];
          delete filteredOut[key];
        }
        if (_.isEqual(obj[key], last[key])) {
          delete filteredOut[key];
        }
      }
    });
    return filteredOut;
  }

  ngOnInit() {
    this.fields = [this.formlyJsonschema.toFieldConfig(this.prompt.schema, { map: this.fieldMap })];
    this.lastValues = _.clone(this.prompt.model);
    if (this.prompt.schema.type === 'object') {
      this.form.valueChanges.pipe(skip(1), debounceTime(1000)).subscribe(async selectedValue => {
        const cleaned = this.cleanFormData(selectedValue, this.lastValues, this.prompt.schema, this.prompt.path);
          if (Object.keys(cleaned).length>0) {
            console.log(cleaned)
            await this.promptService.request(Action.UPDATE, this.prompt.path, cleaned).toPromise();
          }
          this.lastValues = { ...this.lastValues, ...cleaned};  
      });  
    }
  }

}

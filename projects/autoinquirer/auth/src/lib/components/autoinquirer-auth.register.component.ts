import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromptComponent, IServerResponse, PromptCallbackType } from '@autoinquirer/shared';
import { AuthService } from '../services/auth.service';
import { FormGroup } from '@angular/forms';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { startWith, map, tap } from 'rxjs/operators';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { NewUser } from '../models';

@Component({
  selector: 'app-autoinquirer-auth-register',
  template: `<div class="signin-content">
  <mat-card>
  <mat-card-header>
    <mat-card-title>{{ prompt.schema.title }}</mat-card-title>
    <mat-card-subtitle></mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
  <form name="form" [formGroup]="form" novalidate>
    <formly-form [form]="form" [fields]="fields" [model]="user"></formly-form>
  </form>
  </mat-card-content>
  <mat-card-actions>
    <button mat-raised-button class="mat-primary full-width" (click)="register()" [disabled]="loading||!canSubmit()">
      Sign Up
    </button>
  </mat-card-actions>  
</mat-card></div>`,
  styles: [`:host {
    display: block;
    margin: 0 100px;
    /*border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 5px; */
  }
  mat-card {
    max-width: 400px;
    margin: 2em auto;
    text-align: center;
  }
  .signin-content {
    padding: 60px 1rem;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoinquirerAuthRegisterComponent implements PromptComponent, OnInit {
  prompt: any = {};
  user: NewUser = { email: '', password: '', passwordConfirm: ''};
  loading = false;
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  callback: PromptCallbackType;
  
  constructor(
      private formlyJsonschema: FormlyJsonschema,
      public dialog: MatDialog,
      private authService: AuthService,
      protected router: Router,
      private cdref: ChangeDetectorRef
    ) { }

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

  ngOnInit() {
    this.fields = [{
      validators: {
        validation: [
          { name: 'fieldMatch', options: { errorPath: 'passwordConfirm' } },
        ],
      },
      ...this.formlyJsonschema.toFieldConfig(this.prompt.schema, { map: this.fieldMap(this.form) })
    }];
  }

  register() {
    this.authService.register(this.user).subscribe(
      (result: boolean) => {
        if (result === true) {
          this.router.navigate(['/' || this.prompt.path]);
        }
      },
      (response: any)=> {
        //console.log(response.error.errors.map(e => e.message).join('\n'));
        response.error.errors.map(e => this.form/*.get('email')*/.setErrors({ 'server-error': e }))
        this.loading = false;
        this.cdref.detectChanges();
      }
    );
  }

  canSubmit() {
    return (
      !!this.user.email &&
      !!this.user.password && (this.user.password === this.user.passwordConfirm) &&
      this.form.valid
    );
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

}

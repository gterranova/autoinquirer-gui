import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromptComponent, IServerResponse, PromptCallbackType } from '@autoinquirer/shared';
import { AuthService } from '../services/auth.service';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { startWith, map, tap } from 'rxjs/operators';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { User } from '../models';

@Component({
  selector: 'app-autoinquirer-auth-login',
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
    <button mat-raised-button class="mat-primary full-width" (click)="login()" [disabled]="loading||!canSubmit()">
      Log In
    </button>
    <button mat-button (click)="openForgotPasswordDialog()">Forgot Password?</button>
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
export class AutoinquirerAuthLoginComponent implements PromptComponent, OnInit {
  prompt: any = {};
  user: User = { email: '', password: '' };
  loading = false;
  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[] = [];
  callback: PromptCallbackType;
  
  constructor(
      private formlyJsonschema: FormlyJsonschema,
      public dialog: MatDialog,
      private authService: AuthService,
      protected router: Router,
      private cdref: ChangeDetectorRef
    ) { }

  fieldMap(form: UntypedFormGroup) {
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
    this.fields = [this.formlyJsonschema.toFieldConfig(this.prompt.schema, { map: this.fieldMap(this.form) })];
  }

  login() {
    this.authService.login(this.user).subscribe(
      (result: boolean) => {
        if (result === true) {
          this.router.navigate(['/' || this.prompt.path]);
        }
      },
      (response: any)=> {
        response.error.errors.map(e => this.form.setErrors({ 'server-error': e }))
        this.loading = false;
        this.cdref.detectChanges();
      }
    );
  }

  canSubmit() {
    return (
      !!this.user.email &&
      !!this.user.password  &&
      this.form.valid
    );
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  openForgotPasswordDialog(data?: any): Promise<any> {
    const dialogRef = this.dialog.open(ForgotPasswordDialog, {
      width: '40vw',
      maxHeight: '100vh',
      data: data || { title: 'Recover password', okButtonText: 'OK'}
    });

    return dialogRef.afterClosed().toPromise().then( value => console.log(value));
  }

}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'forgot-password-dialog',
  template: `<h1 mat-dialog-title>{{ data.title }}</h1>
  <form name="form" #f="ngForm" novalidate> 
  <div mat-dialog-content>{{ data.message }}
  <p></p>
  <mat-form-field style="width: 100%">
      <input matInput placeholder="Email" type="email" name="email" [(ngModel)]="email" #e="ngModel" required />
      <mat-error *ngIf="e.hasError('email') && !e.hasError('required')" class="help-block">Please enter a valid email address</mat-error>
      <mat-error *ngIf="e.hasError('required')" class="help-block">Email is required</mat-error>
  </mat-form-field>    
  
  </div>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close>{{ data.cancelButtonText }}</button>
    <!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->
    <button mat-button [disabled]="!f.form.valid" [mat-dialog-close]="{result: true, text: email}">{{ data.okButtonText }}</button>
  </div>
  </form>`
})
// tslint:disable-next-line:component-class-suffix
export class ForgotPasswordDialog {
  email: string;

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.email = data.defaultText;
  }

  onNoClick(): void {
    this.dialogRef.close({ result: false });
  }
}

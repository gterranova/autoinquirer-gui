import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromptComponent, IServerResponse } from '../../models';
import { PromptService } from '../../prompt.service';
import { AuthenticationService } from '@ngx-juda/auth';
import { FormGroup } from '@angular/forms';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { startWith, map, tap } from 'rxjs/operators';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-autoinquirer-auth',
  templateUrl: './autoinquirer-auth.component.html',
  styleUrls: ['./autoinquirer-auth.component.scss']
})
export class AutoinquirerAuthComponent implements PromptComponent, OnInit {
  error: string = '';
  prompt: any = {};
  user: { name: string, password: string } = { name: '', password: ''};
  isLoggingIn: boolean;
  loading = false;
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  
  constructor(
      private formlyJsonschema: FormlyJsonschema,
      public dialog: MatDialog,
      private promptService: PromptService, 
      private authService: AuthenticationService,
      protected router: Router
    ) { 
    this.isLoggingIn = true;
    this.authService.currentUser().subscribe( (u: any) => this.user = u.components[1].model );
  }

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
    this.fields = [this.formlyJsonschema.toFieldConfig(this.prompt.schema, { map: this.fieldMap(this.form) })];
  }

  login() {
    this.authService.login(this.user.name, this.user.password).subscribe(
      (result: boolean) => {
        if (result === true) {
          this.router.navigate(['/' || this.prompt.path]);
        }
      },
      (error: any)=> {
        this.alert('Email or password is incorrect');
        this.loading = false;
      }
    );
  }

  logout() {
      this.authService.logout();
      this.router.navigate([this.prompt.path]);
  }

  canSubmit() {
    return (
      !!this.user.name &&
      !!this.user.password
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

  alert(message: string) {
    this.error = message;
  }

}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'forgot-password-dialog',
  templateUrl: './forgot-password.dialog.html'
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

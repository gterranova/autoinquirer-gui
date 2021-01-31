import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { Router } from '@angular/router';

@Component({
  selector: 'formly-wrapper-mat-form-field-link',
  template: `
    <div style="display: flex; flex-direction: row;">
      <div style="flex-grow: 1">
        <ng-container #fieldComponent></ng-container>
      </div>
      <div style="align-self: center;">
        <a *ngIf="resource" mat-button (click)="goToResource()"><mat-icon>open_in_new</mat-icon></a>
        <a *ngIf="path" mat-button (click)="goToPath()"><mat-icon>link</mat-icon></a>
      </div>
    </div>
  `
})
export class FormlyWrapperFormFieldLink extends FieldWrapper {
  constructor(
    private router: Router
  ) {
    super();
  }

  goToPath() {
    this.router.navigate(['/', ...this.path.split('/')]);
  }  

  goToResource() {
    window.open(this.resource, '_blank');
  }  

  get value() { return this.formControl.value; }
  get path() { 
    if (this.to?.options) {
      const options = !Array.isArray(this.to.options) ? [this.to.options] : this.to.options;
      const selectedOption = options.find( (o: any) => o.value == this.value );
      return selectedOption?.path;
    }    
   }
  get resource() { 
    if (this.to?.options) {
      const options = !Array.isArray(this.to.options) ? [this.to.options] : this.to.options;
      const selectedOption = options.find( (o: any) => o.value == this.value );
      return selectedOption?.resourceUrl;
    }    
  }
}

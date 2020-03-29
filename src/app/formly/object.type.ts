import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-object-type',
  template: `
  <mat-accordion>
    <mat-expansion-panel [expanded]="!to.disabled" [disabled]="to.disabled">
      <mat-expansion-panel-header>
        <mat-panel-title>
          <b>{{ to.label }}</b>
        </mat-panel-title>
        <mat-panel-description *ngIf="to.description">
          {{ to.description }}
        </mat-panel-description>
      </mat-expansion-panel-header>

      <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
      <formly-field *ngFor="let f of field.fieldGroup" [field]="f"></formly-field>
    </mat-expansion-panel>
  </mat-accordion>
  <br/>
`,
})
export class ObjectTypeComponent extends FieldType {
  defaultOptions = {
    defaultValue: {},
  };
}

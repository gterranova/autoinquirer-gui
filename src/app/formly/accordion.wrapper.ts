// panel-wrapper.component.ts
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
selector: 'formly-wrapper-accordion',
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
  <ng-container #fieldComponent></ng-container>
 </mat-expansion-panel>
</mat-accordion>
<br/>
`,
})
export class AccordionWrapperComponent extends FieldWrapper {
}
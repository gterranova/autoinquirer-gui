// panel-wrapper.component.ts
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
selector: 'formly-wrapper-card',
template: `
<mat-card>
  <mat-card-header>
    <mat-card-title>{{ to.label | safe:'html' }}</mat-card-title>
    <mat-card-subtitle *ngIf="to.description">{{ to.description | safe:'html' }}</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <ng-container #fieldComponent></ng-container>
  </mat-card-content>
</mat-card>
`,
})
export class CardWrapperComponent extends FieldWrapper {
}
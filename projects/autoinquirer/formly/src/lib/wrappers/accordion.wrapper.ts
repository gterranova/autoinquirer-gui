// panel-wrapper.component.ts
import { AfterViewInit, Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { FormlyService } from '@autoinquirer/shared';

@Component({
selector: 'formly-wrapper-accordion',
template: `
<ng-template #defaultButtons>
  <ng-container *ngFor="let action of to.actions">
    <span fieldAction [field]="field" [action]="action">
      <button mat-button color="primary"><mat-icon>flash_on</mat-icon>&nbsp;{{action}}</button>
    </span>
  </ng-container>
</ng-template>
<ng-template #arrayButtons>
  <ng-container *ngFor="let action of to.actions">
    <span fieldAction [field]="field" [action]="action">
      <button mat-button color="primary"><mat-icon>flash_on</mat-icon>&nbsp;{{action}}</button>
    </span>
  </ng-container>
  <span arrayPush [arrayField]="field"><button *ngIf="!to.readonly" mat-button color="primary"><mat-icon>add</mat-icon>Add new</button></span>
</ng-template>
<!--ng-template #fileButtons>
  <input style="display:none" type="file"
    #fileInput
    (change)="handleFileInput($event.target.files)" multiple >
  <mat-icon class="pointer" (click)="openUploadDialog()">cloud_upload</mat-icon>
</ng-template-->
<mat-accordion>
<mat-expansion-panel [expanded]="to.expanded" [disabled]="to.disabled">
  <mat-expansion-panel-header>
    <mat-panel-title style="align-items: center">
      <b>{{ to.label | safe:'html' }}</b>
    </mat-panel-title> 
    <mat-panel-description>
      <div style="display:flex; width: 100%">
        <span style="flex-grow: 1">{{ to.description | safe:'html' }}&nbsp;</span>
        <ng-container *ngTemplateOutlet="myButtons ? myButtons: defaultButtons"></ng-container>
      </div>
    </mat-panel-description>
  </mat-expansion-panel-header>
  <ng-container #fieldComponent></ng-container>
  <mat-action-row *ngIf="myButtons">
    <ng-container *ngTemplateOutlet="myButtons"></ng-container>
  </mat-action-row>    

 </mat-expansion-panel>
</mat-accordion>
<br/>
`,
})
export class AccordionWrapperComponent extends FieldWrapper implements AfterViewInit {
  @ViewChild('arrayButtons') private arrayButtons: TemplateRef<any>;
  
  myButtons = null;

  constructor(@Inject(FormlyService) private promptService: FormlyService) {
    super();
  }

  ngAfterViewInit(): void {
    if (Array.isArray(this.model)) {
      this.myButtons = this.arrayButtons;
    }
  }

  alert(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    alert(Array.isArray(this.model))
  } 

}
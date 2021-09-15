// panel-wrapper.component.ts
import * as _ from 'lodash';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
selector: 'formly-wrapper-groups',
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
  <span arrayPush [arrayField]="field" (onPushed)="reGroup($event)"><button *ngIf="!to.readonly" mat-button color="primary"><mat-icon>add</mat-icon>Add new</button></span>
</ng-template>
<!--ng-template #fileButtons>
  <input style="display:none" type="file"
    #fileInput
    (change)="handleFileInput($event.target.files)" multiple >
  <mat-icon class="pointer" (click)="openUploadDialog()">cloud_upload</mat-icon>
</ng-template-->
<mat-accordion *ngFor="let group of groupLabels">
<mat-expansion-panel [expanded]="to.expanded" [disabled]="to.disabled">
  <mat-expansion-panel-header>
    <mat-panel-title>
      <b>{{ group | safe:'html' }}</b>
    </mat-panel-title> 
    <mat-panel-description>
      <div style="display:flex; width: 100%">
        <span style="flex-grow: 1">&nbsp;</span>
        <ng-container *ngTemplateOutlet="myButtons ? myButtons: defaultButtons"></ng-container>
      </div>
    </mat-panel-description>
  </mat-expansion-panel-header>
  <formly-field [field]="getField(group)"></formly-field>
 </mat-expansion-panel>
</mat-accordion>
<br/>
`,
changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsWrapperComponent extends FieldWrapper implements OnInit, AfterViewInit {
  @ViewChild('arrayButtons') private arrayButtons: TemplateRef<any>;
  groupLabels: string[];
  groupedArray: any;
  myButtons = null;

  constructor(
    private cdref: ChangeDetectorRef
  ) {
    super();
  }

  ngAfterViewInit(): void {
    if (Array.isArray(this.model)) {
      this.myButtons = this.arrayButtons;
    }
  }

  ngOnInit(): void {
    this.reGroup();
  }

  reGroup(_newItem?: any) {
    this.groupedArray = _.groupBy(this.model, (i, idx) => { i['fieldIdx']=idx; return i[`${this.to.groupBy}Id`] || 'Not specified'; });
    this.groupLabels = _.keys(this.groupedArray);
    this.cdref.detectChanges();
  }

  getField(key: string ): FormlyFieldConfig {
    const config = this.field;
    const newConfig: FormlyFieldConfig = { ...config, model: this.groupedArray[key], fieldGroup: _.map(this.groupedArray[key], o => this.field.fieldGroup[o.fieldIdx]), wrappers: []};
    //console.log(newConfig);
    return newConfig;
  }

}
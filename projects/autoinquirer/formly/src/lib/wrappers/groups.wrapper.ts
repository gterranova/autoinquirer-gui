// panel-wrapper.component.ts
import * as _ from 'lodash';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
selector: 'formly-wrapper-groups',
template: `
<mat-accordion *ngFor="let group of groupLabels">
<mat-expansion-panel [expanded]="to.expanded" [disabled]="to.disabled">
  <mat-expansion-panel-header>
    <mat-panel-title>
      <b>{{ group | safe:'html' }}</b>
    </mat-panel-title> 
  </mat-expansion-panel-header>
  <formly-field [field]="getField(group)"></formly-field>
 </mat-expansion-panel>
</mat-accordion>
<br/>
`,
})
export class GroupsWrapperComponent extends FieldWrapper implements OnInit {
  groupLabels: string[];
  groupedArray: any;

  ngOnInit(): void {
    this.groupedArray = _.groupBy(this.model, (i) => i[`${this.to.groupBy}Id`] || 'Not specified');
    this.groupLabels = _.keys(this.groupedArray);

  }

  getField(key: string ): FormlyFieldConfig {
    const config = this.field;
    const newConfig: FormlyFieldConfig = { ...config, model: this.groupedArray[key], wrappers: []}
    return newConfig;
  }

}
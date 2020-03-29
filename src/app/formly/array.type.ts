import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { PromptService } from 'src/app/prompt.service';
import { Action, Item } from 'src/app/models';
import { of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

@Component({
  selector: 'formly-array-type',
  template: `
  <mat-accordion>
    <mat-expansion-panel [expanded]="topLevel" [disabled]="to.disabled">
      <mat-expansion-panel-header>
        <mat-panel-title>
          <b>{{ to.label }}</b>
        </mat-panel-title> 
        <mat-panel-description *ngIf="to.description">
          {{ to.description }} 
        </mat-panel-description>
      </mat-expansion-panel-header>

      <table style="width: 100%" mat-table [dataSource]="dataSource" class="mat-elevation-z1">
      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef style="width: 100%"> {{ to.label }} </th>
        <td mat-cell *matCellDef="let element" (click)="select(element)" style="cursor: pointer; width: 100%"> {{element.name}} </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> actions </th>
        <td mat-cell *matCellDef="let element; let idx = index"> 
          <button style="width: 32px; height: 32px" mat-mini-fab color="warn" type="button" (click)="delItem(element, idx)" class="mat-elevation-z0">
          <mat-icon style="font-size: 16px;" >delete</mat-icon>
          </button> 
        </td>
      </ng-container>
      <!-- tr mat-header-row *matHeaderRowDef="displayedColumns"></tr -->
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <mat-action-row>
      <button mat-button color="primary" (click)="pushItem($event)"><mat-icon>add</mat-icon>Add new</button>
    </mat-action-row>    
    </mat-expansion-panel>
  </mat-accordion>
  <br/>

  `
})
export class ArrayTypeComponent extends FieldArrayType implements OnInit {
  displayedColumns = ['name', 'actions'];
  dataSource = new BehaviorSubject<{ name: string, path: string}[]>([]);
  topLevel: boolean;

  constructor(private promptService: PromptService) {
    super();
  }
  ngOnInit(): void {
    this.dataSource.next(this.model);
    this.topLevel = !this.field.parent.parent;
  }

  select(selection: any) {
    this.promptService.navigate(selection.path);
  }

  update() {
    return this.promptService.request(Action.GET, this.to.path).pipe( map((data) => {
      for (let formData of (<any>data).components) {
        if (<Item>formData && <Item>formData.model && <Item>formData.schema) {
          this.to.label = (<Item>formData).schema.title;
          this.dataSource.next(formData.model);
          return formData.model;    
        }
      } 
    }));
  }

  pushItem(evt) {
    evt.stopPropagation();

    this.promptService.request(Action.PUSH, this.to.path, {}).subscribe( () => {
      this.update().subscribe(model => this.add(null, model[model.length-1]) );
    });
  }

  delItem(selection: any, i: number, { markAsDirty } = { markAsDirty: true }) {
    if (!selection.disabled) {
      this.promptService.request(Action.DEL, selection.path).pipe( catchError( () => of([]))).subscribe( () => {
        this.update().subscribe(() => this.remove(i) );
      });
    }
  }

}

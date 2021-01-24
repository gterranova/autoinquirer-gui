import { Component, Inject, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { FormlyService } from '../../services/formly.service';
import { Action, IServerResponse } from '../../autoinquirer-formly.models';
import { of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

interface IArrayItem { 
  name: string, 
  path: string
}

@Component({
  selector: 'formly-array-type',
  template: `
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
      <button *ngIf="!to.readonly" mat-button color="primary" (click)="pushItem($event)"><mat-icon>add</mat-icon>Add new</button>
    </mat-action-row>    
  `
})
export class ArrayTypeComponent extends FieldArrayType implements OnInit {
  displayedColumns = ['name', 'actions'];
  dataSource = new BehaviorSubject<IArrayItem[]>([]);
  topLevel: boolean;

  constructor(@Inject(FormlyService) private promptService: FormlyService) {
    super();
  }
  ngOnInit(): void {
    this.dataSource.next(this.model);
    this.displayedColumns = (this.to.readonly)? ['name'] : ['name', 'actions'];
    this.topLevel = !this.field.parent?.parent;
  }

  select(selection: any) {
    this.promptService.navigate(selection.path);
  }

  update() {
    return this.promptService.request(Action.GET, this.to.path, { do: 'formly' }).pipe( map((formData: IServerResponse) => {
      this.to.label = formData.schema.title;
      this.dataSource.next(formData.model);
      this.displayedColumns = (formData.schema.readOnly)? ['name'] : ['name', 'actions'];
      return formData.model;    
    }));
  }

  pushItem(evt: any) {
    evt.stopPropagation();

    this.promptService.request(Action.PUSH, this.to.path, {}).subscribe( () => {
      this.update().subscribe(model => this.add(undefined, model[model.length-1]) );
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

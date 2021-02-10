import { Component, Inject, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { FormlyService } from '@autoinquirer/shared';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

interface IArrayItem { 
  label: string, 
  path: string,
  resourceUrl?: string,
  disabled?: boolean
}

@Component({
  selector: 'formly-array-type',
  template: `
    <table style="width: 100%; margin: 0 -24px" mat-table [dataSource]="dataSource">
      <!-- label Column -->
      <ng-container matColumnDef="label">
        <th mat-header-cell *matHeaderCellDef> {{ to.label | safe:'html' }} </th>
        <td mat-cell *matCellDef="let element" (click)="select(element)" style="cursor: pointer; width: 100%"> {{element.label | safe:'html'}} </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> actions </th>
        <td mat-cell *matCellDef="let element; let idx = index"> 
          <div style="display: flex; flex-direction: row-reverse;">
            <span arrayDelete [arrayField]="field" [arrayIndex]="idx" (onDeleted)="remove($event)">
            <button mat-button color="warn" type="button">
              <mat-icon>delete</mat-icon>
            </button> 
            </span>
            <a *ngIf="element.resourceUrl" mat-button (click)="openItem(element, idx)">
              <mat-icon>open_in_new</mat-icon>
            </a> 
          </div>
        </td>
      </ng-container>
      <!-- tr mat-header-row *matHeaderRowDef="displayedColumns"></tr -->
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `
})
export class ArrayTypeComponent extends FieldArrayType implements OnInit {
  displayedColumns = ['label', 'actions'];
  dataSource = new BehaviorSubject<IArrayItem[]>([]);
  topLevel: boolean;

  constructor(@Inject(FormlyService) private promptService: FormlyService) {
    super();
  }
  ngOnInit(): void {
    this.dataSource.next(this.model);
    this.displayedColumns = (this.to.readonly)? ['label'] : ['label', 'actions'];
    this.topLevel = !this.field.parent?.parent;
    this.formControl.valueChanges.pipe( map( (model: IArrayItem[]) => Array.isArray(model)? model : Object.values(model)) )
      .subscribe( (model: IArrayItem[]) => {
        //console.log("model changed", model);
        this.dataSource.next(model);
      });
  }

  select(selection: IArrayItem) {
    this.promptService.navigate(selection.path);
  }

  /*
  update() {
    return this.promptService.request(Action.GET, this.to.path, { do: 'formly' }).pipe( map((formData: IServerResponse) => {
      this.to.label = formData.schema.title;
      this.dataSource.next(formData.model);
      this.displayedColumns = (formData.schema.readOnly)? ['label'] : ['label', 'actions'];
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
  */

  openItem(selection: IArrayItem, i: number, { markAsDirty } = { markAsDirty: true }) {
    if (!selection.disabled) {
      window.open(selection.resourceUrl, '_blank');
      //this.promptService.navigate(selection.path, { do: 'open' });
    }
  }

}

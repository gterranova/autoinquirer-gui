import { Directive, Inject, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Action, IServerResponse, FormlyService } from '@autoinquirer/shared';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Directive({
    selector: '[arrayDelete]'
  })
  export class ArrayDeleteDirective {
    @Input('arrayField') field: FormlyFieldConfig;
    @Input('arrayIndex') idx: number;
    @Output() onDeleted : EventEmitter<number> = new EventEmitter<number>();
     
    constructor(@Inject(FormlyService) private promptService: FormlyService) { }
  
    update() {
      return this.promptService.request(Action.GET, this.to.path, { do: 'formly' }).pipe( map((formData: IServerResponse) => {
        this.to.label = formData.schema.title;
        return formData.model;    
      }));
    }

    // Dragover listener
    @HostListener('click', ['$event']) onClick(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      const selection = this.model[this.idx];
      if (selection && !selection.disabled) {
        //console.log("delete", {selection, idx: this.idx })
        this.promptService.request(Action.DEL, selection.path).pipe( catchError( () => of([]))).subscribe( () => {
            //console.log({model: this.model });
            this.onDeleted?.emit(this.idx);
        });
      }
    }
    
    get to() { return this.field.templateOptions || {}; }  
    get model() { return this.field.model || []; }  
  }
  
  
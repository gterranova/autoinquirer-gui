import { Directive, Inject, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Action, IServerResponse, FormlyService } from '@autoinquirer/shared';
import { map, switchMap } from 'rxjs/operators';

@Directive({
  selector: '[arrayPush]'
})
export class ArrayPushDirective {
  @Input('arrayField') field: FormlyFieldConfig;
  @Output() onPushed: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Inject(FormlyService) private promptService: FormlyService) { }

  update() {
    return this.promptService.request(Action.GET, this.to.path, { do: 'formly' }).pipe(map((formData: IServerResponse) => {
      this.to.label = formData.schema.title;
      return formData.model;
    }));
  }

  // Dragover listener
  @HostListener('click', ['$event']) onClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.promptService.request(Action.PUSH, this.to.path, {})
      .pipe( switchMap( () => this.update() ))
      .subscribe(model => {
        //console.log("should add", model[model.length-1], "to", this.model, (<FieldArrayType>this.field));
        this.model.push(model[model.length - 1]);
        (<any>this.field.options)._buildForm(true);
        this.onPushed?.emit(model[model.length - 1]);
      });
  }

  get to() { return this.field.props || {}; }
  get model() { return this.field.model || []; }
}


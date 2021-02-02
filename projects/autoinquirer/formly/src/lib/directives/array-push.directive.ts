import { Directive, Inject, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Action, IServerResponse, FormlyService } from '@autoinquirer/shared';
import { map } from 'rxjs/operators';

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
    this.promptService.request(Action.PUSH, this.to.path, {}).subscribe(() => {
      this.update().subscribe(model => {
        this.onPushed?.emit(model[model.length - 1]);
        //console.log("should add", model[model.length-1], "to", this.model, (<FieldArrayType>this.field));
        this.model.push(model[model.length - 1]);
        (<any>this.field.options)._buildForm(true);
      });
    });
  }

  get to() { return this.field.templateOptions || {}; }
  get model() { return this.field.model || []; }
}


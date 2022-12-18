import { Directive, Inject, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Action, IServerResponse, FormlyService } from '@autoinquirer/shared';

@Directive({
  selector: '[fieldAction]'
})
export class FieldActionDirective {
  @Input('field') field: FormlyFieldConfig;
  @Input('action') action: string;
  @Output() onExecuted: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Inject(FormlyService) private promptService: FormlyService) { }

  // Dragover listener
  @HostListener('click', ['$event']) onClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.promptService.navigate(this.to.path, { do: this.action });
  }

  get to() { return this.field.props || {}; }
  get model() { return this.field.model || []; }
}


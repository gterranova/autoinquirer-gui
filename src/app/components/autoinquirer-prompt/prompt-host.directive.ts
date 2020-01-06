import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[prompt-host]'
})
export class PromptHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}

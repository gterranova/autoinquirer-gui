import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { PromptService } from 'src/app/prompt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'formly-link-type',
  template: `
    <div class="mb-3">
      <legend *ngIf="to.label">{{ to.label }}</legend>
      <p *ngIf="to.description">{{ to.description }}</p>
      <a (click)="select(field.model[field.key])" >{{field.model[field.key].name }}</a>
    </div>
  `,
})
export class LinkTypeComponent extends FieldType {
  defaultOptions = {
    defaultValue: {},
  };
  constructor(private promptService: PromptService,
    private router: Router) {
    super();
  }

  select(selection: any) {
    console.log(selection)
    if (!selection.disabled) {
      this.router.navigate([...selection.path.split('/')]);
    }
  }
}

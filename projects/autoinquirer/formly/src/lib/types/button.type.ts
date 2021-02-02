import { Component, Inject } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Router } from '@angular/router';
import { FormlyService } from '@autoinquirer/shared';

function absolute(testPath: string, absolutePath: string): string {
  if (testPath && testPath[0] !== '.') { return testPath; }
  if (!testPath) { return absolutePath; }
  const p0 = absolutePath.split('/');
  const rel = testPath.split('/');
  while (rel.length) {
      const t = rel.shift();
      if (t === '.') { continue; }
      else if (t === '..') {
          if (!p0.length) {
              continue;
          }
          p0.pop();
      } else { p0.push(t) }
  }

  return p0.join('/');
}

@Component({
  selector: 'formly-link-type',
  template: `
    <a mat-button *ngIf="field.key" (click)="select(field.key)">{{ content(field.key) | safe:'html' }}</a>
  `,
  styles: [`a {
    text-decoration: none;
  }`]
})
export class ButtonTypeComponent extends FieldType {
  defaultOptions = {
    defaultValue: {},
  };
  constructor(@Inject(FormlyService) private promptService: FormlyService, private router : Router) {
    super();
  }

  content(fieldKey: any) {
    const selection = this.field.model[fieldKey];
    return selection.name || this.to.label || this.to.description || selection;
  }

  select(fieldKey: any) {
    const selection = this.field.model[fieldKey];
    const path = selection.path || (this.to.path && absolute(this.to.path, this.router.url)) || selection;
    if (!selection.disabled) {
      this.promptService.navigate(path, this.to.queryParams || {});
    }
  }
}

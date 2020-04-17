import { Component, ViewChild, forwardRef, Renderer2, Attribute, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType } from '@ngx-formly/core';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';

@Component({
  selector: 'formly-markdown-type',
  template: `
    <mat-label *ngIf="to.label">{{ to.label }}</mat-label>
    <mat-hint *ngIf="to.description">{{ to.description }}</mat-hint>
    <md-editor #md="ngModel" name="Content" (onEditorLoaded)="onEditorLoaded($event)" [upload]="doUpload" [(ngModel)]="content" [mode]="mode" [options]="mdOptions" required maxlength="600" height="400px"></md-editor>
    <div class="alert alert-danger" role="alert" *ngIf="showError && formControl.errors">
    <formly-validation-message [field]="field"></formly-validation-message>
    </div>
`,
})
export class MarkdownTypeComponent extends FieldType {
    public mdOptions: MdEditorOption = {
        showPreviewPanel: false,
        enablePreviewContentClick: false,
        resizable: true,
        customRender: {
          image: function (href: string, title: string, text: string) {
            let out = `<img style="max-width: 100%; border: 20px solid red;" src="${href}" alt="${text}"`;
            if (title) {
              out += ` title="${title}"`;
            }
            out += (<any>this.mdOptions || {}).xhtml ? "/>" : ">";
            return out;
          }
        }
      };
      public mode: string = 'editor';

      get content(): string {
          return this.formControl.value;
      }

      set content(value) {
        this.formControl.setValue(value);
      }

      ngOnInit() {
      }
    
      togglePreviewPanel() {
        this.mdOptions.showPreviewPanel = !this.mdOptions.showPreviewPanel;
        this.mdOptions = Object.assign({}, this.mdOptions);
      }
    
      changeMode() {
        if (this.mode === 'editor') {
          this.mode = 'preview';
        } else {
          this.mode = 'editor';
        }
      }
    
      togglePreviewClick() {
        this.mdOptions.enablePreviewContentClick = !this.mdOptions.enablePreviewContentClick;
        this.mdOptions = Object.assign({}, this.mdOptions);
      }
    
      toggleResizeAble() {
        this.mdOptions.resizable = !this.mdOptions.resizable;
        this.mdOptions = Object.assign({}, this.mdOptions);
      }
    
      doUpload(files: Array<File>): Promise<Array<UploadResult>> {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let result: Array<UploadResult> = [];
            for (let file of files) {
              result.push({
                name: file.name,
                url: `https://avatars3.githubusercontent.com/${file.name}`,
                isImg: file.type.indexOf('image') !== -1
              })
            }
            resolve(result);
          }, 3000);
        });
      }
    
      onEditorLoaded(editor) {
        //console.log(`ACE Editor Ins: `, editor);
        //console.log(this.formControl)
        // editor.setOption('showLineNumbers', false);
    
        // setTimeout(() => {
        //   editor.setOption('showLineNumbers', true);
        // }, 2000);
      }    
}

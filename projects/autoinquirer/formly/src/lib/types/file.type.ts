import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-file',
  template: `
  <input style="display:none" type="file" #fileInput [formControl]="formControl" 
  [formlyAttributes]="field" [multiple]="to.multiple" [accept]="to.accept"
  (change)="handleFiles($event.target.files)">
  <input matInput readonly="true" #inputValue autocomplete="off" class="mat-input-element mat-form-field-autofill-control"> 
  <div class="mat-form-field-suffix">
    <button matSuffix mat-icon-button type="button"
    [disabled]="to.disabled" *ngIf="!to.readonly" mat-button color="primary" (click)="openUploadDialog()">
        <mat-icon>cloud_upload</mat-icon>
    </button>
  </div>
  `,
  styles: [`
  :host {
    display: flex;
    flex-direction: row;
  }
  `]
})
export class FileTypeComponent extends FieldType implements AfterViewInit {
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('inputValue') private _inputValueRef: ElementRef;

    separator = ', ';

    ngAfterViewInit(): void {
        this.updateInputValue(this.value);
    }

    openUploadDialog() {
        this.fileInput.nativeElement.click();
    }  

    handleFiles(filelist: any) {
        if (filelist.length > 0) {
          const files: Array<File> = new Array();
          for (let i = 0; i < filelist.length; i++) {
            files.push(filelist.item(i));
          }
          this.updateInputValue(files);
        }
    }
    
    updateInputValue(filelist: any) {
        let text = null;
        if (filelist && Array.isArray(filelist)) {
            text = this.to.multiple
                ? filelist.map(x => x.name).join(this.separator)
                : filelist[0].name;
        } else {
            text = filelist.name != null ? filelist.name : null;
        }

        this._inputValueRef.nativeElement.value = text;
    }    

    get value() { return this.field.model[this.field.key.toString()];}
}

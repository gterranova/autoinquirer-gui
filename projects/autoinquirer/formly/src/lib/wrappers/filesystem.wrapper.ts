// panel-wrapper.component.ts
import { HttpEventType, HttpResponse, HttpUploadProgressEvent } from '@angular/common/http';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { Subject } from 'rxjs';
import { Action, FormlyService } from '@autoinquirer/shared';

@Component({
selector: 'formly-wrapper-filesystem',
template: `
<ng-template #fileButtons>
  <span>
    <input style="display:none" type="file" #fileInput (change)="handleFileInput($event.target.files)" multiple >
    <button *ngIf="!to.readonly" mat-button color="primary" (click)="openUploadDialog()"><mat-icon>cloud_upload</mat-icon>&nbsp;Upload</button>
  </span>
</ng-template>
<mat-accordion>
<mat-expansion-panel [expanded]="to.expanded" [disabled]="to.disabled">
  <mat-expansion-panel-header>
    <mat-panel-title style="align-items: center">
      <b>{{ to.label | safe:'html' }}</b>
    </mat-panel-title> 
    <mat-panel-description>
      <div style="display:flex; width: 100%">
        <span class="spacer">{{ to.description | safe:'html' }}&nbsp;</span>
        <ng-container *ngTemplateOutlet="fileButtons"></ng-container>
      </div>
    </mat-panel-description>
  </mat-expansion-panel-header>
  <div dragAndDropArea (fileDropped)="onFileDropped($event)">
    <ng-container #fieldComponent></ng-container>
  </div>
  <mat-action-row>
    <ng-container *ngTemplateOutlet="fileButtons"></ng-container>
  </mat-action-row>    

 </mat-expansion-panel>
</mat-accordion>
<br/>
`,
styles: [`
  .pointer {
    cursor: pointer;
  }
  
  .spacer {
    flex: 1 1 auto;
  }

  .fileover {
    animation: shake 1s;
    animation-iteration-count: infinite;
  }
  
  /* Shake animation */
  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
  
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
  
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
  
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
  
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
  
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
  
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
  
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
  
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
  
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
  
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }  
`],
})
export class FilesystemWrapperComponent extends FieldWrapper {
    @ViewChild('fileInput') fileInput: ElementRef;
    status = {};

    constructor(@Inject(FormlyService) private promptService: FormlyService) {
        super();
      }
    
    onFileDropped($event) {
      this.handleFileInput($event);
    }
        
    openUploadDialog() {
      this.fileInput.nativeElement.click();
    }
    
    handleFileInput(files: FileList) {
      // create a new progress-subject for every file
      const progress = new Subject<number>();

      const formData: FormData = new FormData();
      for (let i=0;i<files.length;i++) {
        const fileToUpload = files.item(i);
        formData.append('file', fileToUpload, fileToUpload.name);
      }
      return this.promptService.request(Action.UPLOAD, this.to.path, formData, { /* do: 'formly' */ }).subscribe((event: HttpResponse<any>|HttpUploadProgressEvent) => {

        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage

          const percentDone = Math.round((100 * event.loaded) / event.total);
          console.log(percentDone)
          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
          this.promptService.navigate(this.to.path);
        }
      });
    }
  }
// panel-wrapper.component.ts
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { PromptService } from '../prompt.service';

@Component({
selector: 'formly-wrapper-filesystem',
template: `
<mat-toolbar style="position: relative; z-index: 100;">
  <mat-icon *ngIf="canNavigateUp" class="pointer" (click)="navigateUp()">arrow_back</mat-icon>
  <span style="margin-left: 8px">{{to.path}}</span>
  <span class="spacer"></span>
  <!-- mat-icon class="pointer" (click)="openUploadDialog()">cloud_upload</mat-icon>
  <mat-icon class="pointer" (click)="openNewFolderDialog()">create_new_folder</mat-icon -->
</mat-toolbar>
<p *ngIf="to.description">
{{ to.description }} 
</p>
<div>
    <ng-container #fieldComponent></ng-container>
</div>
<br/>
`,
styles: [`
:host {
    height: 100%;
    display: flex;
    flex-direction: column;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  .file-or-folder {
    padding: 8px;
    overflow: hidden;
  }
  
  .file-or-folder-icon {
    width: 50px;
    height: 50px;
    font-size: 50px;
  }
  
  .pointer {
    cursor: pointer;
  }
  
  .spacer {
    flex: 1 1 auto;
  }
`],
})
export class FilesystemWrapperComponent extends FieldWrapper {
    canNavigateUp: boolean = true;

    constructor(private promptService: PromptService) {
        super();
      }
    
    navigateUp() {
        this.promptService.navigate(this.popFromPath(this.to.path));
    }

    popFromPath(path: string) {
        let p = path ? path : '';
        let split = p.split('/');
        split.splice(split.length - 1, 1);
        p = split.join('/');
        return p;
    }  
        
}
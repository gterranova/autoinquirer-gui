import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PromptComponent, IServerResponse, PromptCallbackType, FormlyService } from '@autoinquirer/shared';


@Component({
  selector: 'app-autoinquirer-breadcrumb',
  templateUrl: './autoinquirer-breadcrumb.component.html',
  styleUrls: ['./autoinquirer-breadcrumb.component.scss']
})
export class AutoinquirerBreadcrumbComponent implements PromptComponent, OnInit {
  prompt: any = {};
  callback: PromptCallbackType;
  
  constructor(private titleService: Title, private formlyService: FormlyService) { 
  }

  ngOnInit() {
    this.titleService.setTitle(this.prompt.pathParts[this.prompt.pathParts.length-1].label);
  }

  select(url?: any) {
    this.callback('navigate', url||'');
  }

  copy() {
    localStorage.setItem('copySource', JSON.stringify(this.currentPath));
    alert(`Copied "${this.currentPath.label}"`);
  }

  paste() {
    const copySource = JSON.parse(localStorage.getItem('copySource'));
    if (confirm(`Paste "${copySource.label}" to "${this.currentPath.label}"?`)){
      this.formlyService.paste(copySource, this.currentPath.value).toPromise().then(() => this.select(this.currentPath.value));
    }
  }

  archive() {
    if (confirm(`Archive "${this.currentPath.label}"?`)){
      this.formlyService.rpc("archive", `/${this.currentPath.value}`, {}, {} ).toPromise().then((res) => {
        console.log(`Archive result`, res);
        //this.select(this.currentPath)
      });
    }
  }

  get currentPath() {
    return this.prompt.pathParts[this.prompt.pathParts.length-1];
  }
}

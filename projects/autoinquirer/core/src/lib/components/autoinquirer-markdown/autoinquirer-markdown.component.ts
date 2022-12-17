import { Component, OnInit, ElementRef, SecurityContext, AfterContentInit, AfterViewInit } from '@angular/core';
import { PromptComponent, PromptCallbackType } from '@autoinquirer/shared';
import { MarkdownService } from '@autoinquirer/markdown';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-autoinquirer-markdown',
  templateUrl: './autoinquirer-markdown.component.html',
  //template: '<div [innerHTML]="content"></div>',
  styleUrls: ['./autoinquirer-markdown.component.scss']
})
export class AutoinquirerMarkdownComponent implements PromptComponent, OnInit, AfterViewInit {
  prompt: any = {};
  callback: PromptCallbackType;
  content: any;

  constructor(
    private element: ElementRef<HTMLElement>,
    public markdownService: MarkdownService,  
    private sanitizer: DomSanitizer  
  ) { }
  
  ngOnInit() {
    this.render(this.prompt.content!);
  }

  ngAfterViewInit() {
    // Iterate through all links
    const linkEls = this.element.nativeElement.getElementsByTagName('A');

    const links = this.element.nativeElement.querySelectorAll('A');

    for (var linkIndex = 0; linkIndex < links.length; linkIndex++) {
      var linkEl = links.item(linkIndex);
      const href = linkEl.getAttribute('href');
      // Ignore links that don't begin with #
      if (!href || !href.match(/^#/)) {
        continue;
      }
  
      // Convert to an absolute URL
      linkEl.addEventListener('click', this.onClick.bind(this));
    }
  }

  render(markdown: string, decodeHtml = false): void {
    //let compiled = this.markdownService.compile(markdown, decodeHtml, false);
    this.content = markdown; //this.sanitizer.sanitize(SecurityContext.NONE, compiled);
    //this.markdownService.highlight(this.element.nativeElement);
  }

  scrollTo(fragment: string) {
    //console.log(fragment);
    const targetElement = document.querySelector('#' + fragment);
    targetElement.scrollIntoView();
  }  
  onClick(event) {
    event.stopPropagation();
    event.preventDefault();
    this.scrollTo(event.target.href.split('#')[1].trim());
  }  
}

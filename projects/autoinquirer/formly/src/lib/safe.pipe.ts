import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { unescape } from 'lodash';

@Pipe({
    name: 'safe'
})
export class SafePipe implements PipeTransform {

    constructor(protected sanitizer: DomSanitizer) { }

    public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        if (!value) return '';
        switch (type) {
            case 'html':
                const doc = new DOMParser().parseFromString(value, 'text/html');
                return this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(unescape(doc.documentElement.textContent)));
            case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
            case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
            case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default: throw new Error(`Invalid safe type specified: ${type}`);
        }
    }
}
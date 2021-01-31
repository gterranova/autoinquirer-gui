import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
//import { Socket } from 'ngx-socket-io';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FormlyService {
  //currentPrompt = this.socket.fromEvent<Item>('prompt');
  private baseUrl = '';
  private prefix = '/api/';

  constructor(
    private http: HttpClient, 
    //private socket: Socket,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('serverUrl') protected serverUrl: string,
    private router: Router) {
    this.baseUrl = isPlatformBrowser(this.platformId)? this.baseUrl : this.serverUrl;
  }


  navigate(path: string, queryParams = {}) {
    this.router.navigate([...path.split('/')], { skipLocationChange: false, queryParams });
  }

  private createRequestHeader() {
    // set headers here e.g.
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return headers;
  }

  public request(
    method: 'get' | 'push' | 'set' | 'update' | 'del' | 'upload',
    itemPath: string,
    ...args: any[]
  ) {
    let params, value;
    if (method === 'get' || method === 'del' && args.length > 0) {
      params = args.pop();
    } else if (args.length > 1) {
      params = args.pop();
    }
    if (args.length > 0) {
      value = args.shift();
    }
    const options = { headers: this.createRequestHeader(), params };
    switch (method) {
      case 'get':
        return this.http.get(
          `${this.baseUrl}${this.prefix}${itemPath}`,
          options
        );
      case 'push':
        return this.http.post(
          `${this.baseUrl}${this.prefix}${itemPath}`,
          JSON.stringify(value),
          options
        );
      case 'set':
        return this.http.put(
          `${this.baseUrl}${this.prefix}${itemPath}`,
          JSON.stringify(value),
          options
        );
      case 'update':
        return this.http.patch(
          `${this.baseUrl}${this.prefix}${itemPath}`,
          JSON.stringify(value),
          options
        );
      case 'del':
        return this.http.delete(
          `${this.baseUrl}${this.prefix}${itemPath}`,
          options
        );
      case 'upload':
        // create a http-post request and pass the form
        // tell it to report the upload progress
        const httpParams = new HttpParams({ fromObject: params });
        //console.log(httpParams);
        const req = new HttpRequest(
          'POST',
          `${this.baseUrl}${this.prefix}${itemPath}`,
          value,
          { params: httpParams, reportProgress: true }
        );        
        return this.http.request(req);
        default:
    }
    throw new Error(`Unknown method ${method}`);
  }

}

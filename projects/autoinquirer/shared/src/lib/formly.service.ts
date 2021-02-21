import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
//import { Socket } from 'ngx-socket-io';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Action, ActionHttpMethodMap } from './shared.models';

@Injectable({
  providedIn: 'root'
})
export class FormlyService {
  //currentPrompt = this.socket.fromEvent<Item>('prompt');
  private baseUrl = '';
  private apiEntryPoint = '/api/';
  private rpcEntryPoint = '/api/json-rpc/';
  private _rpcCallId: number = 0;
  private get rpcCallId(): any {
    this._rpcCallId += 1;
    return this._rpcCallId.toString();
  }

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
    method: Action,
    itemPath: string,
    ...args: any[]
  ) {
    let params, value;
    if (method === Action.GET || method === Action.DELETE && args.length > 0) {
      params = args.pop();
    } else if (args.length > 1) {
      params = args.pop();
    }
    if (args.length > 0) {
      value = args.shift();
    }
    const options = { headers: this.createRequestHeader(), params };
    const requestUrl = `${this.baseUrl}${this.apiEntryPoint}${itemPath}`;
    switch (method) {
      case Action.GET:
      case Action.DELETE:
          return this.http[ActionHttpMethodMap[method]](requestUrl, options);
      case Action.PUSH:
      case Action.SET:
      case Action.UPDATE:
          return this.http[ActionHttpMethodMap[method]](requestUrl, JSON.stringify(value), options);
      case Action.UPLOAD:
        // create a http-post request and pass the form
        // tell it to report the upload progress
        const httpParams = new HttpParams({ fromObject: params });
        //console.log(httpParams);
        const req = new HttpRequest(ActionHttpMethodMap[method], requestUrl, value, { params: httpParams, reportProgress: true });        
        return this.http.request(req);
        default:
    }
    throw new Error(`Unknown method ${method}`);
  }

  public paste(src, dest) {
    return this.request(Action.SET, dest, { $ref: src });
  }

  public rpc(
    method: string,
    itemPath: string,
    value: any,
    params: any
  ) {
    return this.http.post(
      `${this.baseUrl}${this.rpcEntryPoint}`,
      JSON.stringify({
        jsonrpc: "2.0",
        method,
        params: { path: itemPath, value},
        id: this.rpcCallId
      }),
      { headers: this.createRequestHeader(), params }
    );
  }  
}

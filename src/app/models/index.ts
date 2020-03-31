// tslint:disable:no-any
// tslint:disable:no-reserved-keywords
export { PromptComponent } from './prompt.component';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import { FormlyFieldConfig } from '@ngx-formly/core';

export const enum Action {
    BACK='back',
    EXIT='exit',
    GET='get',
    PUSH='push',
    SET='set',
    UPDATE='update',
    DEL='del'
}

export interface IServerResponse {
    type: string;
    path?: string;
    schema: IProperty;
    model: any;
    items: [{ name: string, label: string }];
};
  
export interface IProxyInfo {
    proxyName: string;
    params: any;
}

export interface IProperty extends JSONSchema7 {
    // custom properties
    depends?: string;
    $data?: string;
    //$values?: { [key: string]: any};
    $proxy?: IProxyInfo;
    $widget?: string;
}


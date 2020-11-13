// tslint:disable:no-any
// tslint:disable:no-reserved-keywords
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
    items?: [{ name: string, label: string }];
};
  
export interface IProxyInfo {
    proxyName: string;
    params: any;
}

export interface IRelationship {
    path: string;
    remoteField?: string;
}

export interface IProperty extends JSONSchema7 {
    // custom properties
    $data?: IRelationship;
    $proxy?: IProxyInfo;
    $widget?: { type?: string, wrappers?: string[] };
}

export interface PromptComponent {
    prompt: IServerResponse;
}
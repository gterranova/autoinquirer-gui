// tslint:disable:no-any
// tslint:disable:no-reserved-keywords
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import { ComponentType } from '@angular/cdk/portal';
import { Observable } from 'rxjs';

export const enum Action {
    GET = 'get',
    PUSH = 'push',
    SET = 'set',
    UPDATE = 'update',
    DELETE = 'delete',
    UPLOAD = 'upload',
}

export const ActionHttpMethodMap = {
    [Action.GET]: 'get', 
    [Action.PUSH]: 'post', 
    [Action.SET]: 'put', 
    [Action.UPDATE]: 'patch', 
    [Action.DELETE]: 'delete', 
    [Action.UPLOAD]: 'post', 
};
    
export interface IServerResponse {
    type: string;
    path?: string;
    schema: IProperty;
    model: any;
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

type PromptRequestCallbackType = (
    action: 'request',
    method: Action,
    itemPath: string,
    ...args: any[]
) => Observable<any>;

type PromptNavigateCallbackType = (
    action: 'navigate',
    ...args: any[]
) => Observable<any>;

export type PromptCallbackType = PromptRequestCallbackType & PromptNavigateCallbackType;
export interface PromptComponent {
    prompt: IServerResponse;
    callback?: PromptCallbackType;
}

export interface ComponentTypeOption {
    name: string;
    component: ComponentType<PromptComponent>;
}

export interface DynamicComponentConfigOption {
    types?: ComponentTypeOption[];
}

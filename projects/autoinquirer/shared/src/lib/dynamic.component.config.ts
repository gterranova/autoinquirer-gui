import { Injectable, InjectionToken } from '@angular/core';
import { ComponentTypeOption, DynamicComponentConfigOption } from './shared.models';

export const DYNAMIC_COMPONENT_CONFIG = new InjectionToken<DynamicComponentConfigOption[]>('DYNAMIC_COMPONENT_CONFIG');

@Injectable({
    providedIn: 'root'
})
export class DynamicComponentConfig {

    types: { [name: string]: ComponentTypeOption } = {};

    addConfig(config: DynamicComponentConfigOption) {
        if (config.types) {
            config.types.forEach((type) => this.setType(type));
        }
    }

    setType(options: ComponentTypeOption | ComponentTypeOption[]) {
        if (Array.isArray(options)) {
            options.forEach((option) => this.setType(option));
        } else {
            if (!this.types[options.name]) {
                this.types[options.name] = <ComponentTypeOption>{ name: options.name, component: options.component };
            }
        }
    }

    getType(name: string): Partial<ComponentTypeOption> {
        if (!this.types[name]) {
            //throw new Error(
            //    `[Error] The type "${name}" could not be found. Please make sure that is registered through the FormlyModule declaration.`,
            //);
            return { name: 'empty' };
        }

        return this.types[name];
    }
}

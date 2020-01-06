import { AutoinquirerListComponent } from './autoinquirer-list/autoinquirer-list.component';
import { AutoinquirerInputComponent } from './autoinquirer-input/autoinquirer-input.component';

export const DYNAMIC_COMPONENTS = [
    AutoinquirerListComponent,
    AutoinquirerInputComponent
];

export const ComponentTypes = {
    'list': AutoinquirerListComponent,
    'input': AutoinquirerInputComponent
};

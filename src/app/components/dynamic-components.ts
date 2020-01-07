import { AutoinquirerListComponent } from './autoinquirer-list/autoinquirer-list.component';
import { AutoinquirerInputComponent } from './autoinquirer-input/autoinquirer-input.component';
import { AutoinquirerConfirmComponent } from './autoinquirer-confirm/autoinquirer-confirm.component';
import { AutoinquirerCheckboxComponent } from './autoinquirer-checkbox/autoinquirer-checkbox.component';

export const DYNAMIC_COMPONENTS = [
    AutoinquirerListComponent,
    AutoinquirerInputComponent,
    AutoinquirerConfirmComponent,
    AutoinquirerCheckboxComponent,
];

export const ComponentTypes = {
    'list': AutoinquirerListComponent,
    'input': AutoinquirerInputComponent,
    'confirm': AutoinquirerConfirmComponent,
    'checkbox': AutoinquirerCheckboxComponent,
};

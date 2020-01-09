import { AutoinquirerListComponent } from './autoinquirer-list/autoinquirer-list.component';
import { AutoinquirerInputComponent } from './autoinquirer-input/autoinquirer-input.component';
import { AutoinquirerConfirmComponent } from './autoinquirer-confirm/autoinquirer-confirm.component';
import { AutoinquirerCheckboxComponent } from './autoinquirer-checkbox/autoinquirer-checkbox.component';
import { AutoinquirerSelectComponent } from './autoinquirer-select/autoinquirer-select.component';

export const DYNAMIC_COMPONENTS = [
    AutoinquirerListComponent,
    AutoinquirerInputComponent,
    AutoinquirerConfirmComponent,
    AutoinquirerCheckboxComponent,
    AutoinquirerSelectComponent,
];

export const ComponentTypes = {
    'list': AutoinquirerListComponent,
    'input': AutoinquirerInputComponent,
    'confirm': AutoinquirerConfirmComponent,
    'checkbox': AutoinquirerCheckboxComponent,
    'select': AutoinquirerSelectComponent,
};

import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
 selector: 'formly-field-masked-input',
 template: `
   <input type="input" class="mat-input-element" 
    [mask]="mask" 
    [pattern]="pattern"
    [prefix]="prefix"
    [suffix]="suffix"
    [dropSpecialCharacters]="dropSpecialCharacters"
    [showMaskTyped]="showMaskTyped" 
    [allowNegativeNumbers]="allowNegativeNumbers" 
    [placeHolderCharacter]="placeHolderCharacter" 
    [clearIfNotMatch]="clearIfNotMatch" 
    [thousandSeparator]="thousandSeparator" 
    [validation]="validation" 
    [formControl]="formControl" [formlyAttributes]="field">
 `,
})
export class FormlyFieldMaskedInput extends FieldType {

    get mask() { return this.to.mask; }
    get pattern() { return this.to.pattern || '*'; }
    get prefix() { return this.to.prefix || ''; }
    get suffix() { return this.to.suffix || ''; }
    get dropSpecialCharacters() { return this.to.dropSpecialCharacters || false; }
    get showMaskTyped() { return (this.to.showMaskTyped && this.formControl.value) || false; }
    get allowNegativeNumbers() { return this.to.allowNegativeNumbers || false; }
    get placeHolderCharacter() { return this.to.placeHolderCharacter || '_'; }
    get clearIfNotMatch() { return this.to.clearIfNotMatch || false; }
    get thousandSeparator() { return this.to.thousandSeparator || ' '; }
    get validation() { return this.to.validation || true; }

}
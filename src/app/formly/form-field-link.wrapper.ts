import { Component, ViewChild, OnInit, OnDestroy, Renderer2, AfterViewInit, AfterContentChecked, TemplateRef, ElementRef, ViewContainerRef } from '@angular/core';
import { FieldWrapper, ɵdefineHiddenProp as defineHiddenProp, FormlyFieldConfig, FormlyConfig } from '@ngx-formly/core';
import { MatFormField } from '@angular/material/form-field';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { FieldType } from '@ngx-formly/material';
import { Router } from '@angular/router';

interface MatFormlyFieldConfig extends FormlyFieldConfig {
  _matprefix: TemplateRef<any>;
  _matsuffix: TemplateRef<any>;
  __formField__: FormlyWrapperFormFieldLink;
}

@Component({
  selector: 'formly-wrapper-mat-form-field-link',
  template: `
    <!-- fix https://github.com/angular/material2/pull/7083 by setting width to 100% -->
    <mat-form-field
      [hideRequiredMarker]="true"
      [floatLabel]="to.floatLabel"
      [appearance]="to.appearance"
      [color]="to.color"
      [style.width]="'85%'">
      <ng-container #fieldComponent></ng-container>

      <mat-label *ngIf="to.label && to.hideLabel !== true">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true" class="mat-form-field-required-marker">*</span>
      </mat-label>

      <ng-container matPrefix>
        <ng-container *ngTemplateOutlet="to.prefix ? to.prefix : formlyField._matprefix"></ng-container>
      </ng-container>

      <ng-container matSuffix>
        <ng-container *ngTemplateOutlet="to.suffix ? to.suffix : formlyField._matsuffix"></ng-container>
      </ng-container>

      <!-- fix https://github.com/angular/material2/issues/7737 by setting id to null  -->
      <mat-error [id]="null">
        <formly-validation-message [field]="field"></formly-validation-message>
      </mat-error>
      <!-- fix https://github.com/angular/material2/issues/7737 by setting id to null  -->
      <mat-hint *ngIf="to.description" [id]="null">{{ to.description }}</mat-hint>
    </mat-form-field>
    <a mat-button [style.width]="'15%'" (click)="goToPage(value)"><mat-icon>link</mat-icon></a>
  `,
  providers: [{ provide: MatFormFieldControl, useExisting: FormlyWrapperFormFieldLink }],
})
export class FormlyWrapperFormFieldLink extends FieldWrapper<MatFormlyFieldConfig> implements OnInit, OnDestroy, MatFormFieldControl<any>, AfterViewInit, AfterContentChecked {
  // TODO: remove `any`, once dropping angular `V7` support.
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) fieldComponent!: ViewContainerRef;

  // TODO: remove `any`, once dropping angular `V7` support.
  @ViewChild(MatFormField, { static: true }) formField!: MatFormField;

  stateChanges = new Subject<void>();
  _errorState = false;
  private initialGapCalculated = false;

  constructor(
    private config: FormlyConfig,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private focusMonitor: FocusMonitor,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.formField._control = this;
    defineHiddenProp(this.field, '__formField__', this.formField);

    const ref = this.config.resolveFieldTypeRef(this.formlyField);
    if (ref && !(ref.instance instanceof FieldType)) {
      console.warn(`Component '${ref.componentType.name}' must extend 'FieldType' from '@ngx-formly/material/form-field'.`);
    }

    // fix for https://github.com/angular/material2/issues/11437
    if (this.formlyField.hide && this.formlyField.templateOptions!.appearance === 'outline') {
      this.initialGapCalculated = true;
    }

    this.focusMonitor.monitor(this.elementRef, true).subscribe(origin => {
      if (!origin && this.field.focus) {
        this.field.focus = false;
      }

      this.stateChanges.next();
    });
  }

  ngAfterContentChecked() {
    if (!this.initialGapCalculated || this.formlyField.hide) {
      return;
    }

    this.formField.updateOutlineGap();
    this.initialGapCalculated = true;
  }

  ngAfterViewInit() {
    // temporary fix for https://github.com/angular/material2/issues/7891
    if (this.formField.appearance !== 'outline' && this.to.hideFieldUnderline === true) {
      const underlineElement = this.formField._elementRef.nativeElement.querySelector('.mat-form-field-underline');
      underlineElement && this.renderer.removeChild(underlineElement.parentNode, underlineElement);
    }
  }

  ngOnDestroy() {
    delete this.formlyField.__formField__;
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  setDescribedByIds(ids: string[]): void { }
  onContainerClick(event: MouseEvent): void {
    this.formlyField.focus = true;
    this.stateChanges.next();
  }

  goToPage(value: string) {
    const selectedOption = (<any[]>this.to.options).find( o => o.value == value );
    if (selectedOption && selectedOption.path) {
      this.router.navigate(['/', ...selectedOption.path.split('/')]);
    }
  }  

  get errorState() {
    const showError = this.options!.showError!(this);
    if (showError !== this._errorState) {
      this._errorState = showError;
      this.stateChanges.next();
    }

    return showError;
  }
  get controlType() { return this.to.type; }
  get focused() { return !!this.formlyField.focus && !this.disabled; }
  get disabled() { return !!this.to.disabled; }
  get required() { return !!this.to.required; }
  get placeholder() { return this.to.placeholder || ''; }
  get shouldPlaceholderFloat() { return this.shouldLabelFloat; }
  get value() { return this.formControl.value; }
  get ngControl() { return this.formControl as any; }
  get empty() { return !this.formControl.value; }
  get shouldLabelFloat() { return this.focused || !this.empty; }

  get formlyField() { return this.field as MatFormlyFieldConfig; }
}
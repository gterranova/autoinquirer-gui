import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromptComponent, PromptCallbackType } from '@autoinquirer/shared';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AuthService } from '../services/auth.service';
import { UserActivation } from '../models';

@Component({
  selector: 'app-autoinquirer-auth-activate',
  template: `<div class="signin-content">
  <mat-card>
  <mat-card-header>
    <mat-card-title>{{ prompt.schema.title }}</mat-card-title>
    <mat-card-subtitle></mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
  <form *ngIf="!submittedCode" name="form" [formGroup]="form" novalidate>
    <formly-form [form]="form" [fields]="fields" [model]="user"></formly-form>
  </form>
  <p *ngIf="submittedCode">
    Activated!
  </p>
  </mat-card-content>
  <mat-card-actions>
    <button *ngIf="!submittedCode" mat-raised-button class="mat-primary full-width" (click)="activate()" [disabled]="loading||!canSubmit()">
      Activate
    </button>
    <button *ngIf="submittedCode" mat-raised-button class="mat-primary full-width" (click)="navigate()">
      Go to Login
    </button>
  </mat-card-actions>  
</mat-card></div>`,
  styles: [`:host {
    display: block;
    margin: 0 100px;
  }
  mat-card {
    max-width: 400px;
    margin: 2em auto;
    text-align: center;
  }
  .signin-content {
    padding: 60px 1rem;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoinquirerAuthActivateComponent implements OnInit, PromptComponent, OnInit, AfterViewInit {
  prompt: any = {};
  user: UserActivation = { code: '' };
  submittedCode: string;
  loading = false;
  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[] = [];
  callback: PromptCallbackType;
  
  constructor(
    private formlyJsonschema: FormlyJsonschema,
    private authService: AuthService,
    protected router: Router,
    private cdref: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    if (this.prompt.model.error) { 
      this.form.markAllAsTouched();
      this.form.setErrors({ 'server-error': this.prompt.model.error }); 
    } else { 
      this.submittedCode = this.user.code; 
    }
    this.cdref.detectChanges();
  }

  ngOnInit() {
    this.fields = [this.formlyJsonschema.toFieldConfig(this.prompt.schema)];
    this.user.code = this.prompt.model.code;
  }

  activate() {
    this.authService.activate(this.user).subscribe(
      (result: any) => {
        this.submittedCode = result.code;
        this.cdref.detectChanges();
        //this.router.navigate(['/' || this.prompt.path]);
      },
      (response: any)=> {
        response.error.errors.map(e => this.form/*.get('email')*/.setErrors({ 'server-error': e }));
        this.loading = false;
        this.cdref.detectChanges();
      }
    );
  }

  canSubmit() {
    return (
      !!this.user.code &&
      this.form.valid
    );
  }

  navigate(url?: string) {
    this.router.navigate([url || '/auth/login']);
  }

}

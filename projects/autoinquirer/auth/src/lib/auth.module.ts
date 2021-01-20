import { ModuleWithProviders, NgModule, Optional, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';
import { JwtModule, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { DynamicComponentConfig, DYNAMIC_COMPONENT_CONFIG } from '@autoinquirer/formly';
import { AutoinquirerFormlyModule, FormlyService, DynamicComponentConfigOption } from '@autoinquirer/formly';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

import { AutoinquirerAuthLoginComponent, ForgotPasswordDialog } from './components/autoinquirer-auth.login.component';
import { AutoinquirerAuthRegisterComponent } from './components/autoinquirer-auth.register.component';
import { AutoinquirerAuthLogoutComponent } from './components/autoinquirer-auth.logout.component';
import { AutoinquirerAuthActivateComponent } from './components/autoinquirer-auth.activate.component';


export function jwtOptionsFactory(tokenService: TokenService) {
  function tokenGetter() {
    if (!tokenService) {
      console.log("No tokenService in tokenGetter");
      return;
    }
    return tokenService.token;
  }
  return {
    tokenGetter,
    whitelistedDomains: ['localhost:4000', '192.168.1.132:4000'],
    blacklistedRoutes: [],
    authScheme: 'JWT '
  };
}

export function defaultDynamicComponentConfig(config?: DynamicComponentConfig): DynamicComponentConfigOption {
  return {
    types: [
      { name: 'auth-login', component: AutoinquirerAuthLoginComponent },
      { name: 'auth-activate', component: AutoinquirerAuthActivateComponent },
      { name: 'auth-register', component: AutoinquirerAuthRegisterComponent },
      { name: 'auth-logout', component: AutoinquirerAuthLogoutComponent }
    ]
  };
}

const DYNAMIC_COMPONENTS = [
  AutoinquirerAuthLoginComponent,
  AutoinquirerAuthActivateComponent,
  AutoinquirerAuthRegisterComponent,
  ForgotPasswordDialog,
  AutoinquirerAuthLogoutComponent,
];

@NgModule({
  declarations: [
    ...DYNAMIC_COMPONENTS,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormlyModule,
    AutoinquirerFormlyModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    JwtModule
  ],
  entryComponents: [
    ...DYNAMIC_COMPONENTS,
  ],
  exports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ...DYNAMIC_COMPONENTS,
  ]
})
export class AuthModule {
  static forRoot(config: DynamicComponentConfigOption = {}): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        TokenService,
        [
          {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [TokenService]
          },
          JwtHelperService,
          { provide: AuthService, useClass: AuthService, deps: [FormlyService, TokenService, JwtHelperService] },
          { provide: AuthGuard, useClass: AuthGuard, deps: [JwtHelperService, AuthService, TokenService, Router] },
        ],
        [
          {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
          },
        ],
        [
          { provide: DYNAMIC_COMPONENT_CONFIG, multi: true, useFactory: defaultDynamicComponentConfig, deps: [DynamicComponentConfig] },
          { provide: DYNAMIC_COMPONENT_CONFIG, useValue: config, multi: true },
        ],
      ]
    };
  }

  constructor(@Inject(DynamicComponentConfig) configService: DynamicComponentConfig, @Optional() @Inject(DYNAMIC_COMPONENT_CONFIG) configs: DynamicComponentConfigOption[] = []) {
    if (!configs) {
      configService.addConfig(defaultDynamicComponentConfig());
      return;
    }

    configs.forEach((config) => configService.addConfig(config));
  }
}

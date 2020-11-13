import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './guards';
import { AuthenticationService, TokenService } from './services';
import { JwtModule, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthInterceptor } from './services/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

export function jwtOptionsFactory(tokenService: TokenService) {
  return {
    tokenGetter: () => {
      return tokenService.token;
    },
    whitelistedDomains: ['localhost:4000', '192.168.1.132:4000'],
    blacklistedRoutes: [],
    authScheme: 'JWT '
  };
}

@NgModule({
  imports: [
      CommonModule, 
      FormsModule, 
      JwtModule.forRoot({
        jwtOptionsProvider: {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
          deps: [TokenService]
        }
      })
    ],
  declarations: [/*, ForgotPasswordDialog */],
  entryComponents: [/*ForgotPasswordDialog*/],
  exports: [
    JwtModule
  ],
})
export class AuthModule {
  /*
  constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error('AuthModule is already loaded. It should only be imported in your application\'s main module.');
    }
  }*/
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        JwtHelperService,
        AuthGuard,
        AuthenticationService,
        TokenService,
        [
          {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
          }
        ]      
      ]
    };
  }
}

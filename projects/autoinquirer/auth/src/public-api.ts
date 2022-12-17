/*
 * Public API Surface of auth
 */

export { User, Group, LocalData } from './lib/models';
export { AuthGuard } from './lib/guards/auth.guard';
export { AuthService as AuthenticationService } from './lib/services/auth.service';
export { TokenService } from './lib/services/token.service';
export { AuthInterceptor } from './lib/services/auth.interceptor';
export { AutoinquirerAuthLoginComponent, ForgotPasswordDialog } from './lib/components/autoinquirer-auth.login.component';
export { AutoinquirerAuthRegisterComponent } from './lib/components/autoinquirer-auth.register.component';
export { AutoinquirerAuthLogoutComponent } from './lib/components/autoinquirer-auth.logout.component';
export { AutoinquirerAuthActivateComponent } from './lib/components/autoinquirer-auth.activate.component';

export { AuthModule } from './lib/auth.module';

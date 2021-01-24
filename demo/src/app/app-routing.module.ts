import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DynamicContainer, FormlyService } from '@autoinquirer/formly';
import { AuthenticationService } from '@autoinquirer/auth';

@Injectable({
  providedIn: 'root'
})
export class PathResolveService implements Resolve<any> {
  constructor(private formlyService: FormlyService, private authService: AuthenticationService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const path = state.url.slice(1).split('?')[0];
    const params = route.queryParamMap.has('do')? route.queryParams: { do: 'layout' }; 
    return await this.formlyService.request('get', path, params).toPromise();
  }
}

const routes: Routes = [
  {
    path: '**',
    component: DynamicContainer,
    resolve: { promptInfo: PathResolveService },
    runGuardsAndResolvers: 'always',
    data: {}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    onSameUrlNavigation: 'reload', 
    urlUpdateStrategy: 'deferred',
    scrollPositionRestoration: "top" 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DynamicContainer } from './components';
import { PromptService } from './prompt.service';

@Injectable({
  providedIn: 'root'
})
export class PathResolveService implements Resolve<any> {
  constructor(private promptService: PromptService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const path = state.url.slice(1);
    //this.promptService.answer({ name: 'state', answer: { path }});
    return await this.promptService.request('get', path).toPromise();
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

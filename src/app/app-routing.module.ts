import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AutoinquirerPromptComponent } from './components';
import { PromptService } from './prompt.service';

@Injectable({
  providedIn: 'root'
})
export class PathResolveService implements Resolve<any> {
  constructor(private promptService: PromptService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const path = state.url.slice(1);
    this.promptService.answer({ name: 'state', answer: { path }});
  }
}

const routes: Routes = [
  {
    path: '**',
    component: AutoinquirerPromptComponent,
    resolve: { promptInfo: PathResolveService },
    data: {}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

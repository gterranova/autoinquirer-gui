import { Component, OnInit, Input } from '@angular/core';
import { PromptComponent, IPrompt, IState, Action } from 'src/app/models';
import { PromptService } from 'src/app/prompt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-autoinquirer-list',
  templateUrl: './autoinquirer-list.component.html',
  styleUrls: ['./autoinquirer-list.component.scss']
})
export class AutoinquirerListComponent implements PromptComponent, OnInit {
  prompt: IPrompt;

  constructor(private promptService: PromptService,
    private router: Router) { }

  ngOnInit() {
  }

  select(selection: any) {
    if (!!!selection.disabled) {
      this.router.navigate(['/', ...selection.value.path.split('/')]);
    }
  }

}

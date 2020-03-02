import { Component, OnInit, Input } from '@angular/core';
import { PromptComponent, IPrompt, IState, Action } from 'src/app/models';
import { PromptService } from 'src/app/prompt.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-autoinquirer-list',
  templateUrl: './autoinquirer-list.component.html',
  styleUrls: ['./autoinquirer-list.component.scss']
})
export class AutoinquirerListComponent implements PromptComponent, OnInit {
  prompt: IPrompt;

  form = new FormGroup({});

  onSubmit(v) {
    console.log(v);
  }  

  constructor(private promptService: PromptService,
    private router: Router) { }

  ngOnInit() {
  }

  select(selection: any) {
    if (!selection.disabled) {
      if ((!selection.value.type || 
        selection.value.type === Action.GET || 
        selection.value.type === Action.BACK ||
        selection.value.type === Action.SET) && 
        selection.value.path) {
        this.router.navigate(['/', ...selection.value.path.split('/')]);
      } else {
        const data = { name: 'state', answer: selection.value };
        this.promptService.answer(data);
      }
    }  
  }
}

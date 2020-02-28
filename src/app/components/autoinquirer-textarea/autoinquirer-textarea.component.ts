import { Component, OnInit } from '@angular/core';
import { PromptComponent, IPrompt, IState, Action } from 'src/app/models';
import { PromptService } from 'src/app/prompt.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-autoinquirer-textarea',
  templateUrl: './autoinquirer-textarea.component.html',
  styleUrls: ['./autoinquirer-textarea.component.scss']
})
export class AutoinquirerTextareaComponent implements PromptComponent, OnInit {
  status: IState;
  prompt: IPrompt;
  inputForm: FormGroup;
  
  constructor(private promptService: PromptService, private router: Router) { 
  }

  ngOnInit() {
    this.status = this.promptService.getStatus();
    this.inputForm = new FormGroup({
      value: new FormControl(this.prompt.default),
    });    
  }

  onSubmit() {
    const data = { name: 'state', answer: { type: Action.SET, ...this.status}, ...this.inputForm.value };
    this.promptService.answer(data);
  }

  onCancel() {
    const pathParts = this.promptService.getStatus().path.split('/');
    this.router.navigate(['/', ...pathParts.slice(0, pathParts.length-1)]);
  }  
}

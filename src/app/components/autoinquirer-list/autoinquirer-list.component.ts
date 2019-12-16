import { Component, OnInit, Input } from '@angular/core';
import { IPrompt } from 'src/app/models';
import { PromptService } from 'src/app/prompt.service';

@Component({
  selector: 'app-autoinquirer-list',
  templateUrl: './autoinquirer-list.component.html',
  styleUrls: ['./autoinquirer-list.component.scss']
})
export class AutoinquirerListComponent implements OnInit {
  @Input() prompt: IPrompt;

  constructor(private promptService: PromptService) { }

  ngOnInit() {
  }

  select(selection: any) {
    this.promptService.answer({ name: 'state', answer: selection.value});
  }

}

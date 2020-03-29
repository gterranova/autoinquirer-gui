import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPrompt } from './models';
import { Observable, Subscription } from 'rxjs';
import { PromptService } from './prompt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  prompt: Observable<IPrompt>;
  private _promptSub: Subscription;

  title = 'autoinquirer-gui';

  constructor(private promptService: PromptService) { }

  ngOnInit() {
    //this.prompt = this.promptService.currentPrompt;
  }

  ngOnDestroy() {
  }

}

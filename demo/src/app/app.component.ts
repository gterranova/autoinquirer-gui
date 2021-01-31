import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IServerResponse, FormlyService } from '@autoinquirer/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  prompt: Observable<IServerResponse>;
  private _promptSub: Subscription;

  title = 'autoinquirer-gui';

  constructor(private formlyService: FormlyService) { }

  ngOnInit() {
    //this.prompt = this.promptService.currentPrompt;
  }

  ngOnDestroy() {
  }

}

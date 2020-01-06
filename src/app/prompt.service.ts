import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IPrompt, IAnswer, IFeedBack, IState } from './models';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  currentPrompt = this.socket.fromEvent<IPrompt>('prompt');
  currentStatus: IState;

  constructor(private socket: Socket) { }

  setStatus(status: IState) {
    this.currentStatus = status;
  }

  getStatus() {
    return this.currentStatus;
  }

  answer(answer: IFeedBack | IAnswer) {
    if (typeof answer === typeof <IFeedBack>{} && (<IFeedBack>answer).name === 'state') {
      this.setStatus((<IFeedBack>answer).answer);
    } else if (typeof answer === typeof <IAnswer>{}) {
      this.setStatus((<IAnswer>answer).state);
    }
    this.socket.emit('answer', answer);
  }
}

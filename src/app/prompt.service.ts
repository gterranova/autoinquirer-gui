import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IPrompt, IAnswer, IFeedBack } from './models';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  currentPrompt = this.socket.fromEvent<IPrompt>('prompt');

  constructor(private socket: Socket) { }

  answer(answer: IFeedBack) {
    this.socket.emit('answer', answer);
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  recognition = new webkitSpeechRecognition();

  isStoppedSpeechRecog: boolean = false;

  // public text = '';
  tempWords: string = '';

  constructor() {}

  // https://codeburst.io/creating-a-speech-recognition-app-in-angular-8d1fd8d977ca
  // https://stackoverflow.com/questions/38087013/angular2-web-speech-api-voice-recognition
  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-us';

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      this.tempWords = transcript;
    });
  }

  start(micSearchInputObs: Subject<string>) {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log('Speech recognition started');
    this.recognition.addEventListener('end', (condition: any) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log('End speech recognition');
      } else {
        // this.wordConcat();
        this.recognition.start();
        micSearchInputObs.next(this.tempWords);
      }
    });
  }
  stop() {
    this.isStoppedSpeechRecog = true;
    // this.wordConcat();
    this.recognition.stop();
    console.log('End speech recognition');
  }

  // Currently not required
  // wordConcat() {
  //   // this.text = this.text + ' ' + this.tempWords + '.';
  //   this.text = this.text + ' ' + this.tempWords;
  //   this.tempWords = '';
  // }
}

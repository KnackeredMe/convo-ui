import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements OnInit {
  private speechRecognition?: SpeechRecognition;
  public recognizedText: string = '';
  constructor() { }

  ngOnInit(): void {
    this.initSpeechRecognition()
  }

  initSpeechRecognition() {
    //@ts-ignore
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speechRecognition = new window.SpeechRecognition;
    this.speechRecognition.lang = "en-US";
    // this.speechRecognition.interimResults = true;
    this.speechRecognition.addEventListener('result', (event: any) => {
      this.recognizedText = Array.from(event.results).map((result: any) => result[0]).map((result: any) => result.transcript).join(' ');
    })
    // this.speechRecognition.start();
  }

  startSpeechRecognition() {
    this.speechRecognition?.start();
  }

}

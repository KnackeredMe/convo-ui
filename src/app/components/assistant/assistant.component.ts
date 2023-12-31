import { Component, OnInit } from '@angular/core';
import {AssistantService} from "../../services/assistant.service";

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements OnInit {
  private speechRecognition?: SpeechRecognition;
  public recognizedText: string = '';
  constructor(private assistantService: AssistantService) { }

  ngOnInit(): void {
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    //@ts-ignore
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speechRecognition = new window.SpeechRecognition;
    this.speechRecognition.lang = "en-US";
    this.speechRecognition.addEventListener('result', (event: any) => {
      this.recognizedText = Array.from(event.results).map((result: any) => result[0]).map((result: any) => result.transcript).join(' ');
      this.assistantService.recognition(this.recognizedText).subscribe({
        next: res => {
          this.assistantService.processResponse(res);
        }
      });
    });
  }

  startSpeechRecognition() {
    this.speechRecognition?.start();
  }

}

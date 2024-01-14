import { Component, OnInit } from '@angular/core';
import {AssistantService} from "../../services/assistant.service";
import { SceneService } from 'src/app/services/scene.service';
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements OnInit {
  private speechRecognition?: SpeechRecognition;
  public recognizedText: string = '';
  public isMicActive: boolean = false;
  public wait: boolean = false;
  constructor(public assistantService: AssistantService, private scene: SceneService) { }

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
      this.assistantService.recognition(this.recognizedText).pipe(
        tap(() => {
          this.scene.runAnimation('Thinking');
        }),
        delay(5000)
      ).subscribe({
        next: res => {
          this.assistantService.processResponse(res);
          this.wait = false;
        }
      });
    });
  }

  startSpeechRecognition() {
    if(this.speechRecognition) {
      this.speechRecognition.onaudiostart = () => {this.isMicActive = true; this.wait = true;}
      this.speechRecognition.onaudioend = () => this.isMicActive = false;
      this.speechRecognition?.start();
    }
  }

}

import { Component, OnInit } from '@angular/core';
import {AssistantService} from "../../services/assistant.service";

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements OnInit {
  constructor(public assistantService: AssistantService) { }

  ngOnInit(): void {
    this.assistantService.initSpeechRecognition();
  }
}

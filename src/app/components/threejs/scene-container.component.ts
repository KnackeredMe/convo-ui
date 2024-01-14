import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { SceneService } from 'src/app/services/scene.service';

@Component({
  selector: 'app-scene-container',
  templateUrl: 'scene-container.component.html',
  styleUrls: ['./scene-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneContainer implements AfterViewInit {

  @ViewChild('rendererCanvas', { static: true }) rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private scene: SceneService) {

  }

  ngAfterViewInit(): void {
    this.scene.createScene(this.rendererCanvas.nativeElement);
  }
}

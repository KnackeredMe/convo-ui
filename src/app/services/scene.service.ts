import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject, fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private mixer: THREE.AnimationMixer;

  private animations: THREE.AnimationClip [];

  private canvas: HTMLCanvasElement;
  private backgroundColor = 0xffff;
  private floorColor = 0xffff;

  private neckKey = 'mixamorig8Neck';
  private spineKey = 'mixamorig8Spine';

  private neck: THREE.Object3D;
  private spine: THREE.Object3D;

  private currentAnimation:THREE.AnimationClip;

  private modelInit$ = new ReplaySubject(1)

  constructor(private zone: NgZone) { 
    (window as any).runAnimation = this.runAnimation.bind(this);
  }

  private get width() {
    return this.canvas.getBoundingClientRect().width;
  }

  private get height() {
    return this.canvas.getBoundingClientRect().height;
  }

  public runAnimation(key: string) {
    if(!this.scene || !this.mixer || !this.animations || !this.animations.length) return;
    const foundedAnimation = THREE.AnimationClip.findByName(this.animations, key);
    if(foundedAnimation) {
      if(foundedAnimation === this.currentAnimation) return;
      if(this.currentAnimation) this.mixer.clipAction(this.currentAnimation).fadeOut(0.5);
      this.currentAnimation = foundedAnimation
      this.mixer.clipAction(this.currentAnimation).reset().setEffectiveTimeScale(1).fadeIn(0.5).play();
    }
  }


  public createScene(canvas: HTMLCanvasElement) {
  
    this.canvas = canvas;


    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);

    this.camera = new THREE.PerspectiveCamera(
      60,
      canvas.width / canvas.height,
      0.1,
      1000
    );

    this.initCameraPosition();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true // smooth edges
    });

    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;

    this.clock = new THREE.Clock();

    //initialization staff
    this.initHemisphereLight();
    this.initDirectionalLight();
    this.initFloor();
    this.loadModel();
    
    this.modelInit$.pipe(take(1)).subscribe(() => {
      this.camera.aspect = this.canvas.width / this.canvas.height;
      this.camera.updateProjectionMatrix();
      this.runAnimation('Greeting');
      this.subscribeOnMouseMove();
    });
    this.animate();
  }

  private initCameraPosition() {
    this.camera.position.z = 0.15;
    this.camera.position.x = 0;
    this.camera.position.y = 0.15;

    this.camera.rotateX(-0.35)
  }

  private initDirectionalLight() {
    let d = 8.25;
    let dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(-8, 5, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(2048 * 2, 2048 * 2);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;

    this.scene.add(dirLight);
  }

  private initHemisphereLight() {
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);
  }

  private initFloor() {
    let floorGeometry = new THREE.PlaneGeometry(3000, 3000, 1, 1);
    let floorMaterial = new THREE.MeshPhongMaterial({
      color: this.floorColor,
      shininess: 1,
    });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.receiveShadow = true;
    floor.rotation.x = -0.5 * Math.PI;

    this.scene.add(floor);
  }

  private loadModel() {
    const loader = new GLTFLoader();

    loader.load('../../assets/models/assistant.glb', (gltf) => {
      let gtlfScene = gltf.scene;

      this.animations = gltf.animations;

      this.animations.forEach((animation) => {
        animation.tracks.splice(3,3);
        animation.tracks.splice(9,3);
      })

      gtlfScene.rotateY(0.2)

      gtlfScene.scale.x = 0.1;
      gtlfScene.scale.y = 0.1;
      gtlfScene.scale.z = 0.1;

      this.mixer = new THREE.AnimationMixer(gtlfScene);

      gtlfScene.traverse((child) => {
        if((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
        }
        if((child as THREE.Bone).isBone && child.name === this.spineKey) {
          this.spine = child;
        }
        if((child as THREE.Bone).isBone && child.name === this.neckKey) {
          this.neck = child;
        }
      })
      this.modelInit$.next();
      this.scene.add(gtlfScene);
    })
  }

  private subscribeOnMouseMove() {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.canvas, 'mousemove').subscribe((e) => {
        const mousecoords = this.getMousePos(e);
        if (this.neck && this.spine) {
          this.moveJoint(mousecoords, this.neck, 50);
          this.moveJoint(mousecoords, this.spine, 30);
        }
      })
    })
  }

  private getMousePos(e: any) {
    return { x: e.clientX - this.canvas.getBoundingClientRect().left, y: e.clientY - this.canvas.getBoundingClientRect().top };
  }
  
  private moveJoint(mouse: any, joint: any, degreeLimit: any) {
    let degrees = this.getMouseDegrees(mouse.x, mouse.y, degreeLimit);
    
    joint.rotation.y = THREE.MathUtils.degToRad(degrees.x);
    joint.rotation.x = THREE.MathUtils.degToRad(degrees.y);
  }

  private getMouseDegrees(x: any, y: any, degreeLimit: any) {
    let dx = 0,
      dy = 0,
      xdiff,
      xPercentage,
      ydiff,
      yPercentage;

    let w = { x: this.canvas.width, y: this.canvas.height };


    if (x <= w.x / 2) {
      
      xdiff = w.x / 2 - x;
      
      xPercentage = (xdiff / (w.x / 2)) * 100;
      
      dx = ((degreeLimit * xPercentage) / 100) * -1;
    }

    
    if (x >= w.x / 2) {
      xdiff = x - w.x / 2;
      xPercentage = (xdiff / (w.x / 2)) * 100;
      dx = (degreeLimit * xPercentage) / 100;
    }
    
    if (y <= w.y / 2) {
      ydiff = w.y / 2 - y;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      
      dy = ((degreeLimit * 0.5 * yPercentage) / 100) * -1;
    }
    
    if (y >= w.y / 2) {
      ydiff = y - w.y / 2;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      dy = (degreeLimit * yPercentage) / 100;
    }
    return { x: dx, y: dy };
  }

  private animate() {
    if(this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }
}

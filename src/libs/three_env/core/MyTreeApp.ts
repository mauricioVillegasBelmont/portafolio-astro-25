import * as THREE from "three";


import Renderer from "./Renderer";
import CameraFactory from "libs/three_env/entities/Camera/CameraFactory";
import Control from "./ControlManager";
import { FlyControls } from "three/addons/controls/FlyControls.js";

import EventEmitter from "./EventEmiter"



export class MyTreeApp {
  static instance: MyTreeApp;

  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public eventEmiter = new EventEmitter();
  public clock: THREE.Clock = new THREE.Clock();
  public camera:THREE.PerspectiveCamera
  public control:FlyControls;



  constructor() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x94b9f8, 0.0015);
    this.camera = CameraFactory.create("PerspectiveCamera", {
      fov: 75,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
    });
    const light = new THREE.AmbientLight(0x404040, 10);
    this.scene.add(light);
    this.renderer = Renderer({
      scene: this.scene,
      camera: this.camera,
    });
    this.control = Control({
      speed: 10,
      renderer: this.renderer,
      camera: this.camera,
    });
    
    if (MyTreeApp.instance) return MyTreeApp.instance;
    MyTreeApp.instance = this;
  }
}


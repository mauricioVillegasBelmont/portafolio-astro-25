import * as THREE from "three";


import Renderer from "./Renderer";
import CameraFactory from "components/three_env.back/entities/Camera/CameraFactory";
import Control from "./ControlManager";

import FieldManager from "components/three_env.back/entities/Field/FieldManager";

import * as dat from "lil-gui";
import EventEmitter from "./EventEmiter"
import { WindowUtils } from "utils/windowUtils";
import { FlyControls } from "three/addons/controls/FlyControls.js";


export class MyTreeApp {
  static instance: MyTreeApp;

  control;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock = new THREE.Clock();
  scene = new THREE.Scene();
  camera = CameraFactory.create("PerspectiveCamera", {
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000,
  });
  eventEmiter = new EventEmitter();



  constructor() {
    this.scene.fog = new THREE.FogExp2(0x94b9f8, 0.0015);
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


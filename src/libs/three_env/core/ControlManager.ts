import * as THREE from "three";
import { FlyControls } from "three/addons/controls/FlyControls.js";
import EventEmitter from "libs/three_env/core/EventEmiter";


export interface AnimateCustomEvent extends CustomEvent<{clock: any;}>{}
type args = {
  speed: number;
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
};

export default function Control(args: args) {
  const { renderer, camera, speed } = args;
  const eventEmiter = new EventEmitter();
  const control = new FlyControls(camera, renderer.domElement);
  control.movementSpeed = speed;
  control.rollSpeed = Math.PI / 12;
  control.dragToLook = true;
  control.autoForward = false;
  control.movementSpeed = 150;

  eventEmiter.on("animation", (e: AnimateCustomEvent) => {
    const delta = e.detail.clock.getDelta();
    control.update(delta);
  });
  return control;
}
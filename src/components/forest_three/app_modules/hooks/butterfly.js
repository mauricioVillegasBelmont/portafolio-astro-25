import * as THREE from "three";
import { ThreeUtils } from "../utils/ThreeUtils"
import {clamp} from "../utils/utils"


export default class Butterfly {
  model;
  animationClips;
  animationMixer;
  characterAction;
  clockwise = true;
  noise;
  constructor(gltf) {
    this.model = gltf;
    this.animationMixer = new THREE.AnimationMixer(gltf.scene);
    this.animationClips = gltf.animations || {};
  }
  set clockwise(val){
    this.clockwise = val;
  }
  stAnimation(animationName) {
    const clip = THREE.AnimationClip.findByName(
      this.animationClips,
      animationName
    );

    this.characterAction = this.animationMixer.clipAction(clip);
    this.characterAction.play();
  }

  setPosition(args) {
    const { x=0, y=0, z=0 } = args;

    if (x) this.character.position.setX(x);
    if (y) this.character.position.setY(y);
    if (z) this.character.position.setZ(z);
  }
  setRotation(args) {
    const { x = 0, y = 0, z =0 } = args;
    if (x) this.character.rotation.x = x;
    if (y) this.character.rotation.y = y;
    if (z) this.character.rotation.z = z;
  }
  setScale(args) {
    const { x, y, z } = args;
  }

  fly() {


    var time = (Date.now() * 0.001)/2; // tiempo en segundos
    if (!this.clockwise) {
      time *= -1;
    }
    const origin = new THREE.Vector3(0, 0, 0);
    const radius = ThreeUtils.getDistance(origin, this.character.position);

    const frequencyYPosition = 0.005;
    const amplitudeYPosition = 1.2;


    const coordsX = radius * Math.cos(time);
    const coordsY = this.character.position.y;
    const coordsZ = radius * Math.sin(time);


    const noise = ThreeUtils.noiseHrlper(
      coordsX,
      coordsZ,
      frequencyYPosition,
      amplitudeYPosition,
    );

    // console.log(coordsY + noise);
    const coords = new THREE.Vector3(
      clamp(coordsX, -20, 20), // coordsX,
      clamp(coordsY + noise, -10, 10), //coordsY + noise,
      clamp(coordsZ, -20, 20), //coordsZ
    );

    const frequencyZSpin = 0.0005;
    const amplitudeZSpin = 1.2;
    const delta = ThreeUtils.getDistance(this.character.position, coords);
    const slopeX = ThreeUtils.noiseSlopeX(
      coordsX,
      coordsZ,
      delta,
      frequencyZSpin,
      amplitudeZSpin
    );
    // console.log(Math.atan(slopeX));


    const dx = 0 - this.character.position.x;
    const dy = 0 - this.character.position.y;
    const dz = 0 - this.character.position.z;


    var angle = Math.atan2(dx, dz);
    if (this.clockwise) {
      angle += Math.PI;
    }

    const rotation = new THREE.Vector3(
      Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)),
      angle,
      Math.atan(slopeX)
    );

    this.setPosition(coords);
    this.setRotation(rotation);

  }
  get character() {
    return this.model.scene;
  }
  update(args) {
    const { delta, scene, camera } = args;
    if (!this.characterAction) return;
    this.animationMixer.update(delta);
    this.fly();
  }
}

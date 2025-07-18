import * as THREE from "three";
import type { FlyControls } from "three/examples/jsm/Addons.js";

import TerrainGenerator from './TerrainGenerator';
import { type ThreeTerrainUpdateParams } from "./chunks/LandChunk";
import { createNoise2D } from "simplex-noise";

import * as dat from "lil-gui";

export default function FieldManager(scene: THREE.Scene, camera:THREE.PerspectiveCamera, control:FlyControls) {

  const noise = []
  for (let i = 0; i < 3; i++) {
    noise[i] = createNoise2D();
  }
  const chunkManager = new TerrainGenerator();
  

  const generate = () => {
    chunkManager.generate();
  }
  control.addEventListener("change", () => {
    generate();
  });
  generate();
  return{
    chunkManager,
  }
}

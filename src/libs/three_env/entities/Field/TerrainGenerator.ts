import * as THREE from "three";
import { createNoise2D, type NoiseFunction2D } from "simplex-noise";
import alea from 'alea';
import { configParamsHook } from "libs/three_env/entities/Field/hooks/configParamsHook";
import { threeAppHook } from "libs/three_env/core/Hooks/ThreeAppHook";

import LandChunk, {
  type ThreeTerrainUpdateParams,
} from "libs/three_env/entities/Field/chunks/LandChunk";
// import LandTreeGenerator from "libs/three_env/entities/Landtree/Landtree";


import TopographyTileChunk from "./chunks/TopographyTileChunk";

type ChunkManagerArgs = {
  scene?: THREE.Scene;
  position?: THREE.Object3D["position"];
  // params?: ThreeTerrainUpdateParams;
};
// type FieldChunk = { [key: string]: LandChunk };

const {fieldConfigNoiseParams} = configParamsHook()
const { scene, camera,  } = threeAppHook();

export default class TerrainGenerator {
  noise: NoiseFunction2D[] = [];
  chunkSize = 100;
  fieldChunks = new Map<string, THREE.LOD<THREE.Object3DEventMap>>();
  range = 0;
  LODManage = {
    1: 0,
    // 2: 500,
    // 3: 900,
    // 4: 1000,
  };
  // trees = LandTreeGenerator();

  // params: ThreeTerrainUpdateParams = {
  //   amplitude: 3,
  //   frequency: { x: 2, z: 2 },
  //   lacunarity: 1,
  //   persistance: 1,
  //   octaves: 1,
  // };

  constructor() {
    for (let i = 0; i < 5; i++) {
      this.noise[i] = createNoise2D(alea('seed'));
    }
  }

  createChunk(position: THREE.Vector3) {
    const LOD = new THREE.LOD();
    

    for (const [key, value] of Object.entries(this.LODManage)) {
      const args = {
        position: position,
        chunkSize: this.chunkSize,
        params: fieldConfigNoiseParams,
        noise: this.noise,
        LOD: Number(key),
        direction: Math.sign(-1) as 1 | -1,
      };
      // const chunk = new LandChunk(args);
      const chunk = new TopographyTileChunk(args);
      const ChunkObject = new THREE.Object3D();
      ChunkObject.children.push(chunk);
      // if (Number(key) < 4) {
      //   this.trees[0].position.copy(position);
      //   ChunkObject.children.push(this.trees[0].clone());
      // }
      LOD.addLevel(ChunkObject, value);
      LOD.position.copy(position);
      LOD.updateMatrix();
    }
    return LOD;
  }

  // private updatePosition(camera: THREE.Camera, scene: THREE.Scene) {
  generate() {
    // const { position, scene } = args;
    const { x, z } = camera.position;
    const cx = Math.floor(x / this.chunkSize);
    const cz = Math.floor(z / this.chunkSize);

    for (let keyX = cx - this.range; keyX <= cx + this.range; keyX++) {
      for (let keyZ = cz - this.range; keyZ <= cz + this.range; keyZ++) {
        // const key = { x: keyX, z: keyZ };
        const key = `${keyX}|${keyZ}`;

        // console.log(fieldChunks);
        if (!this.fieldChunks.has(key)) {
          const position = new THREE.Vector3(keyX, 0, keyZ);
          position.multiplyScalar(this.chunkSize);
          const newChunk = this.createChunk(position);
          newChunk.name = `${keyX}|${keyZ}`;
          this.fieldChunks.set(key, newChunk);
        }
        const chunk = this.fieldChunks.get(key);
        if (chunk && chunk.parent !== scene) {
          scene.add(chunk);
        }

        /* dismisables */
        const dismissArray = [
          `${cx - this.range - 1}|${keyZ}`,
          `${cx + this.range + 1}|${keyZ}`,
          `${keyX}|${cz - this.range - 1}`,
          `${keyX}|${cz + this.range + 1}`,
        ];
        dismissArray.forEach((dismissKey) => {
          const dismissChunk = this.fieldChunks.get(dismissKey);
          if (dismissChunk && dismissChunk.parent === scene) {
            scene.remove(dismissChunk);
          }
        });
      }
    }
  }
  updateParams() {
    const chunks = [...this.fieldChunks.values()];
    for (const chunk of chunks) {
      scene.remove(chunk);
    }
    this.fieldChunks.clear();
    this.generate();
  }
}

import * as THREE from "three";

import { configParamsHook } from "libs/three_env/entities/Field/hooks/configParamsHook";
import { threeAppHook } from "libs/three_env/core/Hooks/ThreeAppHook";


import LandChunk, {
  type ThreeTerrainUpdateParams,
} from "libs/three_env/entities/Field/chunks/LandChunk";
import TopographyTileChunk from "./chunks/TopographyTileChunk";

type ChunkManagerArgs = {
  scene?: THREE.Scene;
  position?: THREE.Object3D["position"];
  params?: ThreeTerrainUpdateParams;
};
interface TerrainGeneratorConfig{
  chunkSize?:number;
  range?:number;
  type?:'default'|'topography'
  lod?:{[key:number]:number}
}


const { scene, camera,  } = threeAppHook;

export default class TerrainGenerator {

  fieldChunks = new Map<string, THREE.LOD<THREE.Object3DEventMap>>();

  chunkSize:number;
  range:number;

  chcunkFactory;
  LODConfig:{[key:number]:number}
  
  constructor(config:TerrainGeneratorConfig={}) {
    
    this.chunkSize = config.chunkSize|| 100;
    this.range = config.range|| 3;
    const type = config.type||'default'
    this.LODConfig = config.lod||{
      1: 0,
    }
    switch (type) {
      case 'topography':
        this.chcunkFactory = TopographyTileChunk;
        break
      case 'default':
      default:
        this.chcunkFactory = LandChunk;
        break
    }
  }

  createChunk(position: THREE.Vector3) {
    const LOD = new THREE.LOD();
    for (const [key, value] of Object.entries(this.LODConfig)) {
      const args = {
        position: position,
        chunkSize: this.chunkSize,
        LOD: Number(key),
      };
      const chunk = new this.chcunkFactory(args);
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
  update() {
    const chunks = [...this.fieldChunks.values()];
    for (const chunk of chunks) {
      scene.remove(chunk);
    }
    this.fieldChunks.clear();
    this.generate();
  }
}

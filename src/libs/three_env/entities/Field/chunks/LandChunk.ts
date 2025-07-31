import * as THREE from "three";
import type { NoiseFunction2D } from "simplex-noise";
import { isMobile } from "mobile-device-detect";
import { configParamsHook } from "libs/three_env/entities/Field/hooks/configParamsHook";

import { LandMaterialShader } from "libs/three_env/materials/InkShaderMaterial";
// import {LandMaterialShader} from "@/app/hooks/InkShaderMaterial"


export interface noiseParams{
  amplitude: number;
  persistance: number;
  lacunarity: number;
  octaves: number;
  frequency: number;
  level:number;
}
export interface ThreeTerrainUpdateParams {
  [key:string]:noiseParams
}

export interface LandChunkArgs {
  chunkSize?: number;
  position?: THREE.Object3D["position"];
  noise?: NoiseFunction2D[];
  LOD?: number;
}

export default class LandChunk extends THREE.Mesh {
  noise: NoiseFunction2D[] = [];
  chunkSize: number = 200;
  LOD: number = 0;
  density: number = isMobile ? 2 : 1;
  position = new THREE.Vector3(0, 0, 0) as THREE.Object3D["position"];


  constructor(args: LandChunkArgs) {
    const {
      chunkSize = 200,
      position = new THREE.Vector3(0, 0, 0),
      LOD = 2,
    } = args;

    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const geometry = new THREE.PlaneGeometry(0, 0, 1, 1);

    super(geometry, material);
    (<any>this.material).dispose();
    this.position.copy(position);
    this.chunkSize = chunkSize;
    this.LOD = LOD;
    this.updateGeometry();
    this.updateTopography();
  }

  get subdivisions() {
    const subdivisiones = Math.round(
      Math.max(Math.floor(this.chunkSize * 0.5 ** this.LOD), this.density) /
        this.density
    );
    return subdivisiones;
  }
  get reliefMap() {
    return this.geometry.getAttribute("position");
  }
  get height() {
    if (!this.geometry.getAttribute("height")) {
      this.geometry.setAttribute(
        "height",
        new THREE.BufferAttribute(new Float32Array(this.reliefMap.count), 1)
      );
    }
    const heightAttr = this.geometry.getAttribute("height");
    return heightAttr;
  }

  public updateGeometry() {
    this.geometry.dispose();

    const subdivisions = this.subdivisions;
    this.geometry = new THREE.PlaneGeometry(
      this.chunkSize,
      this.chunkSize,
      subdivisions,
      subdivisions
    );
    this.geometry.rotateX(-Math.PI / 2);
  }

  public updateTopography() {
    const {configParams, noise} = configParamsHook


    this._terrain(configParams['base'],noise);
    // this._terrain(configParams['hills'],noise);

    this.reliefMap.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  private _terrain(args:noiseParams, noise:NoiseFunction2D[]){
    const {
      amplitude,
      frequency,
      lacunarity = 1,
      persistance = 1,
      octaves = 1,
      level,
    } = args
    const posAttr = this.reliefMap;
    const heightAttr = this.height;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i) + this.position.x;
      const z = posAttr.getZ(i) + this.position.z;
      let y = 0;
      for (let octave = 0; octave < octaves; octave++) {
        const _amplitud = amplitude * persistance ** (octave+ 1);
        const _freq = lacunarity ** (octave + 1);
        const argX = x * frequency * 0.01 * _freq + octave;
        const argZ = z * frequency * 0.01 * _freq + octave;
        y += noise[octave](argX, argZ) * _amplitud;
      }
      const _y = Math.max(y, level);
      heightAttr.setX(i, _y);
      posAttr.setY(i, _y); 
    }
  }
}

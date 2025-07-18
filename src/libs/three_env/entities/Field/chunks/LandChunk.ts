import * as THREE from "three";
import type { NoiseFunction2D } from "simplex-noise";
import { isMobile } from "mobile-device-detect";
import { LandMaterialShader } from "libs/three_env/materials/InkShaderMaterial";
// import {LandMaterialShader} from "@/app/hooks/InkShaderMaterial"



export interface ThreeTerrainUpdateParams {
  amplitude?: number;
  persistance?: number;
  lacunarity?: number;
  octaves?: number;
  frequency?: {
    x: number;
    z: number;
  };
}

export interface LandChunkArgs {
  chunkSize?: number;
  position?: THREE.Object3D["position"];
  params?: ThreeTerrainUpdateParams;
  noise?: NoiseFunction2D[];
  LOD?: number;
}

export default class LandChunk extends THREE.Mesh {
  noise: NoiseFunction2D[] = [];
  chunkSize: number = 200;
  LOD: number = 0;
  density: number = isMobile ? 2 : 1;
  position = new THREE.Vector3(0, 0, 0) as THREE.Object3D["position"];

  params: Required<ThreeTerrainUpdateParams> = {
    amplitude: 1,
    frequency: {
      x: 0,
      z: 0,
    },
    lacunarity: 0.5,
    persistance: 0.5,
    octaves: 5,
  };

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

  constructor(args: LandChunkArgs) {
    const {
      chunkSize = 200,
      position = new THREE.Vector3(0, 0, 0),
      params = {},
      noise = [],
      LOD = 2,
    } = args;

    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const geometry = new THREE.PlaneGeometry(0, 0, 1, 1);

    super(geometry, material);
    (<any>this.material).dispose();
    this.position.copy(position);
    this.chunkSize = chunkSize;
    this.noise = noise;
    this.LOD = LOD;
    this.updateParams(params);
    this.updateGeometry();
    this.updateTopography();
  }
  public updateParams(params: ThreeTerrainUpdateParams | {}) {
    this.params = { ...this.params, ...params };
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
    const {
      amplitude,
      frequency,
      lacunarity = 1,
      persistance = 1,
      octaves = 1,
    } = this.params;

    const { x: fx, z: fz } = frequency;
    const posAttr = this.reliefMap;
    const heightAttr = this.height;


    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i) + this.position.x;
      const z = posAttr.getZ(i) + this.position.z;
      if (this.LOD === 0) {
        console.log(`x:${x},z:${z}`);
      }

      let y = 0;
      for (let octave = 0; octave < octaves; octave++) {
        const _amplitud = amplitude * persistance ** octave;
        const _frequency = lacunarity ** octave;
        const argX = x * fx * 0.01 * _frequency;
        const argZ = z * fz * 0.01 * _frequency;
        y += this.noise[octave](argX, argZ) * _amplitud;
      }
      heightAttr.setX(i, y);
      posAttr.setY(i, y); //Math.max(y, -2));
    }
    posAttr.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }
}

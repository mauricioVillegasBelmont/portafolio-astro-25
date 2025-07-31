import type { ThreeTerrainUpdateParams,noiseParams } from "libs/three_env/entities/Field/chunks/LandChunk";
import { createNoise2D, type NoiseFunction2D } from "simplex-noise";
import alea from 'alea';

const createConfigParamsHook = () => {
  let maxOctaves = 5;
  const configParams: ThreeTerrainUpdateParams = {
    base:{
      amplitude: 5,
      persistance: 1.2,
      lacunarity: 1.5,
      octaves: 1,
      frequency: 0.3,
      level:-1,
    },
    hills:{
      amplitude: 5,
      persistance: 1.2,
      lacunarity: 1.5,
      octaves: 1,
      frequency: 0.3,
      level:-1,
    },
    mountains:{
      amplitude: 5,
      persistance: 1.2,
      lacunarity: 1.5,
      octaves: 1,
      frequency: 0.3,
      level:-1,
    },
    grass:{
      amplitude: 5,
      persistance: 1.2,
      lacunarity: 1.5,
      octaves: 1,
      frequency: 0.3,
      level:-1,
    },
    trees:{
      amplitude: 5,
      persistance: 1.2,
      lacunarity: 1.5,
      octaves: 1,
      frequency: 0.3,
      level:-1,
    },
  };
  const noise =[]
  for (let i = 0; i < maxOctaves; i++) {
    noise[i] = createNoise2D(alea('seed'));
  }


  return {
    maxOctaves:maxOctaves,
    configParams:configParams,
    updateConfigParams:(key:keyof ThreeTerrainUpdateParams='base',prop:keyof noiseParams, value:number )=>{
      configParams[key][prop] = value
    },
    noise:noise,
  }
}

export const configParamsHook = createConfigParamsHook();
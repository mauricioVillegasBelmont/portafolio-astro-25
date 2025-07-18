import type { ThreeTerrainUpdateParams } from "../entities/Field/chunks/LandChunk";

export function configParamsHook(){
  const fieldConfigNoiseParams: Required<ThreeTerrainUpdateParams> = {
    amplitude: 5,
    persistance: 1.20,
    lacunarity: 1.5,
    octaves: 5,
    frequency: { x: 0.125, z: 0.125 },
  };


  return {
    fieldConfigNoiseParams:fieldConfigNoiseParams,
  }
}
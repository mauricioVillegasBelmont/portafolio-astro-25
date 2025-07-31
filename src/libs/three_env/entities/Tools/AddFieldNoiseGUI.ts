
import type TerrainGenerator from "libs/three_env/entities/Field/TerrainGenerator";
import { configParamsHook } from "libs/three_env/entities/Field//hooks/configParamsHook";

import type { ThreeTerrainUpdateParams,noiseParams } from "libs/three_env/entities/Field/chunks/LandChunk";

import * as dat from "lil-gui";
export const gui = new dat.GUI();




export function addFieldNoiseGUI(
  chunkManager:TerrainGenerator,
){
  const { maxOctaves,configParams, updateConfigParams} = configParamsHook
  
  const noiseGUIConfig={
    amplitude: {
      min:0,
      max:50,
      inc:1,
    },
    persistance: {
      min:0,
      max:10,
      inc:0.1,
    },
    lacunarity: {
      min:-5,
      max:5,
      inc:.1,
    },
    octaves: {
      min:1,
      max:maxOctaves,
      inc:1,
    },
    frequency: {
      min:0.01,
      max:3,
      inc:.01,
    },
    level:{
      min:-20,
      max:20,
      inc:.1,
    },
  }
  
  for (const [key, conf] of Object.entries(configParams)){
    const guiFolder = gui.addFolder(`${key} - Noise Control`);
    for( const [prop, value]  of Object.entries(conf)){
      const {min,max,inc}= noiseGUIConfig[prop as keyof noiseParams];

      guiFolder
        .add(conf, `${(prop as keyof noiseParams )}`, min, max,inc)
        .onChange((value:number) => {
          updateConfigParams(
            (key as keyof ThreeTerrainUpdateParams),
            `${(prop as keyof noiseParams )}`,
            value
          );
          chunkManager.update();
        });
    }
  }
}
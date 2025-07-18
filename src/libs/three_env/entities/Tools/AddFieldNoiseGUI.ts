
import type TerrainGenerator from "libs/three_env/entities/Field/TerrainGenerator";
import { configParamsHook } from "libs/three_env/entities/Field//hooks/configParamsHook";


import {gui} from './GUI'

export function addFieldNoiseGUI(
  chunkManager:TerrainGenerator,
){
  const { fieldConfigNoiseParams, } = configParamsHook()
  

  const guiFolder = gui.addFolder('Field noise control');
  guiFolder
    .add(fieldConfigNoiseParams, "amplitude", 0, 50, 0.1)
    .onChange(() => {
      chunkManager.updateParams();
    });
  guiFolder
    .add(fieldConfigNoiseParams, "persistance", 0, 10, 0.05)
    .onChange(() => {
      chunkManager.updateParams();
    });

  guiFolder
    .add(fieldConfigNoiseParams, "lacunarity", -5, 5, 0.05)
    .onChange(() => {
      chunkManager.updateParams();
    });
  guiFolder
    .add(fieldConfigNoiseParams, "octaves", 0, 10, 1)
    .onChange(() => {
      chunkManager.updateParams();
    });

  guiFolder
    .add(fieldConfigNoiseParams.frequency, "x", 0.001, 1, 0.001)
    .onChange(() => {
      chunkManager.updateParams();
    })
    .onChange(() => {
      chunkManager.updateParams();
    });
  guiFolder
    .add(fieldConfigNoiseParams.frequency, "z", 0.001, 1, 0.001)
    .onChange(() => {
      chunkManager.updateParams();
    });
}
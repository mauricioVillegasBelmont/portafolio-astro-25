import * as THREE from "three";
import { ThreeUtils } from "libs/three_env/utils/ThreeUtils";

import vertexShader from "./inkShader/vertexShader.glsl?raw";
import fragmentShader from "./inkShader/fragmentShader.glsl?raw";
import perlinNoise_fragment from "./inkShader/perlinNoise_fragment.glsl?raw";

(THREE.ShaderChunk as Record<string, any>)["perlinNoise_fragment"] =
  perlinNoise_fragment;

// import global_fragment from "./shaders/inkShader/global_fragment.glsl";

export const LandMaterialShader = InkShaderMaterial(3, -2, 0.325, 0xff6a43, 0x4a44ff);
export function InkShaderMaterial(
  maxY: number,
  minY: number,
  maxAlpha = 0.325,
  nearColor = 0x000000,
  farColor = 0x000000,

  iResolution = 1,
  iTime = 0,
) {

  // THREE.ShaderChunk.global_fragment = global_fragment;
  const GLSLNearColor = ThreeUtils.hexToGL(nearColor);
  const GLSLFarColor = ThreeUtils.hexToGL(farColor);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      maxY: { value: maxY },
      minY: { value: minY },
      maxAlpha: { value: maxAlpha },
      nearColorGL: { value: GLSLNearColor },
      farColorGL: { value: GLSLFarColor },
      positionOffset: { value: new THREE.Vector3() },
      iTime: { value: new THREE.Vector3() },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true, // Permitir transparencia
  });
  return material;
}

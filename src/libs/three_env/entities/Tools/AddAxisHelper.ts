import { threeAppHook } from "libs/three_env/core/Hooks/ThreeAppHook";
import * as THREE from "three";

const { scene, camera, control } = threeAppHook;

export function addAxisHelper(){
  const axesHelper = new THREE.AxesHelper(2);
  axesHelper.position.copy(new THREE.Vector3(camera.position.x - .5, camera.position.y - 1, camera.position.z - 5));
  scene.add(axesHelper);
  control.addEventListener("change", () => {
    axesHelper.position.copy(new THREE.Vector3(camera.position.x - .5, camera.position.y - 1, camera.position.z - 5));
  });
}
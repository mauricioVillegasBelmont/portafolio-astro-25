import * as THREE from "three";

export function addAxisHelper(
  scene:THREE.Scene,
  camera:THREE.PerspectiveCamera,
){
  const axesHelper = new THREE.AxesHelper(2);
  axesHelper.position.copy(new THREE.Vector3(camera.position.x - .5, camera.position.y - 1, camera.position.z - 1.5));
  scene.add(axesHelper);
}
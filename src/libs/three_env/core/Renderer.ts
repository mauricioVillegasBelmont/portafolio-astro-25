import * as THREE from "three";
import EventEmitter from "components/three_env.back/core/EventEmiter";
type args = {
  width?: number;
  height?: number;
  scene:THREE.Scene;
  camera:THREE.Camera;
};
export default function Renderer(args: args) {
  const { width, height, scene, camera } = args;
  const renderer = new THREE.WebGLRenderer();
  const eventEmiter = new EventEmitter();


  renderer.setSize(width ?? window.innerWidth, height ?? window.innerHeight);
  eventEmiter.on("resize", (e: WindowEventHandlers) => {
    renderer.setSize(width ?? window.innerWidth, height ?? window.innerHeight);
  });

  eventEmiter.on("animation", (e: WindowEventHandlers) => {
    renderer.render(scene, camera);
  });

  return renderer;
}

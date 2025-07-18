import * as THREE from "three";
import EventEmitter from "libs/three_env/core/EventEmiter";

export interface PerspectiveCameraProps {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}
export default function PerspectiveCameraBuilder(props: PerspectiveCameraProps) {
  const {
    fov = 75,
    aspect = window.innerWidth / window.innerHeight,
    near = 0.1,
    far = 1000,
  } = props;
  const eventEmiter = new EventEmitter();
  const camera = new THREE.PerspectiveCamera(fov,aspect,near,far) as THREE.PerspectiveCamera;
  eventEmiter.on("resize", (e: WindowEventHandlers) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  return camera;
}

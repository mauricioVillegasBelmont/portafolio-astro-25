import PerspectiveCameraBuilder, {
  type PerspectiveCameraProps,
} from "./PerspectiveCamera/PerspectiveCameraBuilder";

export default class CameraFactory {
  static create(type:string, options:{[key:string]:any}) {
    switch (type) {
      case "PerspectiveCamera":
        return PerspectiveCameraBuilder(options as PerspectiveCameraProps);
      default:
        throw new Error("Camera type not supported");
    }
  }
}
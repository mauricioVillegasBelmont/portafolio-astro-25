import * as THREE from 'three'

import { ThreeCoreBuilder } from "./hooks/ThreeEnvironment";
import  ModelLoaderAPI  from "./API/modelsAPI";

import Butterfly from "./hooks/butterfly";

class ThreeEnvironment {
  scene;
  camera;
  textureLoader;
  handleResizers;
  assets_path;

  textureLoader = new THREE.TextureLoader();
  sceneAnimations = {};
  constructor(id, assets_path) {
    const self = this;
    const {
      scene,
      camera,
      textureLoader,
      handleResizers,
      animate,
      sceneAnimations,
      sceneAdd,
    } = ThreeCoreBuilder(id);
    this.scene = scene;
    this.camera = camera;
    this.handleResizers = handleResizers;
    this.animate = animate;
    this.assets_path = assets_path;
    this.textureLoader = textureLoader;
    this.sceneAnimations = sceneAnimations;

    this.init();
  }

  init() {

    this.setListeners();
    this.setedEnvironment();
    this.handleResizers();
    this.animate();
    this.setCharacters();
  }

  setListeners() {
    window.addEventListener("resize", this.handleResizers);
  }

  setedEnvironment() {
    const textureEquirec = this.textureLoader.load(
      this.assets_path + "/img/textures/forest.jpg"
    );
    textureEquirec.mapping = THREE.EquirectangularRefractionMapping;
    textureEquirec.colorSpace = THREE.SRGBColorSpace;
    this.scene.background = textureEquirec;
  }
  setCharacters() {
    let path = this.assets_path + "/models/butrefly-test.gltf";
    ModelLoaderAPI.getModel(path).then((model) => {
      const buterfly0 = new Butterfly(model);
      buterfly0.setPosition({
        x: 10,
        y:5,
      });
      this.sceneAnimations["buterfly0"] = buterfly0;
      this.sceneAnimations["buterfly0"].stAnimation("flying");
      this.sceneAnimations["buterfly0"].clockwise = true;
      this.scene.add(this.sceneAnimations["buterfly0"].character);
    });
    ModelLoaderAPI.getModel(path).then((model) => {
      const buterfly2 = new Butterfly(model);
      buterfly2.setPosition({
        x: 3,
        y:2,
        z: 7,
      });
      this.sceneAnimations["buterfly2"] = buterfly2;
      this.sceneAnimations["buterfly2"].stAnimation("flying");
      this.sceneAnimations["buterfly2"].clockwise = true;
      this.scene.add(this.sceneAnimations["buterfly2"].character);
    });
  }
}
export { ThreeEnvironment }
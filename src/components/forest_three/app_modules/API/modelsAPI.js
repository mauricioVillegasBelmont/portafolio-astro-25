import * as THREE from 'three'
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("three/addons/libs/draco/");

var loader = new GLTFLoader();
export default class ModelLoaderAPI {
// export default function modelLoaderAPI(path) {
  static getModel(path){

    loader.setDRACOLoader(dracoLoader);
    return new Promise((resolve, reject) => {
      loader.load(
        path,
        function (model) {
          resolve(model);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        }
      );
    });
  }
}
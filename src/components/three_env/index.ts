import WebGL from "three/addons/capabilities/WebGL.js";
import * as THREE from "three";


import {type AnimateCustomEvent}from 'libs/three_env/core/ControlManager'

import { MyTreeApp } from "libs/three_env/core/MyTreeApp";
import type EventEmitter from "libs/three_env/core/EventEmiter";
import { threeAppHook } from "libs/three_env/core/Hooks/ThreeAppHook";
import TerrainGenerator from "libs/three_env/entities/Field/TerrainGenerator";
import {addFieldNoiseGUI} from "libs/three_env/entities/Tools/AddFieldNoiseGUI"
import { addAxisHelper } from "libs/three_env/entities/Tools/AddAxisHelper";



if(WebGL.isWebGL2Available()) {
  init()
} else {
  const warning = WebGL.getWebGL2ErrorMessage()
  document.body.appendChild(warning);
}

function init(){
  const { renderer, scene, eventEmiter, clock, camera, control } = threeAppHook

  camera.position.set(-0, 15, 100)
  document.getElementById("three")?.appendChild(renderer.domElement);
  
  
  const chunkManager = new TerrainGenerator();
  control.addEventListener("change", () => {
    chunkManager.generate();
  });
  
  navigationEvets(clock,eventEmiter);
  


  addFieldNoiseGUI(chunkManager)
  addAxisHelper()
}

function navigationEvets(clock: THREE.Clock,eventEmiter: EventEmitter) {

  window.addEventListener("resize", (e) => {
    eventEmiter.emit("resize", e);
  });

  const handleAnimateCustomEvent = (e: AnimateCustomEvent) => {
    eventEmiter.emit("animation", e);
  };
  window.addEventListener(
    "animation",
    handleAnimateCustomEvent as EventListener
  );
  const animationEvent = new CustomEvent("animation", {
    detail: {
      clock: clock,
    },
  });
  const animate = () => {
    window.dispatchEvent(animationEvent);
    requestAnimationFrame(animate);
  };
  animate();
}


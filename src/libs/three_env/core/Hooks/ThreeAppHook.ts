import { MyTreeApp } from "libs/three_env/core/MyTreeApp";

function threeAppInit(){
  const app = new MyTreeApp();
  const { 
    renderer,
    scene,
    eventEmiter,
    clock,
    camera,
    control 
  } = app
  return{ 
    renderer,
    scene,
    eventEmiter,
    clock,
    camera,
    control 
  }
}

export const threeAppHook = threeAppInit()
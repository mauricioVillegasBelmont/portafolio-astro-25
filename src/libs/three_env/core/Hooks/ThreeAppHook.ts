import { MyTreeApp } from "libs/three_env/core/MyTreeApp";

export function threeAppHook(){
  const app = new MyTreeApp();
  const { 
    renderer,
    scene,
    eventEmiter,
    clock,
    camera,
    control 
  } = app
  return{ renderer,
    scene,
    eventEmiter,
    clock,
    camera,
    control 
  }
}
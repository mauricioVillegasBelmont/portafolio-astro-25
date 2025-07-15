import { MyTreeApp } from "../core/MyTreeApp";

export function threeAppHook(){
  const { renderer, scene, eventEmiter, clock, camera, control } = new MyTreeApp();
  return{ renderer, scene, eventEmiter, clock, camera, control }
}
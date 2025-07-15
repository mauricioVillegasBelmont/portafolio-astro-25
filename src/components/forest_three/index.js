import WebGL from 'three/addons/capabilities/WebGL.js';
import {ThreeEnvironment} from './app_modules/three_canvas.js'
const path = import.meta.env.BASE_URL??'';
if (WebGL.isWebGL2Available()) {
  new ThreeEnvironment("three", `${path}`);
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}

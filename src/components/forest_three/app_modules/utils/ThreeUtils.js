import { Color, Vector3 } from "three";
import { createNoise2D } from "simplex-noise";
export class ThreeUtils {
  static glToHex(glslStr) {
    const GLSLString = glslStr.replace("vec3(", "").replace(")", "");
    let arr = GLSLString.split(",").map(Number);
    for (let val of arr) {
      if (val > 1 || val < 0) {
        return "";
      }
    }
    let col = new Color().fromArray(arr);
    return `0x${col.getHexString()}`;
  }

  static hexToGL(hexColor) {
    // Extraer los componentes RGB del valor hexadecimal
    const r = ((hexColor >> 16) & 0xff) / 255; // Componente rojo
    const g = ((hexColor >> 8) & 0xff) / 255; // Componente verde
    const b = (hexColor & 0xff) / 255; // Componente azul

    // Crear y devolver el THREE.Vector3 con los valores normalizados
    return new Vector3(r, g, b);
  }
  static getDistance(v1, v2) {
    return v1.distanceTo(v2);
  }

  static noiseHrlper(x, y, frequency = 1, amplitude = 1) {
    const noise2D = createNoise2D();
    return noise2D(x * frequency, y * frequency) * amplitude; // Ruido Perlin en 2D
  }
  static noiseSlopeX(x, z, delta, frequency = 1, amplitude = 1) {
    const y1 = this.noiseHrlper(x, z, frequency, amplitude);
    const y2 = this.noiseHrlper(x + delta, z, frequency, amplitude);
    return (y2 - y1) / delta;
  }
}

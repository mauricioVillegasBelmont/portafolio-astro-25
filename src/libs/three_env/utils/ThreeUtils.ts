import { Color, Vector3, Object3D, Box3 } from "three";

export class ThreeUtils {
  static glToHex(glslStr: string) {
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

  static hexToGL(hexColor: number) {
    // Extraer los componentes RGB del valor hexadecimal
    const r = (((hexColor as number) >> 16) & 0xff) / 255; // Componente rojo
    const g = (((hexColor as number) >> 8) & 0xff) / 255; // Componente verde
    const b = ((hexColor as number) & 0xff) / 255; // Componente azul

    // Crear y devolver el THREE.Vector3 con los valores normalizados
    return new Vector3(r, g, b);
  }

  static getDimentions(obj: Object3D) {
    const boundingBox = new Box3().setFromObject(obj);
    const target = new Vector3();
    return boundingBox.getSize(target);
  }
}

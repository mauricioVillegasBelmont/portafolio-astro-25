
/**
 * Modifica los vértices de un mesh según los valores de luminosidad de una imagen
 * @param {THREE.Mesh} mesh - El mesh a modificar
 * @param {string} imageName - Nombre/URL de la imagen a cargar
 * @param {Object} options - Opciones adicionales
 * @param {number} [options.intensity=1] - Intensidad del efecto (escala de modificación en Z)
 * @param {boolean} [options.normalize=true] - Normaliza los valores entre -1 y 1
 * @returns {Promise} Promesa que se resuelve cuando se completa el proceso
*/
import * as THREE from 'three';
import get_maps from 'libs/three_env/entities/Field/chunks/tools/getTopoMap'



interface options{
  intensity?:number;
  normalize?:boolean;
  rotationSteps?:number,
  direction?:'CW'|'CCW'
}

export default async function modifyVerticesWithImage(mesh:THREE.Mesh, imageName:string, options:options = {}):Promise<THREE.Mesh> {
  const settings:Required<options> = {
    intensity: options.intensity || 1,
    normalize: options.normalize !== false,
    rotationSteps: options.rotationSteps || 0,
    direction: options.direction || 'CW'
  };

  const rotation = (Math.PI/2 * settings.rotationSteps) * (settings.direction === 'CW' ? 1 : -1)

  // Cargar la imagen
  const texture = await new THREE.TextureLoader().loadAsync(imageName);
  const image = texture.image;
  if (!image || image.width === 0 || image.height === 0) {
    throw new Error(`Imagen inválida o no cargada: ${imageName}`);
  }
  
  // Crear canvas para procesamiento
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d')!;
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotation);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.restore();

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  
  if (!mesh.geometry || !mesh.geometry.getAttribute('position') || mesh.geometry.getAttribute('position').count === 0) {
    throw new Error(`no mesh error`);
  }
  
  // Obtener atributos de posición
  const geometry = mesh.geometry;
  const positions = geometry.getAttribute('position');
  
  // Verificar valores NaN
  for (let i = 0; i < positions.count * 3; i++) {
    if (isNaN(positions.array[i])) {
      positions.array[i] = 0; // Asignar valor por defecto
    }
  }
  positions.needsUpdate = true;

  // Calcular bounding box (asegurándose que no hay NaN)
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox!;

  // Procesar luminosidad
  let minLum = Infinity;
  let maxLum = -Infinity;
  const luminosities: number[] = [];

  // Primera pasada: calcular luminosidades
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);

    // Mapear a coordenadas UV
    const u = (x - bbox.min.x) / (bbox.max.x - bbox.min.x);
    const v = 1 - (y - bbox.min.y) / (bbox.max.y - bbox.min.y); // Invertir V

    const imgX = Math.floor(u * (canvas.width - 1));
    const imgY = Math.floor(v * (canvas.height - 1));
    const idx = (imgY * canvas.width + imgX) * 4;

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const luminosity = 0.299 * r + 0.587 * g + 0.114 * b;

    luminosities.push(luminosity);
    minLum = Math.min(minLum, luminosity);
    maxLum = Math.max(maxLum, luminosity);
  }

  // Segunda pasada: modificar vértices
  for (let i = 0; i < positions.count; i++) {
    let zValue: number;
    const lum = luminosities[i];

    if (settings.normalize) {
      zValue = ((lum - minLum) / (maxLum - minLum)) * 2 - 1;
    } else {
      zValue = 1 - (lum / 127.5);
    }

    positions.setZ(i, zValue * settings.intensity);
  }

  // Actualizar geometría
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox(); // Recalcular con nuevos valores

  return mesh;
}
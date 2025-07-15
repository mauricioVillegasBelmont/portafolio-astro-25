uniform float minY;
uniform float maxY;
uniform float maxAlpha;

varying float vDistanceXZ;
varying float yOpacity;

varying vec3 wPosition;
varying vec4 mvPosition;

/* FOR NOISE WATERCOLOR */



void main() {
  // DISTANCIA HORIZONTAL - XZ pero solo desde el origen 0,0 colores mas rojos X,Z colores mas azules a medida qeu te mueves
  // Calcula la distancia en el plano XZ del vértice a la cámara
  // vec4 viewPosition = modelViewMatrix * vec4(position, 1.0); // Transformar al espacio de cámara

  mvPosition = vec4(position, 1.0);

  #ifdef USE_BATCHING

    mvPosition = batchingMatrix * mvPosition;

  #endif

  #ifdef USE_INSTANCING

    mvPosition = instanceMatrix * mvPosition;

  #endif

  mvPosition = viewMatrix * modelMatrix * mvPosition;
  wPosition = (modelMatrix * mvPosition).xyz;


  vec2 vertexXZ = mvPosition.xz;; // Extraer XZ en espacio de cámara
  vec2 cameraXZ = vec2(0.0, 0.0); // La cámara en el espacio de cámara está en (0, 0)
  vDistanceXZ = distance(cameraXZ, vertexXZ);


  float y = position.y;
  yOpacity = ((y - minY) / (maxY - minY)  * maxAlpha);



  gl_Position = projectionMatrix * mvPosition;

}
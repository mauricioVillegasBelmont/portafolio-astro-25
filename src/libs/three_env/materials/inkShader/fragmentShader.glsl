uniform vec3 nearColorGL;
uniform vec3 farColorGL;
uniform vec3 positionOffset;

varying float vDistanceXZ;
varying float yOpacity;
varying vec3 wPosition;


#include <perlinNoise_fragment>
// #include <poject_vertex_fragment>
void main() {
  // Definir límites de distancia (cerca y lejos)
  float near = 100.0;
  float far = 800.0;
  // Interpolación del color basado en la distancia en XZ
  float t = clamp((vDistanceXZ - near) / (far - near), 0.0, 1.0);
  vec3 color = mix(nearColorGL, farColorGL, t);

  // Coordenadas para el ruido (puedes ajustarlas según la escala de tu malla)
  float offsetX = (wPosition.x + positionOffset.x) * 0.001;
  float offsetY = (wPosition.y + positionOffset.z) * 0.001;
  vec2 noiseCoords = vec2(gl_FragCoord.x + offsetX, gl_FragCoord.y + offsetY);

  // Generar ruido Perlin en las coordenadas de la pantalla
  float noiseValue = noise2d(noiseCoords);

  // Modificar el color con el ruido Perlin (puedes ajustar la intensidad del efecto)
  color += noiseValue * .25;  // Aumenta o disminuye el efecto del ruido sobre el color

  // Aplicar la opacidad calculada
  gl_FragColor = vec4(color, yOpacity);
}
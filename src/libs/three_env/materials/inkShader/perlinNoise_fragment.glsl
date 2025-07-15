// Función de ruido Perlin
float rand(float n){return fract(sin(n) * 43758.5453123);}

float rand2(vec2 xy) {
    return fract(sin(dot(xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float inter(float a, float b, float x) {
    float f = (1.0 - cos(x * 3.1415927)) * 0.5; // Cosine interpolation
    return a * (1.0 - f) + b * f;
}

float noise(float p){
	float fl = floor(p);
  float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}

float noise2d(vec2 uv) {
    float a, b, c, d, coef1, coef2, t, p;

    t = 8.0;  // Precision
    p = 0.0;  // Final heightmap value

    for (float i = 0.0; i < 8.0; i++) {
        a = rand2(vec2(floor(t * (uv.x)) / t, floor(t * (uv.y)) / t));
        b = rand2(vec2(ceil(t * (uv.x)) / t, floor(t * (uv.y)) / t));
        c = rand2(vec2(floor(t * (uv.x)) / t, ceil(t * (uv.y)) / t));
        d = rand2(vec2(ceil(t * (uv.x)) / t, ceil(t * (uv.y)) / t));

        coef1 = fract(t * uv.x);
        coef2 = fract(t * uv.y);

        p += inter(inter(a, b, coef1), inter(c, d, coef1), coef2) * (1.0 / pow(2.0, (i + 0.6)));
        t *= 2.0;
    }
    return p;
}
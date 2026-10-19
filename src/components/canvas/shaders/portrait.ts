/**
 * Hero portrait "pixel dissolve" shaders.
 *
 * Each particle is one square pixel-cell of the photo, placed in screen space
 * (CSS px → clip space) over the DOM <img>'s box so it lines up with the photo
 * whatever the 3D camera does. With p = max(scroll progress, load assembly):
 *
 *   split = smoothstep(0, 0.25, p)                       gaps open between cells
 *   local = clamp((p − 0.15 − 0.65·delay) / 0.2, 0, 1)   this cell blinks out
 *
 * delay ∈ [0,1], so every cell is whole at p = 0 and gone at p = 1
 * ((1 − 0.15 − 0.65) / 0.2 = 1). Each cell takes 0.2 of the range to vanish.
 */

export const portraitVertex = /* glsl */ `
  attribute float aLum;
  attribute float aAlpha;
  attribute float aSeed;
  attribute float aDelay;

  uniform vec4 uRect;       // img box in CSS px: left, top, width, height
  uniform vec2 uViewport;   // canvas size in CSS px
  uniform float uDpr;
  uniform float uPointSize; // CSS px of one cell
  uniform float uProgress;  // scroll dissolve 0 → 1
  uniform float uAssemble;  // load-time assembly 1 → 0

  varying float vLum;
  varying float vAlpha;
  varying float vLocal;

  void main() {
    float p = max(uProgress, uAssemble);
    float split = smoothstep(0.0, 0.25, p);
    float local = clamp((p - 0.15 - aDelay * 0.65) / 0.2, 0.0, 1.0);

    // position.xy holds the cell centre's uv in the image (y down).
    vec2 px = uRect.xy + position.xy * uRect.zw;

    // As it vanishes, each cell nudges up and slightly sideways (scaled to the portrait size).
    float scale = uRect.z / 600.0;
    px += vec2((aSeed - 0.5) * 24.0, -18.0 - 30.0 * aSeed) * local * scale;

    vec2 ndc = vec2(px.x / uViewport.x * 2.0 - 1.0, 1.0 - px.y / uViewport.y * 2.0);
    gl_Position = vec4(ndc, 0.0, 1.0);

    // Seamless at rest (tiny overlap hides seams), 70% with visible gaps once split, shrinking away.
    float size = uPointSize * mix(1.04, 0.7, split) * (1.0 - 0.85 * local);
    gl_PointSize = max(1.0, size * uDpr);

    vLum = aLum;
    vAlpha = aAlpha;
    vLocal = local;
  }
`;

export const portraitFragment = /* glsl */ `
  precision highp float;

  uniform float uOpacity;

  varying float vLum;
  varying float vAlpha;
  varying float vLocal;

  void main() {
    // Hard square pixels. A brief brighten as each cell lets go, then it fades out.
    float flash = vLocal * (1.0 - vLocal) * 4.0; // 0 → 1 → 0 across the vanish
    vec3 col = vec3(vLum) + flash * 0.25;
    float fade = 1.0 - smoothstep(0.3, 1.0, vLocal);

    float alpha = vAlpha * fade * uOpacity;
    if (alpha < 0.01) discard;
    // Luminance was sampled from an sRGB image: convert to linear so post-processing and
    // three's output encoding (colorspace_fragment) treat it like every other surface.
    gl_FragColor = vec4(pow(clamp(col, 0.0, 1.0), vec3(2.2)), alpha);
    #include <colorspace_fragment>
  }
`;

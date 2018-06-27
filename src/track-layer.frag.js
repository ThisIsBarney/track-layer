// language=GLSL
export default `
#define SHADER_NAME track-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

uniform float jointType;
uniform float miterLimit;
uniform float alignMode;

varying vec4 vColor;
varying vec2 vCornerOffset;
varying float vMiterLength;
varying vec2 vDashArray;
varying float vPathPosition;
varying float vPathLength;

varying float vX;
varying float invalid;

// mod doesn't work correctly for negative numbers
float mod2(float a, float b) {
  return a - floor(a / b) * b;
}

float round(float x) {
  return floor(x + 0.5);
}

// if given position is in the gap part of the dashed line
// dashArray.x: solid stroke length, relative to width
// dashArray.y: gap length, relative to width
// alignMode:
// 0 - no adjustment
// o----     ----     ----     ---- o----     -o----     ----     o
// 1 - stretch to fit, draw half dash at each end for nicer joints
// o--    ----    ----    ----    --o--      --o--     ----     --o
bool dash_isFragInGap() {
  float solidLength = vDashArray.x;
  float gapLength = vDashArray.y;

  float unitLength = solidLength + gapLength;

  if (unitLength == 0.0) {
    return false;
  }

  unitLength = mix(
    unitLength,
    vPathLength / round(vPathLength / unitLength),
    alignMode
  );

  float offset = alignMode * solidLength / 2.0;

  return gapLength > 0.0 &&
    vPathPosition >= 0.0 &&
    vPathPosition <= vPathLength &&
    mod2(vPathPosition + offset, unitLength) > solidLength;
}

void main(void) {
  // if joint is rounded, test distance from the corner
  if (jointType > 0.0 && vMiterLength > 0.0 && length(vCornerOffset) > 1.0) {
    // Enable to debug joints
    // gl_FragColor = vec4(0., 1., 0., 1.);
    // return;
    discard;
  }
  if (jointType == 0.0 && vMiterLength > miterLimit) {
    // Enable to debug joints
    // gl_FragColor = vec4(0., 0., 1., 1.);
    // return;
    discard;
  }
  if (vColor.a == 0.0 || dash_isFragInGap()) {
    // Enable to debug joints
    // gl_FragColor = vec4(0., 1., 1., 1.);
    // return;
    discard;
  }
  // if (vColor.a == 0.0 || dash_isFragInGap()) {
  //   discard;
  // }


  if (invalid > 0.0) {
    discard;
    // gl_FragColor = vec4(1, 1., 1., 1.);
  } else if (vX < 0.0) {
    discard;
    // gl_FragColor = vec4(1., 0., 0., 1.);
  } else if (vX > 1.0) {
    discard;
    // gl_FragColor = vec4(0., 1., 0., 1.);
  } else {
    // gl_FragColor = vColor;
    gl_FragColor = vec4(vColor.rgb, vColor.a * vX);
  }
  gl_FragColor = picking_filterHighlightColor(gl_FragColor);
  gl_FragColor = picking_filterPickingColor(gl_FragColor);
}
`;
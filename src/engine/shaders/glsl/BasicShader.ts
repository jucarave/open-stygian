import { ShaderStruct } from '../Shader';

export const BasicShader: ShaderStruct = {
  vertexShader: `
    precision mediump float;

    attribute vec3 aPosition;
    attribute vec2 aTexCoord;

    uniform mat4 uProjection;
    uniform mat4 uView;

    varying vec2 vTexCoord;

    void main(void) {
      vec4 position = vec4(aPosition, 1.0);

      gl_Position = uProjection * uView * position;

      vTexCoord = aTexCoord;
    }
  `,

  fragmentShader: `
    precision mediump float;

    uniform vec4 uUV;
    uniform vec2 uRepeat;
    uniform sampler2D uTexture;

    varying vec2 vTexCoord;

    void main(void) {
      vec2 coords = mod(vTexCoord.xy * uRepeat.xy, 1.0) * uUV.zw + uUV.xy;

      gl_FragColor = texture2D(uTexture, coords);
    }
  `
};

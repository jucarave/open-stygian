import { ShaderStruct } from '../Shader';

export const DungeonShader: ShaderStruct = {
  vertexShader: `
    precision mediump float;

    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    attribute vec4 aUV;

    uniform mat4 uProjection;
    uniform mat4 uView;

    varying vec2 vTexCoord;
    varying vec4 vUV;

    void main(void) {
      vec4 position = vec4(aPosition, 1.0);

      gl_Position = uProjection * uView * position;

      vTexCoord = aTexCoord;
      vUV = aUV;
    }
  `,

  fragmentShader: `
    precision mediump float;

    uniform sampler2D uTexture;
    uniform vec4 uAmbientLight;

    varying vec2 vTexCoord;
    varying vec4 vUV;

    void main(void) {
      vec2 coords = mod(vTexCoord, 1.0) * vUV.zw + vUV.xy;
      vec4 color = texture2D(uTexture, coords);

      color *= uAmbientLight;

      gl_FragColor = color;
    }
  `
};

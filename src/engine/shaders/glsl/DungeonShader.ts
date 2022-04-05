import { ShaderStruct } from '../Shader';

export const DungeonShader: ShaderStruct = {
  vertexShader: `
    precision mediump float;

    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    attribute vec4 aUVs;

    uniform mat4 uProjection;
    uniform mat4 uView;

    varying vec2 vTexCoord;
    varying vec4 vUVs;

    void main(void) {
      vec4 position = vec4(aPosition, 1.0);

      gl_Position = uProjection * uView * position;

      vTexCoord = aTexCoord;
      vUVs = aUVs;
    }
  `,

  fragmentShader: `
    precision mediump float;

    uniform sampler2D uTexture;

    varying vec2 vTexCoord;
    varying vec4 vUVs;

    void main(void) {
      vec2 coords = vTexCoord.xy * vUVs.zw + vUVs.xy;

      gl_FragColor = texture2D(uTexture, coords);
    }
  `
};

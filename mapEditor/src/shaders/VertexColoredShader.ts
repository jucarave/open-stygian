import { ShaderStruct } from '../../../engine/shaders/Shader';

export const VertexColoredShader: ShaderStruct = {
  vertexShader: `
    precision mediump float;

    attribute vec3 aPosition;
    attribute vec4 aColor;

    uniform mat4 uProjection;
    uniform mat4 uView;

    varying vec4 vColor;

    void main(void) {
      vec4 position = vec4(aPosition, 1.0);

      gl_Position = uProjection * uView * position;

      vColor = aColor;
    }
  `,

  fragmentShader: `
    precision mediump float;

    varying vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `
};

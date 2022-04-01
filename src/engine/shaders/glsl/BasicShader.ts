import { ShaderStruct } from '../Shader';

export const BasicShader: ShaderStruct = {
  vertexShader: `
    precision mediump float;

    attribute vec3 aPosition;

    void main(void) {
      vec4 position = vec4(aPosition, 1.0);

      gl_Position = position;
    }
  `,

  fragmentShader: `
    precision mediump float;

    void main(void) {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `
};

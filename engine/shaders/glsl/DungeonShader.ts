import { ShaderStruct } from '../Shader';

export const DungeonShader: ShaderStruct = {
  vertexShader: `
    precision mediump float;

    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoord;
    attribute vec4 aUV;

    uniform mat4 uProjection;
    uniform mat4 uView;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vTexCoord;
    varying vec4 vUV;

    void main(void) {
      vec4 position = vec4(aPosition, 1.0);

      gl_Position = uProjection * uView * position;

      vWorldPosition = aPosition;
      vNormal = aNormal;
      vTexCoord = aTexCoord;
      vUV = aUV;
    }
  `,

  fragmentShader: `
    #define MAX_LIGHTS 8

    precision mediump float;

    struct Light {
      vec4 color;
      vec3 position;
      float radius;
    };

    uniform sampler2D uTexture;
    uniform vec4 uAmbientLight;
    uniform Light uLights[MAX_LIGHTS];

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vTexCoord;
    varying vec4 vUV;

    void main(void) {
      vec2 coords = mod(vTexCoord, 1.0) * vUV.zw + vUV.xy;
      vec4 color = texture2D(uTexture, coords);

      vec4 reflectedLight;
      for (int i=0;i<MAX_LIGHTS;i++) {
        vec3 distanceVector = uLights[i].position - vWorldPosition;
        vec3 lightDirection = normalize(distanceVector);

        float distance = length(distanceVector);
        float attenuation = clamp(1.0 - distance * distance / (uLights[i].radius * uLights[i].radius), 0.0, 1.0);
        attenuation *= attenuation;

        reflectedLight += (max(dot(vNormal, lightDirection), 0.0) * uLights[i].color) * attenuation;
      }

      gl_FragColor = color * (uAmbientLight + reflectedLight);
    }
  `
};

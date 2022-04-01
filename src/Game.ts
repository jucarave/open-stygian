import { Renderer } from 'engine/Renderer';

class Game {
  constructor() {
    const canvas = document.getElementById('openAbyssCanvas') as HTMLCanvasElement;
    
    const renderer = new Renderer(canvas);
    renderer.clear();

    const gl = renderer.gl;
    const shader = renderer.shader;

    const vertices = [
      -0.5, -0.5, 0.0,
      0.0, 0.5, 0.0,
      0.5, -0.5, 0.0
    ];

    const indices = [
      0, 1, 2
    ];

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.vertexAttribPointer(shader.attributes['aPosition'], 3, gl.FLOAT, false, 12, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
  }
}

window.onload = () => {
  new Game();
}
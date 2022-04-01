import { Geometry } from 'engine/geometries/Geometry';
import { MaterialBasic } from 'engine/materials/MaterialBasic';
import { Renderer } from 'engine/Renderer';

class Game {
  constructor() {
    const canvas = document.getElementById('openStygianCanvas') as HTMLCanvasElement;
    
    const renderer = new Renderer(canvas);
    renderer.clear();

    const geometry = new Geometry()
      .addVertice(-0.5, -0.5, 0.0)
      .addVertice(0., 0.5, 0.0)
      .addVertice(0.5, -0.5, 0.0)

      .addTriangle(0, 1, 2)
      
      .build();

    const material = new MaterialBasic();

    material.render(geometry);
  }
}

window.onload = () => {
  new Game();
}
import { Camera } from 'engine/Camera';
import { Entity } from 'engine/entities/Entity';
import { Geometry } from 'engine/geometries/Geometry';
import { MaterialBasic } from 'engine/materials/MaterialBasic';
import { Renderer } from 'engine/Renderer';
import { Texture } from 'engine/Texture';

class Game {
  private renderer: Renderer;
  private entity: Entity;
  private camera: Camera;

  constructor() {
    const canvas = document.getElementById('openStygianCanvas') as HTMLCanvasElement;
    
    this.renderer = new Renderer(canvas);

    const geometry = new Geometry()
      // Front face
      .addVertice(-0.5, -0.5, 0.5).addTexCoord(0, 1)
      .addVertice(0.5, -0.5, 0.5).addTexCoord(1, 1)
      .addVertice(-0.5, 0.5, 0.5).addTexCoord(0, 0)
      .addVertice(0.5, 0.5, 0.5).addTexCoord(1, 0)
      .addTriangle(0, 1, 2)
      .addTriangle(1, 3, 2)

      // Back face
      .addVertice(0.5, -0.5, -0.5).addTexCoord(0, 1)
      .addVertice(-0.5, -0.5, -0.5).addTexCoord(1, 1)
      .addVertice(0.5, 0.5, -0.5).addTexCoord(0, 0)
      .addVertice(-0.5, 0.5, -0.5).addTexCoord(1, 0)
      .addTriangle(4, 5, 6)
      .addTriangle(5, 7, 6)

      // Left face
      .addVertice(-0.5, -0.5, -0.5).addTexCoord(0, 1)
      .addVertice(-0.5, -0.5, 0.5).addTexCoord(1, 1)
      .addVertice(-0.5, 0.5, -0.5).addTexCoord(0, 0)
      .addVertice(-0.5, 0.5, 0.5).addTexCoord(1, 0)
      .addTriangle(8, 9, 10)
      .addTriangle(9, 11, 10)

      // Right face
      .addVertice(0.5, -0.5, 0.5).addTexCoord(0, 1)
      .addVertice(0.5, -0.5, -0.5).addTexCoord(1, 1)
      .addVertice(0.5, 0.5, 0.5).addTexCoord(0, 0)
      .addVertice(0.5, 0.5, -0.5).addTexCoord(1, 0)
      .addTriangle(12, 13, 14)
      .addTriangle(13, 15, 14)

      // Top face
      .addVertice(-0.5, 0.5, 0.5).addTexCoord(0, 1)
      .addVertice(0.5, 0.5, 0.5).addTexCoord(1, 1)
      .addVertice(-0.5, 0.5, -0.5).addTexCoord(0, 0)
      .addVertice(0.5, 0.5, -0.5).addTexCoord(1, 0)
      .addTriangle(16, 17, 18)
      .addTriangle(17, 19, 18)

      // Bottom face
      .addVertice(-0.5, -0.5, -0.5).addTexCoord(0, 1)
      .addVertice(0.5, -0.5, -0.5).addTexCoord(1, 1)
      .addVertice(-0.5, -0.5, 0.5).addTexCoord(0, 0)
      .addVertice(0.5, -0.5, 0.5).addTexCoord(1, 0)
      .addTriangle(20, 21, 22)
      .addTriangle(21, 23, 22)
      
      .build();

    const material = new MaterialBasic(new Texture('texture', 'img/texture.png'));

    const camera = Camera.createPerspective(60, canvas.width / canvas.height, 0.1, 100);
    camera.position.set(0, 0, -5);

    const entity = new Entity();
    entity.geometry = geometry;
    entity.material = material;

    this.entity = entity;
    this.camera = camera;

    this.waitForTextures();
  }

  private waitForTextures() {
    if (Texture.areTexturesReady()) {
      this.gameLoop();
      return;
    }

    requestAnimationFrame(() => { this.gameLoop(); })
  }

  gameLoop() {
    this.renderer.clear();
    this.entity.render(this.camera);

    this.entity.rotation.rotateX(0.02);
    this.entity.rotation.rotateY(0.02);

    requestAnimationFrame(() => { this.gameLoop(); })
  }
}

window.onload = () => {
  new Game();
}
import { Camera } from 'engine/Camera';
import { PlayerSmoothMovement } from 'engine/Components/PlayerSmoothMovement';
import { Entity } from 'engine/entities/Entity';
import { Geometry } from 'engine/geometries/Geometry';
import { MaterialBasic } from 'engine/materials/MaterialBasic';
import { Vector3 } from 'engine/math/Vector3';
import { Renderer } from 'engine/Renderer';
import { Texture } from 'engine/Texture';
import { Scene } from './Scene';

export class SceneDungeon extends Scene {
  private _player: Entity;

  constructor() {
    super();

    this._loadDungeon();
    this._loadCamera();
    this._loadPLayer();
  }

  private _loadDungeon() {
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
    material.v4UV = [0.5,0,0.5,1];
    material.v2Repeat = [1, 1];

    const entity = new Entity();
    entity.geometry = geometry;
    entity.material = material;

    this.addEntity(entity);
  }

  private _loadCamera() {
    const renderer = Renderer.instance;
    this._camera = Camera.createPerspective(60, renderer.gl.canvas.width / renderer.gl.canvas.height, 0.1, 100);
    this._camera.position.set(0, 0, 0);
  }

  private _loadPLayer() {
    this._player = new Entity(new Vector3(0, 0, 5));
    this._player.addComponent(new PlayerSmoothMovement(this._camera));

    this.addEntity(this._player);
  }
}
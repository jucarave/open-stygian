import { Camera } from '../../../engine/core/Camera';
import { Renderer } from '../../../engine/core/Renderer';
import { Entity } from '../../../engine/entities/Entity';
import { GeometryQuad } from '../../../engine/geometries/GeometryQuad';
import { MaterialColor } from '../../../engine/materials/MaterialColor';
import { Vector3 } from '../../../engine/math/Vector3';
import { Scene } from '../../../engine/scenes/Scene';

export class SceneUI extends Scene {
  constructor() {
    super();

    this._camera = Camera.createOrthogonal(480, 270, 0.1, 1000);
    this._camera.position.set(0, 0, 1);

    const quad = new Entity(new Vector3(0, 0, 0));
    quad.geometry = new GeometryQuad(32, 32);
    quad.material = new MaterialColor([1,1,1,1]);
    
    this.addEntity(quad);
  }

  public override render(): void {
    const gl = Renderer.instance.gl;
    gl.clear(gl.DEPTH_BUFFER_BIT);

    super.render();
  }
}
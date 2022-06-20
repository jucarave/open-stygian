import { Camera } from '../../../engine/core/Camera';
import { Font } from '../../../engine/core/Font';
import { Renderer } from '../../../engine/core/Renderer';
import { Text } from '../../../engine/entities/Text';
import { Scene } from '../../../engine/scenes/Scene';

export class SceneUI extends Scene {
  private _gl: WebGLRenderingContext;

  constructor() {
    super();

    const width = Renderer.instance.gl.canvas.width / 2.0;
    const height = Renderer.instance.gl.canvas.height / 2.0;

    this._camera = Camera.createOrthogonal(width, height, 0.1, 1000);
    this._camera.position.set(width / 2.0, height / 2.0, 1);

    const text = new Text('Lorem ipsum', Font.getFont('font'));
    text.position.set(32, 32, 0);
    
    this.addEntity(text);

    this._gl = Renderer.instance.gl;
  }

  public override render(): void {
    this._gl.clear(this._gl.DEPTH_BUFFER_BIT);

    super.render();
  }
}
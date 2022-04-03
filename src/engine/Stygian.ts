import { Renderer } from './Renderer';
import { Scene } from './Scenes/Scene';
import { SceneDungeon } from './Scenes/SceneDungeon';
import { Input } from './system/Input';
import { Texture } from './Texture';

export class Stygian {
  private _renderer: Renderer;
  private _scene: Scene;

  constructor(canvas: HTMLCanvasElement) {
    this._renderer = new Renderer(canvas);
    new Input(canvas);
  }

  /**
   * Loads a playable dungeon level
   */
  public loadLevel() {
    this._scene = new SceneDungeon();

    return this._scene as SceneDungeon;
  }

  /**
   * If all the textures are ready then execute the game loop
   */
  public play() {
    if (Texture.areTexturesReady()) {
      this._scene.init();
      this._gameLoop();

      return;
    }

    requestAnimationFrame(() => this.play());
  }

  /**
   * Game loop clears the background, update all the entities 
   * and renders them
   */
  private _gameLoop() {
    this._renderer.clear();

    this._scene.update();
    this._scene.render();

    Input.instance.update();

    requestAnimationFrame(() => this._gameLoop());
  }
}
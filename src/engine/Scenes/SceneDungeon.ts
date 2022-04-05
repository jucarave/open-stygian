import { Camera } from '../Camera';
import { DungeonMap } from '../DungeonMap';
import { Dungeon } from '../entities/Dungeon';
import { Entity } from '../entities/Entity';
import { Vector3 } from '../math/Vector3';
import { PlayerSetup } from '../PlayerSetup';
import { Renderer } from '../Renderer';
import { Scene } from './Scene';

export class SceneDungeon extends Scene {
  private _player: Entity;

  public readonly playerSetup: PlayerSetup;

  constructor(dungeon: DungeonMap) {
    super();

    this.addEntity(new Dungeon(dungeon));
    this._loadCamera();
    this._loadPLayer();

    this.playerSetup = new PlayerSetup(this._player, this._camera);
  }

  private _loadCamera() {
    const renderer = Renderer.instance;
    this._camera = Camera.createPerspective(60, renderer.gl.canvas.width / renderer.gl.canvas.height, 0.1, 100);
    this._camera.position.set(0, 0, 0);
    this._camera.rotation.lookToDirection(Vector3.forward);
  }

  private _loadPLayer() {
    this._player = new Entity(new Vector3(0, 0, -5));

    this.addEntity(this._player);
  }
}
import { Camera } from '../core/Camera';
import { DungeonMap } from '../DungeonMap';
import { Dungeon } from '../entities/Dungeon';
import { Entity } from '../entities/Entity';
import { Vector3 } from '../math/Vector3';
import { PlayerSetup } from '../PlayerSetup';
import { Renderer } from '../core/Renderer';
import { Scene } from './Scene';
import { CharacterMovement } from '../components/CharacterMovement';
import { Config } from '../system/Config';

export class SceneDungeon extends Scene {
  private _player: Entity;
  private _dungeon: Dungeon;

  public readonly playerSetup: PlayerSetup;

  constructor(dungeon: DungeonMap) {
    super();

    this._dungeon = new Dungeon(dungeon);

    this.addEntity(this._dungeon);
    this._loadCamera();
    this._loadPLayer();

    this.playerSetup = new PlayerSetup(this._player, this._camera);
  }

  private _loadCamera() {
    const renderer = Renderer.instance;
    this._camera = Camera.createPerspective(60, renderer.gl.canvas.width / renderer.gl.canvas.height, 0.1, 100);
    this._camera.position.set(0, 0, 0);
  }

  private _loadPLayer() {
    this._player = new Entity(new Vector3(3, 0, 2));
    this._player.addComponent(new CharacterMovement(Config.player.radius, Config.player.height));

    this.addEntity(this._player);

    this._camera.parent = this._player;
  }

  public getDungeon() {
    return this._dungeon;
  }
}
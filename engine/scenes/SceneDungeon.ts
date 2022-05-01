import { Camera } from '../core/Camera';
import { Dungeon } from '../entities/Dungeon';
import { Entity } from '../entities/Entity';
import { Vector3 } from '../math/Vector3';
import { PlayerSetup } from '../PlayerSetup';
import { Renderer } from '../core/Renderer';
import { Scene } from './Scene';
import { CharacterMovement } from '../components/CharacterMovement';
import { Config } from '../system/Config';
import { FallingEntity } from '../components/FallingEntity';
import { Geometry } from '../geometries/Geometry';
import { SolidMap } from '../physics/SolidMap';
import { Material } from '../materials/Material';

export class SceneDungeon extends Scene {
  private _player: Entity;
  private _dungeon: Dungeon;

  public readonly playerSetup: PlayerSetup;

  constructor(level: Geometry, material: Material, solidMap: SolidMap) {
    super();

    this._dungeon = new Dungeon(level, material, solidMap);

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
    this._player.addComponent(new FallingEntity(Config.player.radius, Config.player.height));

    this.addEntity(this._player);

    this._camera.parent = this._player;
  }

  public getDungeon() {
    return this._dungeon;
  }

  public getHighestPlane(position: Vector3, radius: number) {
    return this._dungeon.solidMap.getHighestPlane(position, radius);
  }

  public getLowestPlane(position: Vector3, height: number, radius: number) {
    return this._dungeon.solidMap.getLowestPlane(position, height, radius);
  }
}
import { DungeonMap } from '../DungeonMap';
import { MaterialDungeon } from '../materials/MaterialDungeon';
import { Texture } from '../core/Texture';
import { Entity } from './Entity';
import { DungeonBuilder } from '../geometries/DungeonBuilder';
import { SolidMap } from '../physics/SolidMap';
import { Cube } from '../math/Cube';

/**
 * Parses a DungeonMap file and generates a 3D dungeon Entity
 * with geometry and material
 */
export class Dungeon extends Entity {
  private _dungeonBuilder: DungeonBuilder;
  private _solidMap: SolidMap;

  constructor(dungeon: DungeonMap) {
    super();

    const texture = Texture.getTexture(dungeon.texture);

    this._dungeonBuilder = new DungeonBuilder();
    this.geometry = this._dungeonBuilder;
    this.material = new MaterialDungeon(texture);

    this._dungeonBuilder.parseMap(dungeon);

    this.geometry.build();

    this._solidMap = new SolidMap(dungeon);
  }

  public getOverlappingWalls(cube: Cube) {
    return this._solidMap.getOverlappingWalls(cube);
  }
}
import { DungeonMap } from '../DungeonMap';
import { MaterialDungeon } from '../materials/MaterialDungeon';
import { Texture } from '../core/Texture';
import { Entity } from './Entity';
import { DungeonBuilder } from '../geometries/DungeonBuilder';

/**
 * Parses a DungeonMap file and generates a 3D dungeon Entity
 * with geometry and material
 */
export class Dungeon extends Entity {
  private _dungeonBuilder: DungeonBuilder;

  constructor(map: DungeonMap) {
    super();

    const texture = Texture.getTexture(map.texture);

    this._dungeonBuilder = new DungeonBuilder();
    this.geometry = this._dungeonBuilder;
    this.material = new MaterialDungeon(texture);

    this._dungeonBuilder.parseMap(map);

    this.geometry.build();
  }
}
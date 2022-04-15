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
  private _dungeonMap: DungeonMap;

  constructor(dungeon: DungeonMap) {
    super();

    this._dungeonMap = dungeon;

    this._dungeonBuilder = new DungeonBuilder();
    this.geometry = this._dungeonBuilder;

    this.rebuild();

    this._solidMap = new SolidMap(dungeon);
  }

  public rebuild() {
    if (this._dungeonMap.texture !== '') {
      const texture = Texture.getTexture(this._dungeonMap.texture);
      this.material = new MaterialDungeon(texture);
    }

    (this.geometry as DungeonBuilder).parseMap(this._dungeonMap);

    this.geometry.build();
  }

  public getOverlappingWalls(cube: Cube) {
    return this._solidMap.getOverlappingWalls(cube);
  }

  public get solidMap() {
    return this._solidMap;
  }
}
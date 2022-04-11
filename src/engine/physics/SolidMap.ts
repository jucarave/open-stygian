import { DungeonMap, Wall } from '../DungeonMap';
import { Cube } from '../math/Cube';
import { SolidWall } from './SolidWall';


export class SolidMap {
  private _walls: SolidWall[];

  constructor(dungeon: DungeonMap) {
    this._walls = [];

    this._parseWalls(dungeon);
  }

  private _parseWalls(dungeon: DungeonMap) {
    dungeon.solidWalls.forEach((wall: Wall) => {
      const x1 = wall.x1;
      const y1 = wall.y1;
      const z1 = wall.z1;
      const x2 = wall.x2;
      const y2 = wall.y1 + wall.h1;
      const z2 = wall.z2;

      const w = new SolidWall(x1, y1, z1, x2, y2, z2);
      w.calculateNormal();

      this._walls.push(w);
    });
  }

  public getOverlappingWalls(cube: Cube) {
    cube;
    return this._walls;
  }
}
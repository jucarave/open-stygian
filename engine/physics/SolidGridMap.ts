import { DungeonGrid } from '../dungeon/GridLevel/DungeonGrid';
import { Cube } from '../math/Cube';
import { Vector3 } from '../math/Vector3';
import { SolidMap } from './SolidMap';
import { SolidPlane } from './SolidPlane';
import { SolidWall } from './SolidWall';

export class SolidGridMap extends SolidMap {
  private _level: DungeonGrid;
  private _wallsMap: SolidWall[][][];

  public getOverlappingWalls(cube: Cube): SolidWall[] {
    const x1 = Math.floor(cube.x1);
    const x2 = Math.floor(cube.x2);
    const z1 = Math.floor(cube.z1);
    const z2 = Math.floor(cube.z2);

    let walls: SolidWall[] = [];
    
    for (let z=z1;z<=z2;z++) {
      for (let x=x1;x<=x2;x++) {
        if (this._wallsMap[z][x] != null) {
          walls = walls.concat(this._wallsMap[z][x]);
        }
      }
    }

    return walls;
  }
  public getOverlappingPlanes(position: Vector3, radius: number): SolidPlane[] {
    position; radius;
    return this._planes;
  }

  private _getTileAt(x: number, z: number) {
    const height = this._level.map.length;
    const width = this._level.map[0].length;

    if (x < 0 || z < 0 || x >= width || z >= height) { return null; }

    const tileId = this._level.map[z][x];
    if (tileId === 0) { return null; }

    return this._level.tiles[tileId - 1];
  }

  private _addSolidWall(x: number, z: number, wall: SolidWall) {
    if (this._wallsMap[z][x] === null) { this._wallsMap[z][x] = []; }

    this._wallsMap[z][x].push(wall);
  }

  private _parseWall(x: number, z: number) {
    const wall = this._getTileAt(x, z);

    const sWall = this._getTileAt(x, z + 1);
    if (sWall != null && !sWall.wallUV) {
      const y = Math.min(wall.y, sWall.y);
      const h = Math.max(wall.y+wall.height, sWall.y+sWall.height) - y;

      const solidWall = new SolidWall(x, y, h, z + 1, x + 1, y, h, z + 1);
      solidWall.calculateNormal();

      this._addSolidWall(x, z, solidWall);
    }

    const nWall = this._getTileAt(x, z - 1);
    if (nWall != null && !nWall.wallUV) {
      const y = Math.min(wall.y, nWall.y);
      const h = Math.max(wall.y+wall.height, nWall.y+nWall.height) - y;

      const solidWall = new SolidWall(x + 1, y, h, z, x, y, h, z);
      solidWall.calculateNormal();

      this._addSolidWall(x, z, solidWall);
    }

    const wWall = this._getTileAt(x + 1, z);
    if (wWall != null && !wWall.wallUV) {
      const y = Math.min(wall.y, wWall.y);
      const h = Math.max(wall.y+wall.height, wWall.y+wWall.height) - y;

      const solidWall = new SolidWall(x + 1, y, h, z + 1, x + 1, y, h, z);
      solidWall.calculateNormal();

      this._addSolidWall(x, z, solidWall);
    }

    const eWall = this._getTileAt(x - 1, z);
    if (eWall != null && !eWall.wallUV) {
      const y = Math.min(wall.y, eWall.y);
      const h = Math.max(wall.y+wall.height, eWall.y+eWall.height) - y;

      const solidWall = new SolidWall(x, y, h, z, x, y, h, z + 1);
      solidWall.calculateNormal();

      this._addSolidWall(x, z, solidWall);
    }
  }

  public parseGridDungeon(dungeon: DungeonGrid) {
    const height = dungeon.map.length;
    const width = dungeon.map[0].length;

    this._level = dungeon;
    
    this._wallsMap = [];
    for (let z=0;z<height;z++) {
      this._wallsMap[z] = [];
      for (let x=0;x<width;x++) {
        this._wallsMap[z][x] = null;

        const tileId = dungeon.map[z][x];
        if (tileId === 0) { continue; }

        const tile = this._getTileAt(x, z);

        if (tile.wallUV && !tile.diagonal) {
          this._parseWall(x, z);
        }
      }
    }

    this._planes = [new SolidPlane(new Vector3(0,0,0), new Vector3(10,0,0), new Vector3(0,0,10), new Vector3(10,0,10))];
  }
}
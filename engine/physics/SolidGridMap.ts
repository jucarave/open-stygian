import { DungeonGrid, Tile } from '../dungeon/GridLevel/DungeonGrid';
import { Cube } from '../math/Cube';
import { Vector3 } from '../math/Vector3';
import { SolidMap } from './SolidMap';
import { SolidPlane } from './SolidPlane';
import { SolidWall } from './SolidWall';

export class SolidGridMap extends SolidMap {
  private _level: DungeonGrid;
  private _wallsMap: SolidWall[][][];

  public getOverlappingWalls(cube: Cube): SolidWall[] {
    const height = this._wallsMap.length;
    const width = this._wallsMap.length;

    const x1 = Math.max(Math.floor(cube.x1), 0);
    const x2 = Math.min(Math.floor(cube.x2), width - 1);
    const z1 = Math.max(Math.floor(cube.z1), 0);
    const z2 = Math.min(Math.floor(cube.z2), height - 1);

    const walls: SolidWall[] = [];
    
    for (let z=z1;z<=z2;z++) {
      for (let x=x1;x<=x2;x++) {
        if (this._wallsMap[z][x] != null) {
          this._wallsMap[z][x].forEach((wall: SolidWall) => {
            if (wall.collidesWithCube(cube)) {
              walls.push(wall);
            }
          })
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

  private _isOccludedByWall(y1: number, y2: number, wall: Tile) {
    if (!wall || !wall.wallUV) { return false; }

    return (y1 >= wall.y && y2 <= wall.y + wall.height);
  }

  private _addSolidWall(x: number, z: number, wall: SolidWall) {
    if (this._wallsMap[z][x] === null) { this._wallsMap[z][x] = []; }

    this._wallsMap[z][x].push(wall);
  }

  private _parseWall(x: number, z: number) {
    const wall = this._getTileAt(x, z);
    const y1 = wall.y;
    const y2 = wall.y + wall.height;

    const sWall = this._getTileAt(x, z + 1);
    if (sWall != null && !this._isOccludedByWall(y1, y2, sWall)) {
      const y = Math.min(wall.y, sWall.y);
      const h = Math.max(wall.y+wall.height, sWall.y+sWall.height) - y;

      const solidWall = new SolidWall(x, y, h, z + 1, x + 1, y, h, z + 1);
      solidWall.calculateNormal();

      this._addSolidWall(x, z, solidWall);
    }

    const nWall = this._getTileAt(x, z - 1);
    if (nWall != null && !this._isOccludedByWall(y1, y2, nWall)) {
      const y = Math.min(wall.y, nWall.y);
      const h = Math.max(wall.y+wall.height, nWall.y+nWall.height) - y;

      const solidWall = new SolidWall(x + 1, y, h, z, x, y, h, z);
      solidWall.calculateNormal();

      this._addSolidWall(x, z, solidWall);
    }

    const wWall = this._getTileAt(x + 1, z);
    if (wWall != null && !this._isOccludedByWall(y1, y2, wWall)) {
      const y = Math.min(wall.y, wWall.y);
      const h = Math.max(wall.y+wall.height, wWall.y+wWall.height) - y;

      const solidWall = new SolidWall(x + 1, y, h, z + 1, x + 1, y, h, z);
      solidWall.calculateNormal();

      this._addSolidWall(x, z, solidWall);
    }

    const eWall = this._getTileAt(x - 1, z);
    if (eWall != null && !this._isOccludedByWall(y1, y2, eWall)) {
      const y = Math.min(wall.y, eWall.y);
      const h = Math.max(wall.y+wall.height, eWall.y+eWall.height) - y;

      const solidWall = new SolidWall(x, y, h, z, x, y, h, z + 1);
      solidWall.calculateNormal();

      this._addSolidWall(x, z, solidWall);
    }
  }

  private _parseDiagonalWall(x: number, z: number) {
    const wall = this._getTileAt(x, z);
    const y1 = wall.y;
    const y2 = wall.y + wall.height;

    let solidWall;
    let nWall: Tile;

    switch (wall.diagonal) {
      case 'tl': 
        solidWall = new SolidWall(x, wall.y, wall.height, z + 1, x + 1, wall.y, wall.height, z);
        solidWall.calculateNormal();
        this._addSolidWall(x, z, solidWall);

        // West wall
        nWall = this._getTileAt(x - 1, z);
        if (nWall != null && !this._isOccludedByWall(y1, y2, nWall)) {
          solidWall = new SolidWall(x, wall.y, wall.height, z, x, wall.y, wall.height, z + 1);
          solidWall.calculateNormal();
          this._addSolidWall(x, z, solidWall);
        }

        // North wall
        nWall = this._getTileAt(x, z - 1);
        if (nWall != null && !this._isOccludedByWall(y1, y2, nWall)) {
          solidWall = new SolidWall(x + 1, wall.y, wall.height, z, x, wall.y, wall.height, z);
          solidWall.calculateNormal();
          this._addSolidWall(x, z, solidWall);
        }
        break;

      case 'tr': 
        solidWall = new SolidWall(x, wall.y, wall.height, z, x + 1, wall.y, wall.height, z + 1);
        solidWall.calculateNormal();
        this._addSolidWall(x, z, solidWall);

        // East wall
        nWall = this._getTileAt(x + 1, z);
        if (nWall != null && !this._isOccludedByWall(y1, y2, nWall)) {
          solidWall = new SolidWall(x + 1, wall.y, wall.height, z + 1, x + 1, wall.y, wall.height, z);
          solidWall.calculateNormal();
          this._addSolidWall(x, z, solidWall);
        }

        // North wall
        nWall = this._getTileAt(x, z - 1);
        if (nWall != null && !this._isOccludedByWall(y1, y2, nWall)) {
          solidWall = new SolidWall(x + 1, wall.y, wall.height, z, x, wall.y, wall.height, z);
          solidWall.calculateNormal();
          this._addSolidWall(x, z, solidWall);
        }
        break;

      case 'bl': 
        solidWall = new SolidWall(x + 1, wall.y, wall.height, z + 1, x, wall.y, wall.height, z);
        solidWall.calculateNormal();
        this._addSolidWall(x, z, solidWall);

        // West wall
        nWall = this._getTileAt(x - 1, z);
        if (nWall != null && !this._isOccludedByWall(y1, y2, nWall)) {
          solidWall = new SolidWall(x, wall.y, wall.height, z, x, wall.y, wall.height, z + 1);
          solidWall.calculateNormal();
          this._addSolidWall(x, z, solidWall);
        }

        // South wall
        nWall = this._getTileAt(x, z + 1);
        if (nWall != null && !this._isOccludedByWall(y1, y2, nWall)) {
          solidWall = new SolidWall(x, wall.y, wall.height, z + 1, x + 1, wall.y, wall.height, z + 1);
          solidWall.calculateNormal();
          this._addSolidWall(x, z, solidWall);
        }
        break;

      case 'br': 
        solidWall = new SolidWall(x + 1, wall.y, wall.height, z, x, wall.y, wall.height, z + 1);
        solidWall.calculateNormal();
        this._addSolidWall(x, z, solidWall);

        // East wall
        nWall = this._getTileAt(x + 1, z);
        if (nWall != null && !this._isOccludedByWall(y1, y2, nWall)) {
          solidWall = new SolidWall(x + 1, wall.y, wall.height, z + 1, x + 1, wall.y, wall.height, z);
          solidWall.calculateNormal();
          this._addSolidWall(x, z, solidWall);
        }

        // South wall
        nWall = this._getTileAt(x, z + 1);
        if (nWall != null && !this._isOccludedByWall(y1, y2, nWall)) {
          solidWall = new SolidWall(x, wall.y, wall.height, z + 1, x + 1, wall.y, wall.height, z + 1);
          solidWall.calculateNormal();
          this._addSolidWall(x, z, solidWall);
        }
        break;
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
        } else if (tile.wallUV && tile.diagonal) {
          this._parseDiagonalWall(x, z);
        }
      }
    }

    this._planes = [new SolidPlane(new Vector3(0,0,0), new Vector3(10,0,0), new Vector3(0,0,10), new Vector3(10,0,10))];
  }
}
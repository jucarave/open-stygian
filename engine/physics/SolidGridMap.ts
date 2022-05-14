import { DungeonGrid, Tile } from '../dungeon/GridLevel/DungeonGrid';
import { Cube } from '../math/Cube';
import { Vector3 } from '../math/Vector3';
import { SolidMap } from './SolidMap';
import { SolidPlane } from './SolidPlane';
import { SolidWall } from './SolidWall';

export class SolidGridMap extends SolidMap {
  private _level: DungeonGrid;
  private _wallsMap: SolidWall[][][];
  private _planesMap: SolidPlane[][][];

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
    const height = this._planesMap.length;
    const width = this._planesMap.length;

    const x1 = Math.max(Math.floor(position.x - radius), 0);
    const x2 = Math.min(Math.floor(position.x + radius), width - 1);
    const z1 = Math.max(Math.floor(position.z - radius), 0);
    const z2 = Math.min(Math.floor(position.z + radius), height - 1);

    let planes: SolidPlane[] = [];
    
    for (let z=z1;z<=z2;z++) {
      for (let x=x1;x<=x2;x++) {
        if (this._planesMap[z][x] != null) {
          planes = planes.concat(this._planesMap[z][x]);
        }
      }
    }

    return planes;
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

      this._addSolidWall(x, z, new SolidWall(x, y, h, z + 1, x + 1, y, h, z + 1));
    }

    const nWall = this._getTileAt(x, z - 1);
    if (nWall != null && !this._isOccludedByWall(y1, y2, nWall)) {
      const y = Math.min(wall.y, nWall.y);
      const h = Math.max(wall.y+wall.height, nWall.y+nWall.height) - y;

      this._addSolidWall(x, z, new SolidWall(x + 1, y, h, z, x, y, h, z));
    }

    const wWall = this._getTileAt(x + 1, z);
    if (wWall != null && !this._isOccludedByWall(y1, y2, wWall)) {
      const y = Math.min(wall.y, wWall.y);
      const h = Math.max(wall.y+wall.height, wWall.y+wWall.height) - y;

      this._addSolidWall(x, z, new SolidWall(x + 1, y, h, z + 1, x + 1, y, h, z));
    }

    const eWall = this._getTileAt(x - 1, z);
    if (eWall != null && !this._isOccludedByWall(y1, y2, eWall)) {
      const y = Math.min(wall.y, eWall.y);
      const h = Math.max(wall.y+wall.height, eWall.y+eWall.height) - y;

      this._addSolidWall(x, z, new SolidWall(x, y, h, z, x, y, h, z + 1));
    }
  }

  private _parseDiagonalWall(x: number, z: number) {
    const wall = this._getTileAt(x, z);
    const y1 = wall.y;
    const y2 = wall.y + wall.height;

    switch (wall.diagonal) {
      case 'tl': 
        this._addSolidWall(x, z, new SolidWall(x, wall.y, wall.height, z + 1, x + 1, wall.y, wall.height, z));

        // West wall
        if (!this._isOccludedByWall(y1, y2, this._getTileAt(x - 1, z))) {
          this._addSolidWall(x, z, new SolidWall(x, wall.y, wall.height, z, x, wall.y, wall.height, z + 1));
        }

        // North wall
        if (!this._isOccludedByWall(y1, y2, this._getTileAt(x, z - 1))) {
          this._addSolidWall(x, z, new SolidWall(x + 1, wall.y, wall.height, z, x, wall.y, wall.height, z));
        }
        break;

      case 'tr': 
        this._addSolidWall(x, z, new SolidWall(x, wall.y, wall.height, z, x + 1, wall.y, wall.height, z + 1));

        // East wall
        if (!this._isOccludedByWall(y1, y2, this._getTileAt(x + 1, z))) {
          this._addSolidWall(x, z, new SolidWall(x + 1, wall.y, wall.height, z + 1, x + 1, wall.y, wall.height, z));
        }

        // North wall
        if (!this._isOccludedByWall(y1, y2, this._getTileAt(x, z - 1))) {
          this._addSolidWall(x, z, new SolidWall(x + 1, wall.y, wall.height, z, x, wall.y, wall.height, z));
        }
        break;

      case 'bl': 
        this._addSolidWall(x, z, new SolidWall(x + 1, wall.y, wall.height, z + 1, x, wall.y, wall.height, z));

        // West wall
        if (!this._isOccludedByWall(y1, y2, this._getTileAt(x - 1, z))) {
          this._addSolidWall(x, z, new SolidWall(x, wall.y, wall.height, z, x, wall.y, wall.height, z + 1));
        }

        // South wall
        if (!this._isOccludedByWall(y1, y2, this._getTileAt(x, z + 1))) {
          this._addSolidWall(x, z, new SolidWall(x, wall.y, wall.height, z + 1, x + 1, wall.y, wall.height, z + 1));
        }
        break;

      case 'br': 
        this._addSolidWall(x, z, new SolidWall(x + 1, wall.y, wall.height, z, x, wall.y, wall.height, z + 1));

        // East wall
        if (!this._isOccludedByWall(y1, y2, this._getTileAt(x + 1, z))) {
          this._addSolidWall(x, z, new SolidWall(x + 1, wall.y, wall.height, z + 1, x + 1, wall.y, wall.height, z));
        }

        // South wall
        if (!this._isOccludedByWall(y1, y2, this._getTileAt(x, z + 1))) {
          this._addSolidWall(x, z, new SolidWall(x, wall.y, wall.height, z + 1, x + 1, wall.y, wall.height, z + 1));
        }
        break;
    }
  }

  private _parseLowWalls(x: number, z: number) {
    const tile = this._getTileAt(x, z);

    const sTile = this._getTileAt(x, z + 1);
    if (sTile != null && sTile.y <= tile.y) {
      const y = sTile.y;
      const h = tile.y - sTile.y;

      this._addSolidWall(x, z, new SolidWall(x, y, h, z + 1, x + 1, y, h, z + 1));
    }

    const nTile = this._getTileAt(x, z - 1);
    if (nTile != null && nTile.y <= tile.y) {
      const y = nTile.y;
      const h = tile.y - nTile.y;

      this._addSolidWall(x, z, new SolidWall(x + 1, y, h, z, x, y, h, z));
    }

    const wTile = this._getTileAt(x - 1, z);
    if (wTile != null && wTile.y <= tile.y) {
      const y = wTile.y;
      const h = tile.y - wTile.y;

      this._addSolidWall(x, z, new SolidWall(x, y, h, z, x, y, h, z + 1));
    }

    const eTile = this._getTileAt(x + 1, z);
    if (eTile != null && eTile.y <= tile.y) {
      const y = eTile.y;
      const h = tile.y - eTile.y;

      this._addSolidWall(x, z, new SolidWall(x + 1, y, h, z + 1, x + 1, y, h, z));
    }
  }

  private _parseHighWalls(x: number, z: number) {
    const tile = this._getTileAt(x, z);

    const sTile = this._getTileAt(x, z + 1);
    if (sTile != null && sTile.y+sTile.height <= tile.y+tile.height) {
      const y = sTile.y + sTile.height;
      const h = (tile.y + tile.height) - y;

      this._addSolidWall(x, z, new SolidWall(x + 1, y, h, z + 1, x, y, h, z + 1));
    }

    const nTile = this._getTileAt(x, z - 1);
    if (nTile != null && nTile.y+nTile.height <= tile.y+tile.height) {
      const y = nTile.y + nTile.height;
      const h = (tile.y + tile.height) - y;

      this._addSolidWall(x, z, new SolidWall(x, y, h, z, x + 1, y, h, z));
    }

    const wTile = this._getTileAt(x - 1, z);
    if (wTile != null && wTile.y+wTile.height <= tile.y+tile.height) {
      const y = wTile.y + wTile.height;
      const h = (tile.y + tile.height) - y;

      this._addSolidWall(x, z, new SolidWall(x, y, h, z + 1, x, y, h, z));
    }

    const eTile = this._getTileAt(x + 1, z);
    if (eTile != null && eTile.y+eTile.height <= tile.y+tile.height) {
      const y = eTile.y + eTile.height;
      const h = (tile.y + tile.height) - y;

      this._addSolidWall(x, z, new SolidWall(x + 1, y, h, z, x + 1, y, h, z + 1));
    }
  }

  private _parseSlopeWalls(x: number, z: number) {
    const tile = this._getTileAt(x, z);

    if (tile.slope === 'w') {
      // South Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x, z + 1))) {
        this._addSolidWall(x, z, new SolidWall(x, tile.y, 0.5, z + 1, x + 1, tile.y, 0, z + 1));
      }

      // North Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x, z - 1))) {
        this._addSolidWall(x, z, new SolidWall(x + 1, tile.y, 0, z, x, tile.y, 0.5, z));
      }

      // West Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x - 1, z))) {
        this._addSolidWall(x, z, new SolidWall(x, tile.y, 0.5, z, x, tile.y, 0.5, z + 1));
      }
    } else if (tile.slope === 'e') {
      // South Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x, z + 1))) {
        this._addSolidWall(x, z, new SolidWall(x, tile.y, 0, z + 1, x + 1, tile.y, 0.5, z + 1));
      }

      // North Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x, z - 1))) {
        this._addSolidWall(x, z, new SolidWall(x + 1, tile.y, 0.5, z, x, tile.y, 0, z));
      }

      // East Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x + 1, z))) {
        this._addSolidWall(x, z, new SolidWall(x + 1, tile.y, 0.5, z + 1, x + 1, tile.y, 0.5, z));
      }
    } else if (tile.slope === 'n') {
      // West Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x - 1, z))) {
        this._addSolidWall(x, z, new SolidWall(x, tile.y, 0.5, z, x, tile.y, 0, z + 1));
      }

      // East Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x + 1, z))) {
        this._addSolidWall(x, z, new SolidWall(x + 1, tile.y, 0, z + 1, x + 1, tile.y, 0.5, z));
      }

      // North Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x, z - 1))) {
        this._addSolidWall(x, z, new SolidWall(x + 1, tile.y, 0.5, z, x, tile.y, 0.5, z));
      }
    } else if (tile.slope === 's') {
      // West Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x - 1, z))) {
        this._addSolidWall(x, z, new SolidWall(x, tile.y, 0, z, x, tile.y, 0.5, z + 1));
      }

      // East Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x + 1, z))) {
        this._addSolidWall(x, z, new SolidWall(x + 1, tile.y, 0.5, z + 1, x + 1, tile.y, 0, z));
      }

      // South Wall
      if (!this._isOccludedByWall(tile.y, tile.y + 0.5, this._getTileAt(x, z + 1))) {
        this._addSolidWall(x, z, new SolidWall(x, tile.y, 0.5, z + 1, x + 1, tile.y, 0.5, z + 1));
      }
    }
  }

  private _parsePlane(x: number, y: number, z: number) {
    const plane = new SolidPlane(new Vector3(x, y, z), new Vector3(x + 1, y, z), new Vector3(x, y, z + 1), new Vector3(x + 1, y, z + 1));

    if (this._planesMap[z][x] === null) { 
      this._planesMap[z][x] = []; 
    }

    this._planesMap[z][x].push(plane);
  }

  private _parseSlope(x: number, y: number, z: number, slope: 'n' | 'w' | 's' | 'e') {
    let plane;

    if (slope === 'w') {
      plane = new SolidPlane(new Vector3(x, y + 0.5, z), new Vector3(x + 1, y, z), new Vector3(x, y + 0.5, z + 1), new Vector3(x + 1, y, z + 1));
    } else if (slope === 'e') {
      plane = new SolidPlane(new Vector3(x, y, z), new Vector3(x + 1, y + 0.5, z), new Vector3(x, y, z + 1), new Vector3(x + 1, y + 0.5, z + 1));
    } else if (slope === 'n') {
      plane = new SolidPlane(new Vector3(x, y + 0.5, z), new Vector3(x + 1, y + 0.5, z), new Vector3(x, y, z + 1), new Vector3(x + 1, y, z + 1));
    } else if (slope === 's') {
      plane = new SolidPlane(new Vector3(x, y, z), new Vector3(x + 1, y, z), new Vector3(x, y + 0.5, z + 1), new Vector3(x + 1, y + 0.5, z + 1));
    }

    if (this._planesMap[z][x] === null) { 
      this._planesMap[z][x] = []; 
    }

    this._planesMap[z][x].push(plane);
  }

  public parseGridDungeon(dungeon: DungeonGrid) {
    const height = dungeon.map.length;
    const width = dungeon.map[0].length;

    this._level = dungeon;
    
    this._wallsMap = [];
    this._planesMap = [];
    for (let z=0;z<height;z++) {
      this._wallsMap[z] = [];
      this._planesMap[z] = [];

      for (let x=0;x<width;x++) {
        this._wallsMap[z][x] = null;
        this._planesMap[z][x] = null;

        const tileId = dungeon.map[z][x];
        if (tileId === 0) { continue; }

        const tile = this._getTileAt(x, z);

        if (tile.wallUV && !tile.diagonal) {
          this._parseWall(x, z);
        } else if (tile.wallUV && tile.diagonal) {
          this._parseDiagonalWall(x, z);
        }

        if (tile.floorUV && !tile.slope) {
          this._parsePlane(x, tile.y, z);
        } else if (tile.floorUV && tile.slope) {
          this._parseSlope(x, tile.y, z, tile.slope);
          this._parseSlopeWalls(x, z);
        }

        this._parsePlane(x, tile.y + tile.height, z);

        this._parseLowWalls(x, z);
        this._parseHighWalls(x, z);
      }
    }
  }
}
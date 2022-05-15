import { Geometry } from '../../geometries/Geometry';
import { degToRad } from '../../math/Math';
import { Vector3 } from '../../math/Vector3';
import { DungeonGrid } from './DungeonGrid';

export class DungeonGridGeometry extends Geometry {
  private _indexCount = 0;
  private _level: DungeonGrid;

  private _addFrontWall(x: number, y: number, z: number, h: number, uv: number[]) {
    return this.addVertice(x, y, z + 1)
          .addTexCoord(0, 1-y)
          .addNormal(0, 0, 1)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x + 1, y, z + 1)
          .addTexCoord(1, 1-y)
          .addNormal(0, 0, 1)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x, y + h, z + 1)
          .addTexCoord(0, 1-(y+h))
          .addNormal(0, 0, 1)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x + 1, y + h, z + 1)
          .addTexCoord(1, 1-(y+h))
          .addNormal(0, 0, 1)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3]);
  }

  private _addLeftWall(x: number, y: number, z: number, h: number, uv: number[]) {
    return this.addVertice(x, y, z)
          .addTexCoord(0, 1-y)
          .addNormal(-1, 0, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x, y, z + 1)
          .addTexCoord(1, 1-y)
          .addNormal(-1, 0, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x, y + h, z)
          .addTexCoord(0, 1-(y+h))
          .addNormal(-1, 0, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x, y + h, z + 1)
          .addTexCoord(1, 1-(y+h))
          .addNormal(-1, 0, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3]);
  }

  private _addRightWall(x: number, y: number, z: number, h: number, uv: number[]) {
    return this.addVertice(x + 1, y, z + 1)
          .addTexCoord(0, 1-y)
          .addNormal(1, 0, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x + 1, y, z)
          .addTexCoord(1, 1-y)
          .addNormal(1, 0, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x + 1, y + h, z + 1)
          .addTexCoord(0, 1-(y+h))
          .addNormal(1, 0, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x + 1, y + h, z)
          .addTexCoord(1, 1-(y+h))
          .addNormal(1, 0, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3]);
  }

  private _addBackWall(x: number, y: number, z: number, h: number, uv: number[]) {
    return this.addVertice(x + 1, y, z)
          .addTexCoord(0, 1-y)
          .addNormal(0, 0, -1)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x, y, z)
          .addTexCoord(1, 1-y)
          .addNormal(0, 0, -1)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x + 1, y + h, z)
          .addTexCoord(0, 1-(y+h))
          .addNormal(0, 0, -1)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x, y + h, z)
          .addTexCoord(1, 1-(y+h))
          .addNormal(0, 0, -1)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3]);
  }

  private _addTriangle() {
    this.addTriangle(this._indexCount,this._indexCount+1,this._indexCount+2);
    this._indexCount += 3;

    return this;
  }

  private _addQuad() {
    this.addTriangle(this._indexCount,this._indexCount+1,this._indexCount+2)
      .addTriangle(this._indexCount+1,this._indexCount+3,this._indexCount+2);

    this._indexCount += 4;

    return this;
  }

  private _isOccludedByWall(x: number, y: number, z: number, h: number) {
    const height = this._level.map.length;
    const width = this._level.map[0].length;

    if (x < 0 || z < 0 || x >= width || z >= height) { return true; }

    const tileId = this._level.map[z][x];
    if (tileId === 0) { return true; }

    const tile = this._level.tiles[tileId - 1];
    if (tile.y >= y+h || tile.y + tile.height < y) { return false; }

    if (tile.wallUV) {
      return true;
    }

    return false;
  }

  private _parseWalls(x: number, y: number, z: number, h: number, uv: number[]) {
    if (!this._isOccludedByWall(x,y,z-1,h)) {
      this._addBackWall(x,y,z,h,uv);
      this._addQuad();
    }

    if (!this._isOccludedByWall(x-1,y,z,h)) {
      this._addLeftWall(x,y,z,h,uv);
      this._addQuad();
    }

    if (!this._isOccludedByWall(x,y,z+1,h)) {
      this._addFrontWall(x,y,z,h,uv);
      this._addQuad();
    }

    if (!this._isOccludedByWall(x+1,y,z,h)) {
      this._addRightWall(x,y,z,h,uv);
      this._addQuad();
    }
  }

  private _parseFloor(x: number, y: number, z: number, uv: number[]) {
    this.addVertice(x, y, z + 1)
          .addTexCoord(0, 1)
          .addNormal(0, 1, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x + 1, y, z + 1)
          .addTexCoord(1, 1)
          .addNormal(0, 1, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x, y, z)
          .addTexCoord(0, 0)
          .addNormal(0, 1, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x + 1, y, z)
          .addTexCoord(1, 0)
          .addNormal(0, 1, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3]);

    this._addQuad();
  }

  private _parseCeil(x: number, y: number, z: number, uv: number[]) {
    this.addVertice(x, y, z)
          .addTexCoord(0, 1)
          .addNormal(0, -1, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x + 1, y, z)
          .addTexCoord(1, 1)
          .addNormal(0, -1, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x, y, z + 1)
          .addTexCoord(0, 0)
          .addNormal(0, -1, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

      .addVertice(x + 1, y, z + 1)
          .addTexCoord(1, 0)
          .addNormal(0, -1, 0)
          .addUV(uv[0], 1-uv[1], uv[2], -uv[3]);

    this._addQuad();
  }

  private _getTileAt(x: number, z: number) {
    const height = this._level.map.length;
    const width = this._level.map[0].length;

    if (x < 0 || z < 0 || x >= width || z >= height) { return null; }

    const tileId = this._level.map[z][x];
    if (tileId === 0) { return null; }

    return this._level.tiles[tileId - 1];
  }

  private _parseLowerWalls(x: number, z: number) {
    const tile = this._getTileAt(x, z);
    const uv = tile.lowWallUV || tile.wallUV || tile.floorUV;
    
    const lTile = this._getTileAt(x - 1, z);
    if (lTile !== null && tile.y > lTile.y) {
      this._addLeftWall(x, lTile.y, z, tile.y - lTile.y, uv);
      this._addQuad();
    }

    const rTile = this._getTileAt(x + 1, z);
    if (rTile !== null && tile.y > rTile.y) {
      this._addRightWall(x, rTile.y, z, tile.y - rTile.y, uv);
      this._addQuad();
    }

    const tTile = this._getTileAt(x, z - 1);
    if (tTile !== null && tile.y > tTile.y) {
      this._addBackWall(x, tTile.y, z, tile.y - tTile.y, uv);
      this._addQuad();
    }

    const bTile = this._getTileAt(x, z + 1);
    if (bTile !== null && tile.y > bTile.y) {
      this._addFrontWall(x, bTile.y, z, tile.y - bTile.y, uv);
      this._addQuad();
    }
  }

  private _parseHigherWalls(x: number, z: number) {
    const tile = this._getTileAt(x, z);
    const uv = tile.lowWallUV || tile.wallUV || tile.ceilingUV;
    const y2 = tile.y + tile.height;
    
    const lTile = this._getTileAt(x - 1, z);
    if (lTile != null) {
      const y1 = lTile.y + lTile.height;
      if (y2 > y1 && !this._isOccludedByWall(x, y1, z, y2 - y1)) {
        this._addRightWall(x-1, y1, z, y2 - (y1), uv);
        this._addQuad();
      }
    }

    const rTile = this._getTileAt(x + 1, z);
    if (rTile != null) {
      const y1 = rTile.y + rTile.height;
      if (y2 > y1 && !this._isOccludedByWall(x, y1, z, y2 - y1)) {
        this._addLeftWall(x+1, y1, z, y2 - (y1), uv);
        this._addQuad();
      }
    }

    const tTile = this._getTileAt(x, z - 1);
    if (tTile != null) {
      const y1 = tTile.y + tTile.height;
      if (y2 > y1 && !this._isOccludedByWall(x, y1, z, y2 - y1)) {
        this._addFrontWall(x, y1, z-1, y2 - (y1), uv);
        this._addQuad();
      }
    }

    const bTile = this._getTileAt(x, z + 1);
    if (bTile != null) {
      const y1 = bTile.y + bTile.height;
      if (y2 > y1 && !this._isOccludedByWall(x, y1, z, y2 - y1)) {
        this._addBackWall(x, y1, z+1, y2 - (y1), uv);
        this._addQuad();
      }
    }
  }

  private _parseDiagonalWall(x: number, y: number, z: number, h: number, dir: 'tl' | 'tr' | 'bl' | 'br', uv: number[]) {
    const C = Math.cos(degToRad(45));
    const S = Math.sin(degToRad(45));

    switch (dir) {
      case 'tl':
        this.addVertice(x, y, z + 1)
              .addTexCoord(0, 1-y)
              .addNormal(C, 0, S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x + 1, y, z)
              .addTexCoord(1, 1-y)
              .addNormal(C, 0, S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x, y + h, z + 1)
              .addTexCoord(0, 1-(y+h))
              .addNormal(C, 0, S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x + 1, y + h, z)
              .addTexCoord(1, 1-(y+h))
              .addNormal(C, 0, S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3]);

        if (!this._isOccludedByWall(x, y, z - 1, h)) { this._addBackWall(x, y, z, h, uv); this._addQuad(); }
        if (!this._isOccludedByWall(x - 1, y, z, h)) { this._addLeftWall(x, y, z, h, uv); this._addQuad(); }
        break;

      case 'tr':
        this.addVertice(x, y, z)
              .addTexCoord(0, 1-y)
              .addNormal(-C, 0, S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x + 1, y, z + 1)
              .addTexCoord(1, 1-y)
              .addNormal(-C, 0, S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x, y + h, z)
              .addTexCoord(0, 1-(y+h))
              .addNormal(-C, 0, S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x + 1, y + h, z + 1)
              .addTexCoord(1, 1-(y+h))
              .addNormal(-C, 0, S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3]);

        if (!this._isOccludedByWall(x, y, z - 1, h)) { this._addBackWall(x, y, z, h, uv); this._addQuad(); }
        if (!this._isOccludedByWall(x + 1, y, z, h)) { this._addRightWall(x, y, z, h, uv); this._addQuad(); }
        break;

      case 'bl':
        this.addVertice(x + 1, y, z + 1)
              .addTexCoord(0, 1-y)
              .addNormal(C, 0, -S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x, y, z)
              .addTexCoord(1, 1-y)
              .addNormal(C, 0, -S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x + 1, y + h, z + 1)
              .addTexCoord(0, 1-(y+h))
              .addNormal(C, 0, -S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x, y + h, z)
              .addTexCoord(1, 1-(y+h))
              .addNormal(C, 0, -S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3]);

        if (!this._isOccludedByWall(x, y, z + 1, h)) { this._addFrontWall(x, y, z, h, uv); this._addQuad(); }
        if (!this._isOccludedByWall(x - 1, y, z, h)) { this._addLeftWall(x, y, z, h, uv); this._addQuad(); }
        break;

      case 'br':
        this.addVertice(x + 1, y, z)
              .addTexCoord(0, 1-y)
              .addNormal(-C, 0, -S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x, y, z + 1)
              .addTexCoord(1, 1-y)
              .addNormal(-C, 0, -S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x + 1, y + h, z)
              .addTexCoord(0, 1-(y+h))
              .addNormal(-C, 0, -S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3])

          .addVertice(x, y + h, z + 1)
              .addTexCoord(1, 1-(y+h))
              .addNormal(-C, 0, -S)
              .addUV(uv[0], 1-uv[1], uv[2], -uv[3]);

        if (!this._isOccludedByWall(x, y, z + 1, h)) { this._addFrontWall(x, y, z, h, uv); this._addQuad(); }
        if (!this._isOccludedByWall(x + 1, y, z, h)) { this._addRightWall(x, y, z, h, uv); this._addQuad(); }
        break;
    }

    this._addQuad();
  }

  private _parseSlope(x: number, y: number, z: number, slope: 'n' | 's' | 'w' | 'e', floorUV: number[], lowWallUV: number[]) {
    const cross = Vector3.cross(new Vector3(1, 0, 0), new Vector3(0, 0.5, -1)).normalize();
    const C = cross.z;
    const S = cross.y;

    switch (slope) {
      case 'w':
        // Slope
        this.addVertice(x, y + 0.5, z + 1)
              .addTexCoord(0, 1)
              .addNormal(C, S, 0)
              .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

          .addVertice(x + 1, y, z + 1)
              .addTexCoord(1, 1)
              .addNormal(C, S, 0)
              .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

          .addVertice(x, y + 0.5, z)
              .addTexCoord(0, 0)
              .addNormal(C, S, 0)
              .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

          .addVertice(x + 1, y, z)
              .addTexCoord(1, 0)
              .addNormal(C, S, 0)
              .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3]);

        // South Wall
        this.addVertice(x, y, z + 1)
              .addTexCoord(0, 1-y)
              .addNormal(0, 0, 1)
              .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

          .addVertice(x + 1, y, z + 1)
              .addTexCoord(1, 1-y)
              .addNormal(0, 0, 1)
              .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

          .addVertice(x, y + 0.5, z + 1)
              .addTexCoord(0, 1-(y+0.5))
              .addNormal(0, 0, 1)
              .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3]);

        // North Wall
        this.addVertice(x + 1, y, z)
              .addTexCoord(0, 1-y)
              .addNormal(0, 0, -1)
              .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

          .addVertice(x, y, z)
              .addTexCoord(1, 1-y)
              .addNormal(0, 0, -1)
              .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

          .addVertice(x, y + 0.5, z)
              .addTexCoord(1, 1-(y+0.5))
              .addNormal(0, 0, -1)
              .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3]);

        this._addLeftWall(x, y, z, 0.5, lowWallUV);

        break;

        case 'e':
          // Slope
          this.addVertice(x, y, z + 1)
                .addTexCoord(0, 1)
                .addNormal(-C, S, 0)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

            .addVertice(x + 1, y + 0.5, z + 1)
                .addTexCoord(1, 1)
                .addNormal(-C, S, 0)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

            .addVertice(x, y, z)
                .addTexCoord(0, 0)
                .addNormal(-C, S, 0)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

            .addVertice(x + 1, y + 0.5, z)
                .addTexCoord(1, 0)
                .addNormal(-C, S, 0)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3]);
  
          // South Wall
          this.addVertice(x, y, z + 1)
                .addTexCoord(0, 1-y)
                .addNormal(0, 0, 1)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x + 1, y, z + 1)
                .addTexCoord(1, 1-y)
                .addNormal(0, 0, 1)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x + 1, y + 0.5, z + 1)
                .addTexCoord(1, 1-(y+0.5))
                .addNormal(0, 0, 1)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3]);
  
          // North Wall
          this.addVertice(x + 1, y, z)
                .addTexCoord(0, 1-y)
                .addNormal(0, 0, -1)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x, y, z)
                .addTexCoord(1, 1-y)
                .addNormal(0, 0, -1)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x + 1, y + 0.5, z)
                .addTexCoord(0, 1-(y+0.5))
                .addNormal(0, 0, -1)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3]);
  
          this._addRightWall(x, y, z, 0.5, lowWallUV);
  
          break;

        case 'n':
          // Slope
          this.addVertice(x, y, z + 1)
                .addTexCoord(0, 1)
                .addNormal(0, S, C)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

            .addVertice(x + 1, y, z + 1)
                .addTexCoord(1, 1)
                .addNormal(0, S, C)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

            .addVertice(x, y + 0.5, z)
                .addTexCoord(0, 0)
                .addNormal(0, S, C)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

            .addVertice(x + 1, y + 0.5, z)
                .addTexCoord(1, 0)
                .addNormal(0, S, C)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3]);
  
          // West wall
          this.addVertice(x, y, z)
                .addTexCoord(0, 1-y)
                .addNormal(-1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x, y, z + 1)
                .addTexCoord(1, 1-y)
                .addNormal(-1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x, y + 0.5, z)
                .addTexCoord(0, 1-(y+0.5))
                .addNormal(-1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3]);
  
          // East wall
          this.addVertice(x + 1, y, z + 1)
                .addTexCoord(0, 1-y)
                .addNormal(1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x + 1, y, z)
                .addTexCoord(1, 1-y)
                .addNormal(1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x + 1, y + 0.5, z)
                .addTexCoord(1, 1-(y+0.5))
                .addNormal(1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3]);
  
          this._addBackWall(x, y, z, 0.5, lowWallUV);
  
          break;

        case 's':
          // Slope
          this.addVertice(x, y + 0.5, z + 1)
                .addTexCoord(0, 1)
                .addNormal(0, S, -C)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

            .addVertice(x + 1, y + 0.5, z + 1)
                .addTexCoord(1, 1)
                .addNormal(0, S, -C)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

            .addVertice(x, y, z)
                .addTexCoord(0, 0)
                .addNormal(0, S, -C)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3])

            .addVertice(x + 1, y, z)
                .addTexCoord(1, 0)
                .addNormal(0, S, -C)
                .addUV(floorUV[0], 1-floorUV[1], floorUV[2], -floorUV[3]);
  
          // West Wall
          this.addVertice(x, y, z)
                .addTexCoord(0, 1-y)
                .addNormal(-1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x, y, z + 1)
                .addTexCoord(1, 1-y)
                .addNormal(-1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x, y + 0.5, z + 1)
                .addTexCoord(1, 1-(y+0.5))
                .addNormal(-1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3]);
  
          // East Wall
          this.addVertice(x + 1, y, z + 1)
                .addTexCoord(0, 1-y)
                .addNormal(1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x + 1, y, z)
                .addTexCoord(1, 1-y)
                .addNormal(1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3])

            .addVertice(x + 1, y + 0.5, z + 1)
                .addTexCoord(0, 1-(y+0.5))
                .addNormal(1, 0, 0)
                .addUV(lowWallUV[0], 1-lowWallUV[1], lowWallUV[2], -lowWallUV[3]);
  
          this._addFrontWall(x, y, z, 0.5, lowWallUV);
  
          break;
    }

    this._addQuad();
    this._addTriangle();
    this._addTriangle();
    this._addQuad();
  }

  public parseMap(level: DungeonGrid) {
    this._level = level;
    const height = level.map.length;
    const width = level.map[0].length;

    for (let z=0;z<height;z++) {
      for (let x=0;x<width;x++) {
        const tileId = level.map[z][x];
        if (tileId === 0) { continue; }

        const tile = level.tiles[level.map[z][x] - 1];

        if (tile.wallUV && !tile.diagonal) {
          this._parseWalls(x, tile.y, z, tile.height, tile.wallUV);
        } else if (tile.wallUV && tile.diagonal) {
          this._parseDiagonalWall(x, tile.y, z, tile.height, tile.diagonal, tile.wallUV);
        }
        
        if (tile.floorUV && !tile.slope) {
          this._parseFloor(x, tile.y, z, tile.floorUV);
        } else if (tile.floorUV && tile.slope) {
          this._parseSlope(x, tile.y, z, tile.slope, tile.floorUV, tile.lowWallUV);
        }
        
        if (tile.ceilingUV) {
          this._parseCeil(x, tile.y + tile.height, z, tile.ceilingUV);
        }

        this._parseLowerWalls(x, z);
        this._parseHigherWalls(x, z);
      }
    }

    this.build();

    return this;
  }
}
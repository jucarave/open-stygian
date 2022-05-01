import { Geometry } from '../../geometries/Geometry';
import { DungeonGrid } from './DungeonGrid';

export class DungeonGridGeometry extends Geometry {
  private _indexCount = 0;
  private _level: DungeonGrid;

  private _addFrontWall(x: number, y: number, z: number, h: number, uv: number[]) {
    return this.addVertice(x, y, z + 1).addTexCoord(uv[0], 1-uv[1]-uv[3])
      .addVertice(x + 1, y, z + 1).addTexCoord(uv[0]+uv[2], 1-uv[1]-uv[3])
      .addVertice(x, y + h, z + 1).addTexCoord(uv[0], 1-uv[1]-uv[3]*(1-h))
      .addVertice(x + 1, y + h, z + 1).addTexCoord(uv[0]+uv[2], 1-uv[1]-uv[3]*(1-h));
  }

  private _addLeftWall(x: number, y: number, z: number, h: number, uv: number[]) {
    return this.addVertice(x, y, z).addTexCoord(uv[0], 1-uv[1]-uv[3])
      .addVertice(x, y, z + 1).addTexCoord(uv[0]+uv[2], 1-uv[1]-uv[3])
      .addVertice(x, y + h, z).addTexCoord(uv[0], 1-uv[1]-uv[3]*(1-h))
      .addVertice(x, y + h, z + 1).addTexCoord(uv[0]+uv[2], 1-uv[1]-uv[3]*(1-h));
  }

  private _addRightWall(x: number, y: number, z: number, h: number, uv: number[]) {
    return this.addVertice(x + 1, y, z + 1).addTexCoord(uv[0], 1-uv[1]-uv[3])
      .addVertice(x + 1, y, z).addTexCoord(uv[0]+uv[2], 1-uv[1]-uv[3])
      .addVertice(x + 1, y + h, z + 1).addTexCoord(uv[0], 1-uv[1]-uv[3]*(1-h))
      .addVertice(x + 1, y + h, z).addTexCoord(uv[0]+uv[2], 1-uv[1]-uv[3]*(1-h));
  }

  private _addBackWall(x: number, y: number, z: number, h: number, uv: number[]) {
    return this.addVertice(x + 1, y, z).addTexCoord(uv[0], 1-uv[1]-uv[3])
      .addVertice(x, y, z).addTexCoord(uv[0]+uv[2], 1-uv[1]-uv[3])
      .addVertice(x + 1, y + h, z).addTexCoord(uv[0], 1-uv[1]-uv[3]*(1-h))
      .addVertice(x, y + h, z).addTexCoord(uv[0]+uv[2], 1-uv[1]-uv[3]*(1-h));
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
    let i = 0;
    while (h > 0) {
      const wh = Math.min(h, 1);
      
      if (!this._isOccludedByWall(x,y,z-1,h)) {
        this._addBackWall(x,y+i,z,wh,uv);
        this._addQuad();
      }

      if (!this._isOccludedByWall(x-1,y,z,h)) {
        this._addLeftWall(x,y+i,z,wh,uv);
        this._addQuad();
      }

      if (!this._isOccludedByWall(x,y,z+1,h)) {
        this._addFrontWall(x,y+i,z,wh,uv);
        this._addQuad();
      }

      if (!this._isOccludedByWall(x+1,y,z,h)) {
        this._addRightWall(x,y+i,z,wh,uv);
        this._addQuad();
      }
      
      h -= 1;
      i += 1;
    }
  }

  private _parseFloor(x: number, y: number, z: number, uv: number[]) {
    this.addVertice(x, y, z + 1).addTexCoord(uv[0], 1-uv[1]-uv[3])
      .addVertice(x + 1, y, z + 1).addTexCoord(uv[0]+uv[2], 1-uv[1]-uv[3])
      .addVertice(x, y, z).addTexCoord(uv[0], 1-uv[1])
      .addVertice(x + 1, y, z).addTexCoord(uv[0]+uv[2], 1-uv[1]);

    this._addQuad();
  }

  private _parseCeil(x: number, y: number, z: number, uv: number[]) {
    this.addVertice(x, y, z).addTexCoord(uv[0], 1-uv[1]-uv[3])
      .addVertice(x + 1, y, z).addTexCoord(uv[0]+uv[2], 1-uv[1]-uv[3])
      .addVertice(x, y, z + 1).addTexCoord(uv[0], 1-uv[1])
      .addVertice(x + 1, y, z + 1).addTexCoord(uv[0]+uv[2], 1-uv[1]);

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

        if (tile.wallUV) {
          this._parseWalls(x, tile.y, z, tile.height, tile.wallUV);
        }
        
        if (tile.floorUV) {
          this._parseFloor(x, tile.y, z, tile.floorUV);
        }
        
        if (tile.ceilingUV) {
          this._parseCeil(x, tile.y + tile.height, z, tile.ceilingUV);
        }
      }
    }

    this.build();

    return this;
  }
}
import { DungeonMap } from '../DungeonMap';
import { Geometry } from '../geometries/Geometry';
import { MaterialDungeon } from '../materials/MaterialDungeon';
import { Texture } from '../core/Texture';
import { Entity } from './Entity';

/**
 * Used for detecting neighboring tiles, it is used to render
 * only the walls that are visible to the player
 */
interface NeighborTiles {
  l: number;
  r: number;
  t: number;
  b: number;
}

/**
 * Parses a DungeonMap file and generates a 3D dungeon Entity
 * with geometry and material
 */
export class Dungeon extends Entity {
  constructor(map: DungeonMap) {
    super();

    const texture = Texture.getTexture(map.texture);

    this.geometry = new Geometry();
    this.material = new MaterialDungeon(texture);

    this._parseMap(map);

    this.geometry.build();
  }

  /**
   * Adds a plane looking at +y to act as a floor
   * 
   * @param x 
   * @param y 
   * @param z 
   * @param uv 
   */
  private _addFloor(x: number, y: number, z: number, uv: number[]) {
    // 6 indices per face, 4 vertices per face
    const index = this.geometry.indicesLength / 6 * 4;

    this.geometry
      .addVertice(x, y, z+1).addTexCoord(0, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x+1, y, z+1).addTexCoord(1, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x, y, z).addTexCoord(0, 0).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x+1, y, z).addTexCoord(1, 0).addUVs(uv[0], uv[1], uv[2], uv[3])

      .addTriangle(index, index + 1, index + 2)
      .addTriangle(index + 1, index + 3, index + 2);
  }

  /**
   * Adds a plane looking at -y to act as a ceiling
   * 
   * @param x 
   * @param y 
   * @param z 
   * @param uv 
   */
  private _addCeiling(x: number, y: number, z: number, uv: number[]) {
    // 6 indices per face, 4 vertices per face
    const index = this.geometry.indicesLength / 6 * 4;

    this.geometry
      .addVertice(x, y, z).addTexCoord(0, 0).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x+1, y, z).addTexCoord(1, 0).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x, y, z+1).addTexCoord(0, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x+1, y, z+1).addTexCoord(1, 1).addUVs(uv[0], uv[1], uv[2], uv[3])

      .addTriangle(index, index + 1, index + 2)
      .addTriangle(index + 1, index + 3, index + 2);
  }

  /**
   * Adds a plane looking at +z to act as a wall
   * 
   * @param x 
   * @param y1 
   * @param z 
   * @param y2
   * @param uv 
   */
  private _addFrontWall(x: number, y1: number, z: number, y2: number, uv: number[]) {
    // 6 indices per face, 4 vertices per face
    const index = this.geometry.indicesLength / 6 * 4;
    this.geometry
        .addVertice(x, y1, z + 1).addTexCoord(0, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x + 1, y1, z + 1).addTexCoord(1, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x, y2, z + 1).addTexCoord(0, y2).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x + 1, y2, z + 1).addTexCoord(1, y2).addUVs(uv[0], uv[1], uv[2], uv[3]) 
        
        .addTriangle(index, index + 1, index + 2)
        .addTriangle(index + 1, index + 3, index + 2);
  }

  /**
   * Adds a plane looking at -z to act as a wall
   * 
   * @param x 
   * @param y1 
   * @param z 
   * @param y2
   * @param uv 
   */
  private _addBackWall(x: number, y1: number, z: number, y2: number, uv: number[]) {
    // 6 indices per face, 4 vertices per face
    const index = this.geometry.indicesLength / 6 * 4;
    this.geometry
        .addVertice(x + 1, y1, z).addTexCoord(0, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x, y1, z).addTexCoord(1, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x + 1, y2, z).addTexCoord(0, y2).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x, y2, z).addTexCoord(1, y2).addUVs(uv[0], uv[1], uv[2], uv[3]) 
        
        .addTriangle(index, index + 1, index + 2)
        .addTriangle(index + 1, index + 3, index + 2);
  }

  /**
   * Adds a plane looking at -x to act as a wall
   * 
   * @param x 
   * @param y1 
   * @param z 
   * @param y2
   * @param uv 
   */
  private _addLeftWall(x: number, y1: number, z: number, y2: number, uv: number[]) {
    // 6 indices per face, 4 vertices per face
    const index = this.geometry.indicesLength / 6 * 4;
    this.geometry
        .addVertice(x, y1, z).addTexCoord(0, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x, y1, z + 1).addTexCoord(1, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x, y2, z).addTexCoord(0, y2).addUVs(uv[0], uv[1], uv[2], uv[3]) 
        .addVertice(x, y2, z + 1).addTexCoord(1, y2).addUVs(uv[0], uv[1], uv[2], uv[3])
        
        .addTriangle(index, index + 1, index + 2)
        .addTriangle(index + 1, index + 3, index + 2);
  }

  /**
   * Adds a plane looking at +x to act as a wall
   * 
   * @param x 
   * @param y1 
   * @param z 
   * @param y2
   * @param uv 
   */
  private _addRightWall(x: number, y1: number, z: number, y2: number, uv: number[]) {
    // 6 indices per face, 4 vertices per face
    const index = this.geometry.indicesLength / 6 * 4;
    this.geometry
        .addVertice(x + 1, y1, z + 1).addTexCoord(0, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x + 1, y1, z).addTexCoord(1, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x + 1, y2, z + 1).addTexCoord(0, y2).addUVs(uv[0], uv[1], uv[2], uv[3]) 
        .addVertice(x + 1, y2, z).addTexCoord(1, y2).addUVs(uv[0], uv[1], uv[2], uv[3])
        
        .addTriangle(index, index + 1, index + 2)
        .addTriangle(index + 1, index + 3, index + 2);
  }

  /**
   * Adds a four sided cube to the map rendering only the sides that are
   * visible to the player
   * 
   * @param x 
   * @param y1
   * @param z
   * @param y2
   * @param uv 
   * @param neighbors 
   */
  private _addWall(x: number, y1: number, z: number, y2: number, uv: number[], neighbors: NeighborTiles) {
    // Front face
    if (!neighbors.b) {
      this._addFrontWall(x, y1, z, y2, uv);
    }

    // Back face
    if (!neighbors.t) {
      this._addBackWall(x, y1, z, y2, uv);
    }

    // Left face
    if (!neighbors.l) {
      this._addLeftWall(x, y1, z, y2, uv);
    }

    // Right face
    if (!neighbors.r) {
      this._addRightWall(x, y1, z, y2, uv);
    }
  }

  /**
   * Get the neighboring walls to detect which sides of the geometry of
   * the wall needs to be generated.
   * 
   * @param map 
   * @param x 
   * @param z 
   * @returns Which walls neighboring tiles are Walls
   */
  private _getNeighborWalls(map: DungeonMap, x: number, z: number): NeighborTiles {
    const height = map.map.length;
    const width = map.map[0].length;
    const neighbors = {l: 0, t: 0, r: 0, b: 0};

    if (z === 0 || (map.map[z - 1][x] !== 0 && map.tiles[map.map[z - 1][x] - 1].wall)) { 
      neighbors.t = 1; 
    }

    if (z >= height - 1 || (map.map[z + 1][x] !== 0 && map.tiles[map.map[z + 1][x] - 1].wall)) { 
      neighbors.b = 1; 
    }

    if (x === 0 || (map.map[z][x - 1] !== 0 && map.tiles[map.map[z][x - 1] - 1].wall)) { 
      neighbors.l = 1; 
    }

    if (x >= width - 1 || (map.map[z][x + 1] !== 0 && map.tiles[map.map[z][x + 1] - 1].wall)) { 
      neighbors.r = 1; 
    }
    
    return neighbors;
  }

  /**
   * If y1 it's in a different height than it's neighbors then
   * walls will appear connecting them
   * 
   * @param map 
   * @param x 
   * @param z 
   */
  private _addLowerWalls(map: DungeonMap, x: number, z: number) {
    const height = map.map.length;
    const width = map.map[0].length;
    const tile = map.tiles[map.map[z][x] - 1];
    const uv = tile.floor?.lowWallUV || tile.floor?.uv || tile.wall?.uv || [0,0,1,1];
    const y2 = tile.y1;

    // Back Face
    if (z > 0 && map.map[z - 1][x] !== 0) { 
      const nTile = map.tiles[map.map[z - 1][x] - 1];
      if (!nTile.wall && nTile.y1 < y2) {
        const y1 = nTile.y1;
        this._addBackWall(x, y1, z, y2, uv);
      }
    }

    // Front Face
    if (z < height - 1 && map.map[z + 1][x] !== 0) { 
      const nTile = map.tiles[map.map[z + 1][x] - 1];
      if (!nTile.wall && nTile.y1 < y2) {
        const y1 = nTile.y1;
        this._addFrontWall(x, y1, z, y2, uv);
      }
    }

    // Left Face
    if (x > 0 && map.map[z][x - 1] !== 0) { 
      const nTile = map.tiles[map.map[z][x - 1] - 1];
      if (!nTile.wall && nTile.y1 < y2) {
        const y1 = nTile.y1;
        this._addLeftWall(x, y1, z, y2, uv);
      }
    }

    // Right Face
    if (x < width - 1 && map.map[z][x + 1] !== 0) { 
      const nTile = map.tiles[map.map[z][x + 1] - 1];
      if (!nTile.wall && nTile.y1 < y2) {
        const y1 = nTile.y1;
        this._addRightWall(x, y1, z, y2, uv);
      }
    }
  } 

  /**
   * If y2 it's in a different height than it's neighbors then
   * walls will appear connecting them
   * 
   * @param map 
   * @param x 
   * @param z 
   */
  private _addTopWalls(map: DungeonMap, x: number, z: number) {
    const height = map.map.length;
    const width = map.map[0].length;
    const tile = map.tiles[map.map[z][x] - 1];
    const uv = tile.ceiling?.highWallUV || tile.ceiling?.uv || tile.wall?.uv || [0,0,1,1];
    const y2 = tile.y2;

    if (tile.wall) { return; }

    // Back Face
    if (z < height - 1 && map.map[z + 1][x] !== 0) { 
      const nTile = map.tiles[map.map[z + 1][x] - 1];
      if (nTile.y2 < y2) {
        const y1 = nTile.y2;
        this._addBackWall(x, y1, z + 1, y2, uv);
      }
    }

    // Front Face
    if (z > 0 && map.map[z - 1][x] !== 0) { 
      const nTile = map.tiles[map.map[z - 1][x] - 1];
      if (nTile.y2 < y2) {
        const y1 = nTile.y2;
        this._addFrontWall(x, y1, z - 1, y2, uv);
      }
    }

    // Left Face
    if (x < width - 1 && map.map[z][x + 1] !== 0) { 
      const nTile = map.tiles[map.map[z][x + 1] - 1];
      if (nTile.y2 < y2) {
        const y1 = nTile.y2;
        this._addLeftWall(x + 1, y1, z, y2, uv);
      }
    }

    // Right Face
    if (x > 0 && map.map[z][x - 1] !== 0) { 
      const nTile = map.tiles[map.map[z][x - 1] - 1];
      if (nTile.y2 < y2) {
        const y1 = nTile.y2;
        this._addRightWall(x - 1, y1, z, y2, uv);
      }
    }
  } 

  private _addDiagonalWall(x: number, y1: number, z: number, y2: number, diagonal: 'tl' | 'tr' | 'bl' | 'br', uv: number[]) {
    switch (diagonal) {
      case 'tl':
        this.geometry
          .addVertice(x, y1, z + 1).addTexCoord(0, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x + 1, y1, z).addTexCoord(1, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x, y2, z + 1).addTexCoord(0, y2).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x + 1, y2, z).addTexCoord(1, y2).addUVs(uv[0], uv[1], uv[2], uv[3]);
        break;

      case 'tr':
        this.geometry
          .addVertice(x, y1, z).addTexCoord(0, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x + 1, y1, z + 1).addTexCoord(1, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x, y2, z).addTexCoord(0, y2).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x + 1, y2, z + 1).addTexCoord(1, y2).addUVs(uv[0], uv[1], uv[2], uv[3]);
        break;

      case 'bl':
        this.geometry
          .addVertice(x + 1, y1, z + 1).addTexCoord(0, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x, y1, z).addTexCoord(1, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x + 1, y2, z + 1).addTexCoord(0, y2).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x, y2, z).addTexCoord(1, y2).addUVs(uv[0], uv[1], uv[2], uv[3]);
        break;

      case 'br':
        this.geometry
          .addVertice(x + 1, y1, z).addTexCoord(0, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x, y1, z + 1).addTexCoord(1, y1).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x + 1, y2, z).addTexCoord(0, y2).addUVs(uv[0], uv[1], uv[2], uv[3])
          .addVertice(x, y2, z + 1).addTexCoord(1, y2).addUVs(uv[0], uv[1], uv[2], uv[3]);
        break;
    }

    // 6 indices per face, 4 vertices per face
    const index = this.geometry.indicesLength / 6 * 4;
    this.geometry
      .addTriangle(index, index + 1, index + 2)
      .addTriangle(index + 1, index + 3, index + 2);
  }

  /**
   * Iterates through each tile and creates the geometry of 
   * each tile. If the tile is 0 then nothing is generated
   */
  private _parseMap(map: DungeonMap) {
    const height = map.map.length;
    const width = map.map[0].length;

    for (let z=0;z<height;z++) {
      for (let x=0;x<width;x++) {
        const tileId = map.map[z][x] - 1;
        if (tileId === -1) { continue; }

        const tile = map.tiles[tileId];
        if (tile.floor?.uv) {
          this._addFloor(x, tile.y1, z, tile.floor.uv);
        }

        if (tile.ceiling?.uv) {
          this._addCeiling(x, tile.y2, z, tile.ceiling.uv);
        }

        if (tile.wall && !tile.wall.diagonal) {
          this._addWall(x, tile.y1, z, tile.y2, tile.wall.uv, this._getNeighborWalls(map, x, z));
        } else if (tile.wall && tile.wall.diagonal) {
          this._addDiagonalWall(x, tile.y1, z, tile.y2, tile.wall.diagonal, tile.wall.uv);
        }

        this._addLowerWalls(map, x, z);
        this._addTopWalls(map, x, z);
      }
    }
  }
}
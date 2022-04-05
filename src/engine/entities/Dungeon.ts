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
  l: boolean;
  r: boolean;
  t: boolean;
  b: boolean;
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
   * @param z 
   * @param uv 
   */
  private _addFloor(x: number, z: number, uv: number[]) {
    // 6 indices per face, 4 vertices per face
    const index = this.geometry.indicesLength / 6 * 4;

    this.geometry
      .addVertice(x, 0, z+1).addTexCoord(0, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x+1, 0, z+1).addTexCoord(1, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x, 0, z).addTexCoord(0, 0).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x+1, 0, z).addTexCoord(1, 0).addUVs(uv[0], uv[1], uv[2], uv[3])

      .addTriangle(index, index + 1, index + 2)
      .addTriangle(index + 1, index + 3, index + 2);
  }

  /**
   * Adds a plane looking at -y to act as a ceiling
   * 
   * @param x 
   * @param z 
   * @param uv 
   */
  private _addCeil(x: number, z: number, uv: number[]) {
    // 6 indices per face, 4 vertices per face
    const index = this.geometry.indicesLength / 6 * 4;

    this.geometry
      .addVertice(x, 1, z).addTexCoord(0, 0).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x+1, 1, z).addTexCoord(1, 0).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x, 1, z+1).addTexCoord(0, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
      .addVertice(x+1, 1, z+1).addTexCoord(1, 1).addUVs(uv[0], uv[1], uv[2], uv[3])

      .addTriangle(index, index + 1, index + 2)
      .addTriangle(index + 1, index + 3, index + 2);
  }

  /**
   * Adds a four sided cube to the map rendering only the sides that are
   * visible to the player
   * 
   * @param x 
   * @param z 
   * @param uv 
   * @param neighbors 
   */
  private _addWall(x: number, z: number, uv: number[], neighbors: NeighborTiles) {
    // 6 indices per face, 4 vertices per face
    let index = this.geometry.indicesLength / 6 * 4;

    // Front face
    if (!neighbors.b) {
      this.geometry
        .addVertice(x, 0, z + 1).addTexCoord(0, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x + 1, 0, z + 1).addTexCoord(1, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x, 1, z + 1).addTexCoord(0, 0).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x + 1, 1, z + 1).addTexCoord(1, 0).addUVs(uv[0], uv[1], uv[2], uv[3]) 
        
        .addTriangle(index, index + 1, index + 2)
        .addTriangle(index + 1, index + 3, index + 2);
    }

    // Back face
    if (!neighbors.t) {
      index = this.geometry.indicesLength / 6 * 4;
      this.geometry
        .addVertice(x + 1, 0, z).addTexCoord(0, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x, 0, z).addTexCoord(1, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x + 1, 1, z).addTexCoord(0, 0).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x, 1, z).addTexCoord(1, 0).addUVs(uv[0], uv[1], uv[2], uv[3]) 
        
        .addTriangle(index, index + 1, index + 2)
        .addTriangle(index + 1, index + 3, index + 2);
    }

    // Left face
    if (!neighbors.l) {
      index = this.geometry.indicesLength / 6 * 4;
      this.geometry
        .addVertice(x, 0, z).addTexCoord(0, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x, 0, z + 1).addTexCoord(1, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x, 1, z).addTexCoord(0, 0).addUVs(uv[0], uv[1], uv[2], uv[3]) 
        .addVertice(x, 1, z + 1).addTexCoord(1, 0).addUVs(uv[0], uv[1], uv[2], uv[3])
        
        .addTriangle(index, index + 1, index + 2)
        .addTriangle(index + 1, index + 3, index + 2);
    }

    // Right face
    if (!neighbors.r) {
      index = this.geometry.indicesLength / 6 * 4;
      this.geometry
        .addVertice(x + 1, 0, z + 1).addTexCoord(0, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x + 1, 0, z).addTexCoord(1, 1).addUVs(uv[0], uv[1], uv[2], uv[3])
        .addVertice(x + 1, 1, z + 1).addTexCoord(0, 0).addUVs(uv[0], uv[1], uv[2], uv[3]) 
        .addVertice(x + 1, 1, z).addTexCoord(1, 0).addUVs(uv[0], uv[1], uv[2], uv[3])
        
        .addTriangle(index, index + 1, index + 2)
        .addTriangle(index + 1, index + 3, index + 2);
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
    const neighbors = {l: false, t: false, r: false, b: false};

    if (z === 0 || (map.map[z - 1][x] !== 0 && map.tiles[map.map[z - 1][x] - 1].type === 'Wall')) { 
      neighbors.t = true; 
    }

    if (z >= height - 1 || (map.map[z + 1][x] !== 0 && map.tiles[map.map[z + 1][x] - 1].type === 'Wall')) { 
      neighbors.b = true; 
    }

    if (x === 0 || (map.map[z][x - 1] !== 0 && map.tiles[map.map[z][x - 1] - 1].type === 'Wall')) { 
      neighbors.l = true; 
    }

    if (x >= width - 1 || (map.map[z][x + 1] !== 0 && map.tiles[map.map[z][x + 1] - 1].type === 'Wall')) { 
      neighbors.r = true; 
    }
    
    return neighbors;
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
        switch (tile.type) {
          case 'Floor':
            this._addFloor(x, z, tile.uv);
            this._addCeil(x, z, tile.ceilUV);
            break;

          case 'Wall':
            this._addWall(x, z, tile.uv, this._getNeighborWalls(map, x, z));
            break;
        }
      }
    }
  }
}
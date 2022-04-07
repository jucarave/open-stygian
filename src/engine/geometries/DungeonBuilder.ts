import { DungeonMap, Tile } from '../DungeonMap';
import { Vector2 } from '../math/Vector2';
import { TEXCOORD_SIZE, UVS_SIZE, VERTICE_SIZE } from '../system/Constants';
import { Geometry } from './Geometry';

export class DungeonBuilder extends Geometry {
  /**
   * Adds a plane looking at +y to act as a floor
   * 
   * @param x 
   * @param y 
   * @param z 
   * @param uv 
   */
   public addFloor(x: number, y: number, z: number, uv: number[]) {
    this
      .addVertice(x, y, z+1).addTexCoord(0, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
      .addVertice(x+1, y, z+1).addTexCoord(1, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
      .addVertice(x, y, z).addTexCoord(0, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
      .addVertice(x+1, y, z).addTexCoord(1, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);

    this._addQuad()
  }

  /**
   * Adds a plane looking at -y to act as a ceiling
   * 
   * @param x 
   * @param y 
   * @param z 
   * @param uv 
   */
  public addCeiling(x: number, y: number, z: number, uv: number[]) {
    this
      .addVertice(x, y, z).addTexCoord(0, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
      .addVertice(x+1, y, z).addTexCoord(1, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
      .addVertice(x, y, z+1).addTexCoord(0, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
      .addVertice(x+1, y, z+1).addTexCoord(1, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);
    
    this._addQuad();
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
  public addFrontWall(x: number, y1: number, z: number, y2: number, uv: number[]) {
    this
        .addVertice(x, y1, z + 1).addTexCoord(0, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
        .addVertice(x + 1, y1, z + 1).addTexCoord(1, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
        .addVertice(x, y2, z + 1).addTexCoord(0, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
        .addVertice(x + 1, y2, z + 1).addTexCoord(1, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);

    this._addQuad();
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
  public addBackWall(x: number, y1: number, z: number, y2: number, uv: number[]) {
    this
        .addVertice(x + 1, y1, z).addTexCoord(0, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
        .addVertice(x, y1, z).addTexCoord(1, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
        .addVertice(x + 1, y2, z).addTexCoord(0, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
        .addVertice(x, y2, z).addTexCoord(1, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);

    this._addQuad();
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
  public addLeftWall(x: number, y1: number, z: number, y2: number, uv: number[]) {
    this
        .addVertice(x, y1, z).addTexCoord(0, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
        .addVertice(x, y1, z + 1).addTexCoord(1, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
        .addVertice(x, y2, z).addTexCoord(0, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]) 
        .addVertice(x, y2, z + 1).addTexCoord(1, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);
    
    this._addQuad();
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
  public addRightWall(x: number, y1: number, z: number, y2: number, uv: number[]) {
    this
        .addVertice(x + 1, y1, z + 1).addTexCoord(0, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
        .addVertice(x + 1, y1, z).addTexCoord(1, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
        .addVertice(x + 1, y2, z + 1).addTexCoord(0, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]) 
        .addVertice(x + 1, y2, z).addTexCoord(1, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);

    this._addQuad();
  }

  /**
   * Adds a four sided cube to the map rendering only the sides that are
   * visible to the player
   * 
   * @param x 
   * @param z
   * @param uv 
   * @param dungeon
   */
  public addWall(x: number, z: number, uv: number[], dungeon: DungeonMap) {
    const tile = this._getTileAt(x, z, dungeon) as Tile;
    const { y1, y2 } = tile;

    // Front face
    if (!this._isOcluddedByAWall(x, y1, z, y2, { x: 0, y: 1 }, dungeon)) {
      this.addFrontWall(x, y1, z, y2, uv);
    }

    // Back face
    if (!this._isOcluddedByAWall(x, y1, z, y2, { x: 0, y: -1 }, dungeon)) {
      this.addBackWall(x, y1, z, y2, uv);
    }

    // Left face
    if (!this._isOcluddedByAWall(x, y1, z, y2, { x: -1, y: 0 }, dungeon)) {
      this.addLeftWall(x, y1, z, y2, uv);
    }

    // Right face
    if (!this._isOcluddedByAWall(x, y1, z, y2, { x: 1, y: 0 }, dungeon)) {
      this.addRightWall(x, y1, z, y2, uv);
    }
  }

  /**
   * If y1 it's in a different height than it's neighbors then
   * walls will appear connecting them
   * 
   * @param x 
   * @param z 
   * @param dungeon 
   */
  public addLowerWalls(x: number, z: number, dungeon: DungeonMap) {
    const height = dungeon.map.length;
    const width = dungeon.map[0].length;
    const tile = this._getTileAt(x, z, dungeon);
    const uv = tile.floor?.lowWallUV || tile.floor?.uv || tile.wall?.uv || [0,0,1,1];
    const y2 = tile.y1;

    // Back Face
    if (z > 0 && dungeon.map[z - 1][x] !== 0) { 
      const nTile = this._getTileAt(x, z - 1, dungeon);
      if ((!nTile.wall || nTile.wall.diagonal) && nTile.y1 < y2) {
        const y1 = nTile.y1;
        this.addBackWall(x, y1, z, y2, uv);
      }
    }

    // Front Face
    if (z < height - 1 && dungeon.map[z + 1][x] !== 0) { 
      const nTile = this._getTileAt(x, z + 1, dungeon);
      if ((!nTile.wall || nTile.wall.diagonal) && nTile.y1 < y2) {
        const y1 = nTile.y1;
        this.addFrontWall(x, y1, z, y2, uv);
      }
    }

    // Left Face
    if (x > 0 && dungeon.map[z][x - 1] !== 0) { 
      const nTile = this._getTileAt(x - 1, z, dungeon);
      if ((!nTile.wall || nTile.wall.diagonal) && nTile.y1 < y2) {
        const y1 = nTile.y1;
        this.addLeftWall(x, y1, z, y2, uv);
      }
    }

    // Right Face
    if (x < width - 1 && dungeon.map[z][x + 1] !== 0) { 
      const nTile = this._getTileAt(x + 1, z, dungeon);
      if ((!nTile.wall || nTile.wall.diagonal) && nTile.y1 < y2) {
        const y1 = nTile.y1;
        this.addRightWall(x, y1, z, y2, uv);
      }
    }
  } 

  /**
   * If y2 it's in a different height than it's neighbors then
   * walls will appear connecting them
   * 
   * @param x 
   * @param z 
   * @param dungeon 
   */
  public addTopWalls(x: number, z: number, dungeon: DungeonMap) {
    const height = dungeon.map.length;
    const width = dungeon.map[0].length;
    const tile = this._getTileAt(x, z, dungeon);
    const uv = tile.ceiling?.highWallUV || tile.ceiling?.uv || tile.wall?.uv || [0,0,1,1];
    const y2 = tile.y2;

    if (tile.wall) { return; }

    // Back Face
    if (z < height - 1 && dungeon.map[z + 1][x] !== 0) { 
      const nTile = this._getTileAt(x, z + 1, dungeon);
      if (nTile.y2 < y2) {
        const y1 = nTile.y2;
        this.addBackWall(x, y1, z + 1, y2, uv);
      }
    }

    // Front Face
    if (z > 0 && dungeon.map[z - 1][x] !== 0) { 
      const nTile = this._getTileAt(x, z - 1, dungeon);
      if (nTile.y2 < y2) {
        const y1 = nTile.y2;
        this.addFrontWall(x, y1, z - 1, y2, uv);
      }
    }

    // Left Face
    if (x < width - 1 && dungeon.map[z][x + 1] !== 0) { 
      const nTile = this._getTileAt(x + 1, z, dungeon);
      if (nTile.y2 < y2) {
        const y1 = nTile.y2;
        this.addLeftWall(x + 1, y1, z, y2, uv);
      }
    }

    // Right Face
    if (x > 0 && dungeon.map[z][x - 1] !== 0) { 
      const nTile = this._getTileAt(x - 1, z, dungeon);
      if (nTile.y2 < y2) {
        const y1 = nTile.y2;
        this.addRightWall(x - 1, y1, z, y2, uv);
      }
    }
  } 

  /**
   * Adds a diagonal wall looking at a specified direction with regular walls behind it
   * 
   * @param x 
   * @param z 
   * @param uv 
   * @param dungeon
   */
  public addDiagonalWall(x: number, z: number, uv: number[], dungeon: DungeonMap) {
    const tile = this._getTileAt(x, z, dungeon) as Tile;
    const {y1, y2} = tile;

    switch (tile.wall.diagonal) {
      case 'tl':
        if (!this._isOcluddedByAWall(x, y1, z, y2, { x: 0, y: -1 }, dungeon)) { this.addBackWall(x, y1, z, y2, uv); }
        if (!this._isOcluddedByAWall(x, y1, z, y2, { x: -1, y: 0 }, dungeon)) { this.addLeftWall(x, y1, z, y2, uv); }

        this
          .addVertice(x, y1, z + 1).addTexCoord(0, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y1, z).addTexCoord(1, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x, y2, z + 1).addTexCoord(0, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y2, z).addTexCoord(1, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);
        break;

      case 'tr':
        if (!this._isOcluddedByAWall(x, y1, z, y2, { x: 0, y: -1 }, dungeon)) { this.addBackWall(x, y1, z, y2, uv); }
        if (!this._isOcluddedByAWall(x, y1, z, y2, { x: 1, y: 0 }, dungeon)) { this.addRightWall(x, y1, z, y2, uv); }

        this
          .addVertice(x, y1, z).addTexCoord(0, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y1, z + 1).addTexCoord(1, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x, y2, z).addTexCoord(0, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y2, z + 1).addTexCoord(1, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);
        break;

      case 'bl':
        if (!this._isOcluddedByAWall(x, y1, z, y2, { x: 0, y: 1 }, dungeon)) { this.addFrontWall(x, y1, z, y2, uv); }
        if (!this._isOcluddedByAWall(x, y1, z, y2, { x: -1, y: 0 }, dungeon)) { this.addLeftWall(x, y1, z, y2, uv); }

        this
          .addVertice(x + 1, y1, z + 1).addTexCoord(0, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x, y1, z).addTexCoord(1, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y2, z + 1).addTexCoord(0, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x, y2, z).addTexCoord(1, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);
        break;

      case 'br':
        if (!this._isOcluddedByAWall(x, y1, z, y2, { x: 0, y: 1 }, dungeon)) { this.addFrontWall(x, y1, z, y2, uv); }
        if (!this._isOcluddedByAWall(x, y1, z, y2, { x: 1, y: 0 }, dungeon)) { this.addRightWall(x, y1, z, y2, uv); }

        this
          .addVertice(x + 1, y1, z).addTexCoord(0, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x, y1, z + 1).addTexCoord(1, y1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y2, z).addTexCoord(0, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x, y2, z + 1).addTexCoord(1, y2).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);
        break;
    }

    this._addQuad();
  }

  /**
   * Adds a slope with 0.5 units of elevation looking at a direction. This also
   * includes the portion of walls surrounding it
   * 
   * @param x 
   * @param z 
   * @param uv 
   * @param wallUV 
   */
  public addSlope(x: number, z: number, uv: number[], wallUV: number[], dungeon: DungeonMap) {
    const tile = this._getTileAt(x, z, dungeon) as Tile;
    const y = tile.y1;

    switch (tile.floor.slope) {
      case 'b':
        // Right Wall
        this
          .addVertice(x + 1, y, z + 1).addTexCoord(0, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x + 1, y, z).addTexCoord(1, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x + 1, y + 0.5, z + 1).addTexCoord(0, y+0.5).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3]);
        this._addTriangle();

        // Left Wall
        this
          .addVertice(x, y, z).addTexCoord(1, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x, y, z + 1).addTexCoord(0, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x, y + 0.5, z + 1).addTexCoord(0, y+0.5).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3]);
        this._addTriangle();

        // Front Wall
        if (!this._isOcluddedByAWall(x, y, z, y + 0.5, { x: 0, y: 1 }, dungeon)) {
          this.addFrontWall(x, y, z, y + 0.5, wallUV);
        }

        // Ramp
        this
          .addVertice(x, y + 0.5, z + 1).addTexCoord(0, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y + 0.5, z + 1).addTexCoord(1, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x, y, z).addTexCoord(0, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y, z).addTexCoord(1, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);
        break;

      case 't':
        // Right Wall
        this
          .addVertice(x + 1, y, z + 1).addTexCoord(0, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x + 1, y, z).addTexCoord(1, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x + 1, y + 0.5, z).addTexCoord(1, y+0.5).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3]);
        this._addTriangle();

        // Left Wall
        this
          .addVertice(x, y, z).addTexCoord(1, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x, y, z + 1).addTexCoord(0, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x, y + 0.5, z).addTexCoord(1, y+0.5).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3]);
        this._addTriangle();

        // Back Wall
        if (!this._isOcluddedByAWall(x, y, z, y + 0.5, { x: 0, y: -1 }, dungeon)) {
          this.addBackWall(x, y, z, y + 0.5, wallUV);
        }

        // Ramp
        this
          .addVertice(x, y, z + 1).addTexCoord(0, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y, z + 1).addTexCoord(1, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x, y + 0.5, z).addTexCoord(0, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y + 0.5, z).addTexCoord(1, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);
        break;

      case 'l':
        // Top Wall
        this
          .addVertice(x + 1, y, z).addTexCoord(0, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x, y, z).addTexCoord(1, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x, y + 0.5, z).addTexCoord(1, y+0.5).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3]);
        this._addTriangle();

        // Bottom Wall
        this
          .addVertice(x, y, z + 1).addTexCoord(0, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x + 1, y, z + 1).addTexCoord(1, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x, y + 0.5, z + 1).addTexCoord(0, y+0.5).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3]);
        this._addTriangle();

        // Left Wall
        if (!this._isOcluddedByAWall(x, y, z, y + 0.5, { x: -1, y: 0 }, dungeon)) {
          this.addLeftWall(x, y, z, y + 0.5, wallUV);
        }

        // Ramp
        this
          .addVertice(x, y + 0.5, z + 1).addTexCoord(0, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y, z + 1).addTexCoord(1, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x, y + 0.5, z).addTexCoord(0, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y, z).addTexCoord(1, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);
        break;

      case 'r':
        // Top Wall
        this
          .addVertice(x + 1, y, z).addTexCoord(0, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x, y, z).addTexCoord(1, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x + 1, y + 0.5, z).addTexCoord(0, y+0.5).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3]);
        this._addTriangle();

        // Bottom Wall
        this
          .addVertice(x, y, z + 1).addTexCoord(0, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x + 1, y, z + 1).addTexCoord(1, y).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3])
          .addVertice(x + 1, y + 0.5, z + 1).addTexCoord(1, y+0.5).addUVs(wallUV[0], 1-wallUV[1]-wallUV[3], wallUV[2], wallUV[3]);
        this._addTriangle();

        // Right Wall
        if (!this._isOcluddedByAWall(x, y, z, y + 0.5, { x: 1, y: 0 }, dungeon)) {
          this.addRightWall(x, y, z, y + 0.5, wallUV);
        }

        // Ramp
        this
          .addVertice(x, y, z + 1).addTexCoord(0, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y + 0.5, z + 1).addTexCoord(1, 1).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x, y, z).addTexCoord(0, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3])
          .addVertice(x + 1, y + 0.5, z).addTexCoord(1, 0).addUVs(uv[0], 1-uv[1]-uv[3], uv[2], uv[3]);
        break;
    }

    this._addQuad();
  }

  /**
   * Returns a tile at a given position, if the tile is outside the map
   * or the tileId is 0 then returns null
   * 
   * @param x 
   * @param z 
   * @param dungeon 
   * @returns Tile or null
   */
  private _getTileAt(x: number, z: number, dungeon: DungeonMap): Tile {
    const height = dungeon.map.length;
    const width = dungeon.map[0].length;

    if (x < 0 || z < 0 || x >= width || z >= height) { return null; }
    
    const tileId = dungeon.map[z][x];
    if (tileId === 0) { return null; }

    return dungeon.tiles[tileId - 1];
  }

  /**
   * Checks if a neighboring wall is obscuring the current tile
   * 
   * @param x 
   * @param y1 
   * @param z 
   * @param y2 
   * @param offset 
   * @param dungeon 
   * @returns boolean
   */
  private _isOcluddedByAWall(x: number, y1: number, z: number, y2: number, offset: Vector2, dungeon: DungeonMap) {
    const neighbor = this._getTileAt(x + offset.x, z + offset.y, dungeon);

    if (neighbor === null) { return true; }
    if (!neighbor.wall) {
      return (neighbor.y1 >= y2 || neighbor.y2 <= y1);
    }

    return !(neighbor.y1 >= y2 || neighbor.y2 <= y1);
  }

  /**
   * Registers the last three added vertices as a triangle
   */
  private _addTriangle() {
    const index = this._vertexIndex - 3;
    this.addTriangle(index, index + 1, index + 2);
  }

  /**
   * Registers the last four added vertices as two triangles
   */
  private _addQuad() {
    const index = this._vertexIndex - 4;
    this
      .addTriangle(index, index + 1, index + 2)
      .addTriangle(index + 1, index + 3, index + 2);
  }

  /**
   * Iterates through each tile and creates the geometry of 
   * each tile. If the tile is 0 then nothing is generated
   */
  public parseMap(dungeon: DungeonMap) {
    const height = dungeon.map.length;
    const width = dungeon.map[0].length;

    for (let z=0;z<height;z++) {
      for (let x=0;x<width;x++) {
        const tileId = dungeon.map[z][x] - 1;
        if (tileId === -1) { continue; }

        const tile = dungeon.tiles[tileId];
        if (tile.floor?.uv && !tile.floor.slope) {
          this.addFloor(x, tile.y1, z, tile.floor.uv);
        } else if (tile.floor?.uv && tile.floor.slope) {
          this.addSlope(x, z, tile.floor.uv, tile.floor.lowWallUV || tile.floor.uv, dungeon);
        }

        if (tile.ceiling?.uv) {
          this.addCeiling(x, tile.y2, z, tile.ceiling.uv);
        }

        if (tile.wall && !tile.wall.diagonal) {
          this.addWall(x, z, tile.wall.uv, dungeon);
        } else if (tile.wall && tile.wall.diagonal) {
          this.addDiagonalWall(x, z, tile.wall.uv, dungeon);
        }

        this.addLowerWalls(x, z, dungeon);
        this.addTopWalls(x, z, dungeon);
      }
    }
  }

  /**
   * The dungeon geometry uses vertices: position, texture
   * coordinates and uv_mapping
   */
  private get _vertexIndex() {
    return this.vertexLength / (VERTICE_SIZE + TEXCOORD_SIZE + UVS_SIZE);
  }
}
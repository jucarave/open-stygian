import { DungeonMap, Tile } from '../DungeonMap';
import { Cube } from '../math/Cube';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { SolidWall } from './SolidWall';

interface Wall {
  x: number;
  z: number;
  width: number;
  y1: number;
  y2: number;
  normal: Vector3
}

export class SolidMap {
  private _walls: SolidWall[];
  private _map: number[][][];

  constructor(dungeon: DungeonMap) {
    this._walls = [];
    this._initMap(dungeon.map);
    this._parseHorizontalWalls(dungeon);
    this._parseVerticalWalls(dungeon);
  }

  private _initMap(map: number[][]) {
    const height = map.length;
    const width = map[0].length;

    this._map = [];
    for (let z=0;z<height;z++) {
      this._map[z] = [];
      for (let x=0;x<width;x++) {
        this._map[z][x] = [];
      }
    }
  }

  /**
   * Returns a tile at a position if it's inside the boundaries of the map
   * and the tileId is not 0
   * 
   * @param x 
   * @param z 
   * @param dungeon 
   * @returns Tile
   */
  private _getTileAt(x: number, z: number, dungeon: DungeonMap): Tile {
    const height = dungeon.map.length;
    const width = dungeon.map[0].length;

    if (x < 0 || z < 0 || x >= width || z >= height || dungeon.map[z][x] === 0) {
      return null;
    }

    return dungeon.tiles[dungeon.map[z][x] - 1];
  }

  /**
   * Register a wall and marks it on all tiles of the map
   * 
   * @param wall 
   * @param offset 
   */
  private _registerWall(wall: Wall, offset: Vector2) {
    const solidWall = new SolidWall(wall.x, wall.y1, wall.z, wall.x + wall.width * offset.x, wall.y2, wall.z + wall.width * offset.y);
    solidWall.normal = wall.normal;

    const wallIndex = this._walls.length;
    this._walls.push(solidWall);

    for (let i=0;i<wall.width;i++) {
      this._map[wall.z + offset.y * i][wall.x + offset.x * i].push(wallIndex);
    }

    wall.width = -1;
  }

  /**
   * Checks if there is a current solid wall being build, if it is then
   * checks if the current tile has the same heights and if it is then
   * increases the width of the wall by one. Otherwise registeres the current
   * wall (if it exists) and starts a new wall
   * 
   * @param x 
   * @param z 
   * @param tile 
   * @param wallInfo 
   * @param neighborTile 
   * @param offset 
   */
  private _parseWall(x: number, z: number, tile: Tile, wallInfo: Wall, neighborTile: Tile, offset: Vector2) {
    if (neighborTile !== null && !neighborTile.wall) {
      if (wallInfo.width !== -1) {
        if (tile.y1 === wallInfo.y1 && tile.y2 === wallInfo.y2) {
          wallInfo.width += 1;
        } else  {
          this._registerWall(wallInfo, offset);
        }
      }
      
      if (wallInfo.width === -1) {
        wallInfo.width = 1;
        wallInfo.x = x;
        wallInfo.z = z;
        wallInfo.y1 = tile.y1;
        wallInfo.y2 = tile.y2;
      }
    } else if (wallInfo.width !== -1) {
      this._registerWall(wallInfo, offset);
    }
  }

  /**
   * Scans the map for horizontal solid walls and registers them with normals
   * on the +z and -z axis
   * 
   * @param dungeon 
   */
  private _parseHorizontalWalls(dungeon: DungeonMap) {
    const height = dungeon.map.length;
    const width = dungeon.map[0].length;

    const back: Wall = { x: 0, z: 0, width: -1, y1: 0, y2: 0, normal: Vector3.back };
    const front: Wall = { x: 0, z: 0, width: -1, y1: 0, y2: 0, normal: Vector3.forward };

    for (let z=0;z<height;z++) {
      for (let x=0;x<width;x++) {
        const tileId = dungeon.map[z][x];
        if (tileId === 0) { continue; }

        const tile = this._getTileAt(x, z, dungeon);
        if (tile.wall) {
          const backTile = this._getTileAt(x, z - 1, dungeon);
          this._parseWall(x, z, tile, back, backTile, {x: 1, y: 0});

          const frontTile = this._getTileAt(x, z + 1, dungeon);
          this._parseWall(x, z + 1, tile, front, frontTile, {x: 1, y: 0});
        } else {
          if (front.width !== -1) { this._registerWall(front, {x: 1, y: 0}); }
          if (back.width !== -1) { this._registerWall(back, {x: 1, y: 0}); }
        }
      }

      if (front.width !== -1) { this._registerWall(front, {x: 1, y: 0}); }
      if (back.width !== -1) { this._registerWall(back, {x: 1, y: 0}); }
    }
  }

  /**
   * Scans the map for vertical solid walls and registers them with normals
   * on the +z and -z axis
   * 
   * @param dungeon 
   */
  private _parseVerticalWalls(dungeon: DungeonMap) {
    const height = dungeon.map.length;
    const width = dungeon.map[0].length;

    const left: Wall = { x: 0, z: 0, width: -1, y1: 0, y2: 0, normal: Vector3.left };
    const right: Wall = { x: 0, z: 0, width: -1, y1: 0, y2: 0, normal: Vector3.right };

    for (let x=0;x<width;x++) {
      for (let z=0;z<height;z++) {
        const tileId = dungeon.map[z][x];
        if (tileId === 0) { continue; }

        const tile = this._getTileAt(x, z, dungeon);
        if (tile.wall) {
          const leftTile = this._getTileAt(x - 1, z, dungeon);
          this._parseWall(x, z, tile, left, leftTile, {x: 0, y: 1});

          const rightTile = this._getTileAt(x + 1, z, dungeon);
          this._parseWall(x + 1, z, tile, right, rightTile, {x: 0, y: 1});
        } else {
          if (left.width !== -1) { this._registerWall(left, {x: 0, y: 1}); }
          if (right.width !== -1) { this._registerWall(right, {x: 0, y: 1}); }
        }
      }

      if (left.width !== -1) { this._registerWall(left, {x: 0, y: 1}); }
      if (right.width !== -1) { this._registerWall(right, {x: 0, y: 1}); }
    }
  }

  /**
   * Returns all the walls that are withing a cube
   * 
   * @param cube 
   * @returns 
   */
  public getOverlappingWalls(cube: Cube) {
    const x1 = Math.floor(cube.x1);
    const z1 = Math.floor(cube.z1);
    const x2 = Math.floor(cube.x2);
    const z2 = Math.floor(cube.z2);
    const walls: SolidWall[] = [];

    for (let z=z1;z<=z2;z++) {
      for (let x=x1;x<=x2;x++) {
        if (this._map[z][x] !== null) {
          this._map[z][x].forEach((wallIndex: number) => {
            if (walls.indexOf(this._walls[wallIndex]) === -1) {
              walls.push(this._walls[wallIndex]);
            }
          })
        }
      }
    }

    return walls;
  }
}
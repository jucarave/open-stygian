import { DungeonMap, Tile } from '../DungeonMap';
import { Cube } from '../math/Cube';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { SolidWall } from './SolidWall';

interface Wall {
  grid: Vector2;
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
    this._parseDiagonalWalls(dungeon);
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
      this._map[wall.grid.y + offset.y * i][wall.grid.x + offset.x * i].push(wallIndex);
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
   * @param gridPosition
   * @param tile 
   * @param wallInfo 
   * @param neighborTile 
   * @param offset 
   */
  private _parseWall(x: number, z: number, gridPosition: Vector2, tile: Tile, wallInfo: Wall, neighborTile: Tile, offset: Vector2) {
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
        wallInfo.grid = gridPosition;
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

    const back: Wall = { x: 0, z: 0, width: -1, y1: 0, y2: 0, normal: Vector3.back, grid: {x: 0, y: 0} };
    const front: Wall = { x: 0, z: 0, width: -1, y1: 0, y2: 0, normal: Vector3.forward, grid: {x: 0, y: 0} };

    for (let z=0;z<height;z++) {
      for (let x=0;x<width;x++) {
        const tileId = dungeon.map[z][x];
        if (tileId === 0) { continue; }
        
        const tile = this._getTileAt(x, z, dungeon);
        
        if (tile.wall) {
          const gridPosition = { x: x, y: z };
          let addedWalls = 0;

          if (!tile.wall.diagonal || tile.wall.diagonal === 'tl' || tile.wall.diagonal === 'tr') {
            const backTile = this._getTileAt(x, z - 1, dungeon);
            this._parseWall(x, z, gridPosition, tile, back, backTile, {x: 1, y: 0});
            addedWalls++;
          }

          if (!tile.wall.diagonal || tile.wall.diagonal === 'bl' || tile.wall.diagonal === 'br') {
            const frontTile = this._getTileAt(x, z + 1, dungeon);
            this._parseWall(x, z + 1, gridPosition, tile, front, frontTile, {x: 1, y: 0});
            addedWalls++;
          }

          if (!addedWalls) {
            if (front.width !== -1) { this._registerWall(front, {x: 1, y: 0}); }
            if (back.width !== -1) { this._registerWall(back, {x: 1, y: 0}); }
          }
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

    const left: Wall = { x: 0, z: 0, width: -1, y1: 0, y2: 0, normal: Vector3.left, grid: {x: 0, y: 0} };
    const right: Wall = { x: 0, z: 0, width: -1, y1: 0, y2: 0, normal: Vector3.right, grid: {x: 0, y: 0} };

    for (let x=0;x<width;x++) {
      for (let z=0;z<height;z++) {
        const tileId = dungeon.map[z][x];
        if (tileId === 0) { continue; }

        const tile = this._getTileAt(x, z, dungeon);
        if (tile.wall) {
          const gridPosition = { x: x, y: z };
          let addedWalls = 0;

          if (!tile.wall.diagonal || tile.wall.diagonal === 'tl' || tile.wall.diagonal === 'bl') {
            const leftTile = this._getTileAt(x - 1, z, dungeon);
            this._parseWall(x, z, gridPosition, tile, left, leftTile, {x: 0, y: 1});
            addedWalls++;
          }

          if (!tile.wall.diagonal || tile.wall.diagonal === 'tr' || tile.wall.diagonal === 'br') {
            const rightTile = this._getTileAt(x + 1, z, dungeon);
            this._parseWall(x + 1, z, gridPosition, tile, right, rightTile, {x: 0, y: 1});
            addedWalls++;
          }

          if (!addedWalls) {
            if (left.width !== -1) { this._registerWall(left, {x: 0, y: 1}); }
            if (right.width !== -1) { this._registerWall(right, {x: 0, y: 1}); }
          }
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
   * Parses a diagonal wall searching for adjacent diagonal walls
   * of the same type
   * 
   * @param wall 
   * @param tile 
   * @param dungeon 
   * @param diagonal 
   * @param direction 
   */
  private _parseDiagonalWall(wall: Wall, tile: Tile, dungeon: DungeonMap, diagonal: 'tl' | 'tr' | 'bl' | 'br', direction: Vector2) {
    wall.width = 1;
    wall.y1 = tile.y1;
    wall.y2 = tile.y2;

    let i = 2;
    let nextTile = this._getTileAt(wall.grid.x + direction.x, wall.grid.y + direction.y, dungeon);
    while (nextTile != null && nextTile.wall && nextTile.wall.diagonal === diagonal) {
      wall.width += 1;
      nextTile = this._getTileAt(wall.grid.x + direction.x * i, wall.grid.y + direction.y * i, dungeon);
      i++;
    }

    this._registerWall(wall, direction);
  }

  /**
   * Scans the map for diagonal solid walls and registers them with normals
   * on the +x+z, -x+z, +x-z and -x-z axis
   * 
   * @param dungeon 
   */
  private _parseDiagonalWalls(dungeon: DungeonMap) {
    const height = dungeon.map.length;
    const width = dungeon.map[0].length;

    const front: Wall = { x: 0, z: 0, width: -1, y1: 0, y2: 0, normal: Vector3.zero, grid: {x: 0, y: 0} };

    for (let z=0;z<height;z++) {
      for (let x=0;x<width;x++) {
        const tileId = dungeon.map[z][x];
        if (tileId === 0) { continue; }

        const tile = this._getTileAt(x, z, dungeon);
        let prevTile = this._getTileAt(x + 1, z - 1, dungeon);
        if (tile.wall && tile.wall.diagonal === 'tl' && (!prevTile || prevTile.wall?.diagonal !== 'tl')) {
          front.x = x + 1;
          front.z = z;
          front.grid = { x: x, y: z };
          front.normal = (new Vector3(1,0,1)).normalize();

          this._parseDiagonalWall(front, tile, dungeon, 'tl', {x: -1, y: 1})
        }

        if (tile.wall && tile.wall.diagonal === 'br' && (!prevTile || prevTile.wall?.diagonal !== 'br')) {
          front.x = x + 1;
          front.z = z;
          front.grid = { x: x, y: z };
          front.normal = (new Vector3(-1,0,-1)).normalize();

          this._parseDiagonalWall(front, tile, dungeon, 'br', {x: -1, y: 1})
        }

        prevTile = this._getTileAt(x - 1, z - 1, dungeon);
        if (tile.wall && tile.wall.diagonal === 'tr' && (!prevTile || prevTile.wall?.diagonal !== 'tr')) {
          front.x = x;
          front.z = z;
          front.grid = { x: x, y: z };
          front.normal = (new Vector3(-1,0,1)).normalize();

          this._parseDiagonalWall(front, tile, dungeon, 'tr', {x: 1, y: 1})
        }

        if (tile.wall && tile.wall.diagonal === 'bl' && (!prevTile || prevTile.wall?.diagonal !== 'bl')) {
          front.x = x;
          front.z = z;
          front.grid = { x: x, y: z };
          front.normal = (new Vector3(1,0,-1)).normalize();

          this._parseDiagonalWall(front, tile, dungeon, 'bl', {x: 1, y: 1})
        }
      }
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
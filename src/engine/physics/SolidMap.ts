import { DungeonMap, Wall } from '../DungeonMap';
import { Cube } from '../math/Cube';
import { Vector2 } from '../math/Vector2';
import { SolidWall } from './SolidWall';

// In how many sections is the map going to be partitioned
const PARTITION_SIZE = 4;

export class SolidMap {
  private _walls: SolidWall[];
  private _solidMap: number[][][];
  private _boundingBox: Cube;
  private _size: Vector2;

  constructor(dungeon: DungeonMap) {
    this._walls = [];
    this._boundingBox = { x1: 0, x2: 0, y1: 0, y2: 0, z1: 0, z2: 0 };

    this._parseWalls(dungeon);
    this._initSolidMap();
  }

  /**
   * Updates the map bounding box, needs to be called every time a
   * solid wall is added
   * 
   * @param x1 
   * @param y1 
   * @param z1 
   * @param x2 
   * @param y2 
   * @param z2 
   */
  private _updateBoundingBox(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
    this._boundingBox.x1 = Math.min(x1, x2, this._boundingBox.x1);
    this._boundingBox.y1 = Math.min(y1, y2, this._boundingBox.y1);
    this._boundingBox.z1 = Math.min(z1, z2, this._boundingBox.z1);
    this._boundingBox.x2 = Math.max(x1, x2, this._boundingBox.x2);
    this._boundingBox.y2 = Math.max(y1, y2, this._boundingBox.y2);
    this._boundingBox.z2 = Math.max(z1, z2, this._boundingBox.z2);
  }

  /**
   * Parses the solid walls of a dungeon and updates the bounding
   * box of the level
   * 
   * @param dungeon 
   */
  private _parseWalls(dungeon: DungeonMap) {
    dungeon.solidWalls.forEach((wall: Wall) => {
      const x1 = wall.x1;
      const y1 = wall.y1;
      const z1 = wall.z1;
      const x2 = wall.x2;
      const y2 = wall.y1 + wall.h1;
      const z2 = wall.z2;

      this._updateBoundingBox(x1, y1, z1, x2, y2, z2);

      const w = new SolidWall(x1, y1, z1, x2, y2, z2);
      w.calculateNormal();

      this._walls.push(w);
    });
  }

  /**
   * Iterates through each solid wall and adds them to a 
   * grid for easier access when doing collisions
   */
  private _initSolidMap() {
    this._size = {
      x: Math.ceil((this._boundingBox.x2 - this._boundingBox.x1) / PARTITION_SIZE),
      y: Math.ceil((this._boundingBox.z2 - this._boundingBox.z1) / PARTITION_SIZE)
    };

    this._solidMap = [];
    for (let y=0;y<=PARTITION_SIZE;y++) {
      this._solidMap[y] = [];
      for (let x=0;x<=PARTITION_SIZE;x++) {
        this._solidMap[y][x] = [];
      }
    }

    for (let i=0;i<this._walls.length;i++) {
      const wall = this._walls[i];
      const x1 = Math.floor((wall.x1 - this._boundingBox.x1) / this._size.x);
      const x2 = Math.floor((wall.x2 - this._boundingBox.x1) / this._size.x);
      const z1 = Math.floor((wall.z1 - this._boundingBox.z1) / this._size.y);
      const z2 = Math.floor((wall.z2 - this._boundingBox.z1) / this._size.y);

      for (let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++) {
        for (let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++) {
          if (this._solidMap[z][x].indexOf(i) === -1) {
            this._solidMap[z][x].push(i);
          }
        }
      }
    }
  }

  /**
   * Checks all the walls that could intersect with a cube.
   * The wall might be quite far depending on the size of the
   * partitioned world
   * 
   * @param cube 
   * @returns 
   */
  public getOverlappingWalls(cube: Cube) {
    const x1 = Math.floor((cube.x1 - this._boundingBox.x1) / this._size.x);
    const x2 = Math.floor((cube.x2 - this._boundingBox.x1) / this._size.x);
    const z1 = Math.floor((cube.z1 - this._boundingBox.z1) / this._size.y);
    const z2 = Math.floor((cube.z2 - this._boundingBox.z1) / this._size.y);

    const walls: SolidWall[] = [];

    for (let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++) {
      for (let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++) {
        if (this._solidMap[z] && this._solidMap[z][x]) this._solidMap[z][x].forEach((wallIndex: number) => {
          if (walls.indexOf(this._walls[wallIndex]) === -1) {
            walls.push(this._walls[wallIndex]);
          }
        });
      }
    }

    return walls;
  }
}
import { DungeonMap, Floor, Wall } from '../DungeonMap';
import { Cube } from '../math/Cube';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Config } from '../system/Config';
import { SolidFloor } from './SolidFloor';
import { SolidWall } from './SolidWall';

// In how many sections is the map going to be partitioned
const PARTITION_SIZE = 4;

interface SolidGeometry {
  walls: number[];
  floors: number[];
}

export class SolidMap {
  private _walls: SolidWall[];
  private _floors: SolidFloor[];
  private _solidMap: SolidGeometry[][];
  private _boundingBox: Cube;
  private _size: Vector2;

  constructor(dungeon: DungeonMap) {
    this._walls = [];
    this._floors = [];
    this._boundingBox = { x1: 0, x2: 0, y1: 0, y2: 0, z1: 0, z2: 0 };

    this._parseWalls(dungeon);
    this._parseFloors(dungeon);
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
      const h1 = wall.h1;
      const z1 = wall.z1;
      const x2 = wall.x2;
      const y2 = wall.y2;
      const h2 = wall.h2;
      const z2 = wall.z2;

      this._updateBoundingBox(x1, Math.min(y1, y2), z1, x2, Math.max(y1+h1, y2+h2), z2);

      const w = new SolidWall(x1, y1, h1, z1, x2, y2, h2, z2);
      w.calculateNormal();

      this._walls.push(w);
    });
  }

  /**
   * Parses the solid floors of a dungeon
   * 
   * @param dungeon 
   */
  private _parseFloors(dungeon: DungeonMap) {
    dungeon.solidFloors.forEach((solidFloor: Floor) => {
      const f = new SolidFloor(solidFloor.tl, solidFloor.tr, solidFloor.bl, solidFloor.br);
      const bb = f.boundingBox;
      this._updateBoundingBox(bb.x1, bb.y1, bb.z1, bb.x2, bb.y2, bb.z2);
      this._floors.push(f);
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
        this._solidMap[y][x] = {
          floors: [],
          walls: []
        };
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
          if (this._solidMap[z][x].walls.indexOf(i) === -1) {
            this._solidMap[z][x].walls.push(i);
          }
        }
      }
    }

    for (let i=0;i<this._floors.length;i++) {
      const bb = this._floors[i].boundingBox;
      const x1 = Math.floor((bb.x1 - this._boundingBox.x1) / this._size.x);
      const x2 = Math.floor((bb.x2 - this._boundingBox.x1) / this._size.x);
      const z1 = Math.floor((bb.z1 - this._boundingBox.z1) / this._size.y);
      const z2 = Math.floor((bb.z2 - this._boundingBox.z1) / this._size.y);

      for (let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++) {
        for (let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++) {
          if (this._solidMap[z][x].floors.indexOf(i) === -1) {
            this._solidMap[z][x].floors.push(i);
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
        if (this._solidMap[z] && this._solidMap[z][x]) this._solidMap[z][x].walls.forEach((wallIndex: number) => {
          const wall = this._walls[wallIndex];
          if (walls.indexOf(wall) === -1) {
            if (wall.collidesWithCube(cube)) { 
              walls.push(wall);
            }
          }
        });
      }
    }

    return walls;
  }

  /**
   * Returns all the floors that might collide with a circle
   * centered at a position
   * 
   * @param position center of the circle
   * @param radius 
   * @returns 
   */
  public getOverlappingFloors(position: Vector3, radius: number) {
    const x1 = Math.floor((position.x - radius - this._boundingBox.x1) / this._size.x);
    const x2 = Math.floor((position.x + radius - this._boundingBox.x1) / this._size.x);
    const z1 = Math.floor((position.z - radius - this._boundingBox.z1) / this._size.y);
    const z2 = Math.floor((position.z + radius - this._boundingBox.z1) / this._size.y);

    const floors: SolidFloor[] = [];

    for (let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++) {
      for (let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++) {
        if (this._solidMap[z] && this._solidMap[z][x]) this._solidMap[z][x].floors.forEach((wallIndex: number) => {
          const floor = this._floors[wallIndex];
          if (floors.indexOf(floor) === -1) {
            floors.push(floor);
          }
        });
      }
    }

    return floors;
  }

  /**
   * Returns the highest floor at a circled area
   * 
   * @param position center of the circle
   * @param radius 
   * @returns Maximum y or -10
   */
  public getFloorHeight(position: Vector3, radius: number) {
    const floors = this.getOverlappingFloors(position, radius);
    let y = -10;
    floors.forEach((floor: SolidFloor) => {
      const floorY = Math.max(y, floor.getYAtPoint(position, radius));

      if (floorY <= position.y + Config.slopeHeight) {
        y = Math.max(floorY, y);
      }
    });

    return y;
  }
}
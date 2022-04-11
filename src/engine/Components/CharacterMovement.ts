import { Cube } from '../math/Cube';
import { Line } from '../math/Line';
import { Vector2, vector2DDot, vector2DLength, vector2DNormalize } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { SceneDungeon } from '../scenes/SceneDungeon';
import { Component } from './Component';

const VERY_CLOSE_DISTANCE = 0.01;

export class CharacterMovement extends Component {
  private _movementBBox: Cube;
  private _movementLine: Line;
  private _scene: SceneDungeon;

  public radius: number;

  public readonly type = 'CharacterMovement';
  
  constructor(radius = 0.3) {
    super();

    this.radius = radius;
    this._movementBBox = { x1: 0, x2: 0, y1: 0, y2: 0, z1: 0, z2: 0 };
    this._movementLine = { x1: 0, x2: 0, y1: 0, y2: 0 };
  }

  /**
   * Updates a bounding box taking the current character's position
   * and the next position
   * 
   * @param movement
   */
  private _updateMovementBBox(movement: Vector2) {
    const p = this._entity.position;
    const r = this.radius;

    this._movementBBox.x1 = Math.min(p.x - r, p.x - r + movement.x);
    this._movementBBox.y1 = p.y;
    this._movementBBox.z1 = Math.min(p.z - r, p.z - r + movement.y);
    this._movementBBox.x2 = Math.max(p.x + r, p.x + r + movement.x);
    this._movementBBox.y2 = p.y + 0.6;
    this._movementBBox.z2 = Math.max(p.z + r, p.z + r + movement.y);
  }

  /**
   * Updates the movement line from the point that the character would
   * collide to the wall towards the character's movement
   * 
   * @param movement
   * @param wallNormal 
   */
  private _updateMovementLine(movement: Vector2, wallNormal: Vector3) {
    const p = this._entity.position;

    this._movementLine.x1 = p.x - wallNormal.x * this.radius;
    this._movementLine.y1 = p.z - wallNormal.z * this.radius;
    this._movementLine.x2 = this._movementLine.x1 + movement.x;
    this._movementLine.y2 = this._movementLine.y1 + movement.y;
  }

  /**
   * Moves a character Checking for collision against the walls of the dungeon, this is called
   * recursively until iteration > 2 or until the character moves without collision
   * 
   * @param xTo 
   * @param zTo 
   * @param iteration 
   * @returns 
   */
  public moveTo(xTo: number, zTo: number, iteration: number) {
    if (iteration > 2) {
      return;
    }

    const p = this._entity.position;
    const position2D = {x: p.x, y: p.z};
    const movement = {x: xTo, y: zTo};
    const movementNormalized = vector2DNormalize({x: xTo, y: zTo});
    const inverseDirection = {x: -movementNormalized.x, y: -movementNormalized.y}
    const movementLength = vector2DLength(movement);

    this._updateMovementBBox(movement);
    const walls = this._scene.getDungeon().getOverlappingWalls(this._movementBBox);
    const wallsCount = walls.length;

    let collisionTime = 1.0;
    let collisionPoint: Vector2 = null;

    // Collision routine against each wall
    for (let i=0;i<wallsCount;i++) {
      const wall = walls[i];

      // If the wall's normal is not facing the character then we can skip the check
      if (!wall.isFacingMovement(movementNormalized)) {
        continue;
      }

      this._updateMovementLine(movement, wall.normal);

      const intersectionPoint = wall.getLinesIntersectionPoint(this._movementLine);
      if (intersectionPoint === null) {
        continue;
      }

      if (wall.isPointInWall(intersectionPoint)) {
        // It collides with the wall itself
        const dx = intersectionPoint.x - this._movementLine.x1;
        const dy = intersectionPoint.y - this._movementLine.y1;
        const time = Math.max(vector2DLength({x: dx, y: dy}) / movementLength - VERY_CLOSE_DISTANCE, 0.0);

        if (time < collisionTime) {
          collisionTime = time;
          collisionPoint = intersectionPoint;
        }
      } else {
        // Does collides with a vertex?
        const vt = [wall.x1, wall.z1, wall.x2, wall.z2];
        for (let i = 0; i < 4; i += 2) {
          const r = this.radius;
          const distance = wall.getDistanceToVertex({x: vt[0 + i], y: vt[1 + i]}, inverseDirection, position2D, r);

          if (distance > 0.0) {
            const time = Math.max(distance / movementLength - VERY_CLOSE_DISTANCE, 0.0);

            if (time < collisionTime) {
              collisionTime = time;
              collisionPoint = { x: vt[0 + i], y: vt[1 + i] };
              i = 4;
            }
          }
        }
      }
    }

    // Collision response
    if (collisionPoint !== null) {
      const remainingEnergy = 1.0 - collisionTime;
      if (remainingEnergy < 0.1) {
        this._entity.position.set(p.x + xTo * collisionTime, p.y, p.z + zTo * collisionTime);
        return;
      }

      const slideNormal = vector2DNormalize({x: p.x - collisionPoint.x, y: p.z - collisionPoint.y});
      const velDotN = -vector2DDot({x: slideNormal.x, y: slideNormal.y}, {x: xTo, y: zTo});
      const slideVelX = slideNormal.x * velDotN;
      const slideVelZ = slideNormal.y * velDotN;

      const newXTo = (xTo + slideVelX) * remainingEnergy;
      const newZTo = (zTo + slideVelZ) * remainingEnergy;

      this._entity.position.set(p.x + xTo * collisionTime, p.y, p.z + zTo * collisionTime);
      this.moveTo(newXTo, newZTo, iteration + 1);
    } else {
      this._entity.position.set(p.x + xTo, p.y, p.z + zTo);
    }
  }

  public init(): void {
    this._scene = this._entity.scene as SceneDungeon;
  }

  public update(): void { }

  public destroy(): void { }
}
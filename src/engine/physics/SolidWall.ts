import { Line } from '../math/Line';
import { Vector2, vector2DDot, vector2DLength } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

export class SolidWall {
  public x1: number;
  public y1: number;
  public z1: number;
  public x2: number;
  public y2: number;
  public z2: number;
  public normal: Vector3;

  constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
  }

  /**
   * Automatically calculates the normal of the wall
   */
  public calculateNormal() {
    const va = (new Vector3(this.x2-this.x1, 0, this.z2-this.z1)).normalize();
    const vb = (new Vector3(0, this.y2-this.y1, 0)).normalize();
    this.normal = (Vector3.cross(va, vb)).normalize();
  }

  /**
   * Checks if a movement vector is facing this wall
   * 
   * @param vector 
   * @returns 
   */
  public isFacingMovement(vector: Vector2) {
    return this.normal.x * vector.x + this.normal.z * vector.y < 0;
  }

  /**
   * Returns the intersection point between a line and this
   * wall (line), this point might be outside of the boundaries
   * of the wall
   * 
   * @param line 
   * @returns 
   */
  public getLinesIntersectionPoint(line: Line): Vector2 {
    const l1x1 = line.x1;
    const l1y1 = line.y1;
    const l1x2 = line.x2;
    const l1y2 = line.y2;

    const l2x1 = this.x1;
    const l2y1 = this.z1;
    const l2x2 = this.x2;
    const l2y2 = this.z2;

    const a1 = l1y2 - l1y1;
    const b1 = l1x1 - l1x2;
    const c1 = a1 * l1x1 + b1 * l1y1;

    const a2 = l2y2 - l2y1;
    const b2 = l2x1 - l2x2;
    const c2 = a2 * l2x1 + b2 * l2y1;

    const determinant = a1 * b2 - a2 * b1;

    if (determinant == 0.0) {
      return null;
    }

    const x = (b2 * c1 - b1 * c2) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;

    return { x, y };
  }

  /**
   * Checks if a point is inside the boundaries of the wall
   * 
   * @param point 
   * @returns 
   */
  public isPointInWall(point: Vector2): boolean {
    return !((point.x < this.x1 && point.x < this.x2) || (point.x > this.x1 && point.x > this.x2) || (point.y < this.z1 && point.y < this.z2) || (point.y > this.z1 && point.y > this.z2));
  }


  /**
   * Returns the distance between a character and a vertex of the wall
   * 
   * @param vertex 
   * @param inverseDirection 
   * @param point 
   * @param r 
   * @returns 
   */
  public getDistanceToVertex(vertex: Vector2, inverseDirection: Vector2, point: Vector2, r: number) {
    const vecToCircle = {
      x: point.x - vertex.x,
      y: point.y - vertex.y
    }

    const vecToCircleLength = vector2DLength(vecToCircle);
    const vtcDotrd = vector2DDot(vecToCircle, inverseDirection);

    const d = r * r - (vecToCircleLength * vecToCircleLength - vtcDotrd * vtcDotrd);

    if (d < 0.0) {
      return null;
    }

    return vtcDotrd - Math.sqrt(d);
  }
}
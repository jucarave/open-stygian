import { Cube } from '../math/Cube';
import { Line } from '../math/Line';
import { Vector2, vector2DDot } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

const MIN_FLOOR = -1000;
type FLOOR_TYPE = 'SQUARED_PLANE' | 'POLYGON';

interface FloorVertices {
  tl: Vector3,
  tr: Vector3,
  bl: Vector3,
  br: Vector3,
}

export class SolidPlane {
  private _type: FLOOR_TYPE;
  private _vertices: FloorVertices;
  private _tri1: Line[];
  private _tri2: Line[];
  private _boundingBox: Cube;

  constructor(tl: Vector3, tr: Vector3, bl: Vector3, br: Vector3) {
    this._vertices = { tl,tr,bl,br };

    this._detectFloorType();
    this._calculateBoundingBox();
    
    this._tri1 = [
      this._getLineBetweenVertices(tl, bl),
      this._getLineBetweenVertices(tl, br),
      this._getLineBetweenVertices(bl, br)
    ];

    this._tri2 = [
      this._getLineBetweenVertices(tl, br),
      this._getLineBetweenVertices(tl, tr),
      this._getLineBetweenVertices(tr, br)
    ];
  }

  private _calculateBoundingBox() {
    const v = this._vertices;
    this._boundingBox = {
      x1: Math.min(v.tl.x, v.tr.x, v.bl.x, v.br.x),
      y1: Math.min(v.tl.y, v.tr.y, v.bl.y, v.br.y),
      z1: Math.min(v.tl.z, v.tr.z, v.bl.z, v.br.z),
      x2: Math.max(v.tl.x, v.tr.x, v.bl.x, v.br.x),
      y2: Math.max(v.tl.y, v.tr.y, v.bl.y, v.br.y),
      z2: Math.max(v.tl.z, v.tr.z, v.bl.z, v.br.z),
    };
  }

  /**
   * Detects if the floors is an axis aligned squared 
   * plane or a polygon
   */
  private _detectFloorType() {
    let type = '';
    if (this._vertices.tl.x === this._vertices.bl.x && 
        this._vertices.tl.z === this._vertices.tr.z && 
        this._vertices.bl.z === this._vertices.br.z && 
        this._vertices.tr.x === this._vertices.br.x &&
        this._vertices.tl.y === this._vertices.bl.y && 
        this._vertices.bl.y === this._vertices.br.y && 
        this._vertices.br.y === this._vertices.tr.y) {
      type += 'SQUARED_PLANE';
    } else {
      type += 'POLYGON';
    }

    this._type = type as FLOOR_TYPE;
  }

  /**
   * Creates a line between two vertices
   * 
   * @param v1 
   * @param v2 
   * @returns 
   */
  private _getLineBetweenVertices(v1: Vector3, v2: Vector3) {
    return { x1: v1.x, y1: v1.z, x2: v2.x, y2: v2.z };
  }

  /**
   * Checks if a point is to the right of a 2D line
   * 
   * @param line 
   * @param point 
   * @returns 
   */
  private _isPointRightToLine(line: Line, point: Vector3) {
    if ((point.z < line.y1 && point.z < line.y2) || (point.z >= line.y1 && point.z >= line.y2)) { return false; }
    if (point.x < line.x1 && point.x < line.x2) { return false; }
    if (point.x >= line.x1 && point.x >= line.x2) { return true; }

    const fx = (point.x - line.x1) / (line.x2 - line.x1);
    const py = (line.y2 - line.y1) * fx + line.y1;

    if (line.y2 > line.y1)  {
      return py >= point.z;
    } else {
      return py < point.z;
    }
  }

  /**
   * Raycasts a point to detect if it's inside a triangle
   * 
   * @param triangle 
   * @param point 
   * @returns 
   */
  private _isPointInTriangle(triangle: Line[], point: Vector3) {
    let count = 0;

    triangle.forEach((line: Line) => {
      if (this._isPointRightToLine(line, point)) {
        count += 1;
      }
    });

    return count % 2 === 1;
  }

  /**
   * Checks if a circle centered a a point collides with the edge formed
   * between two vertices
   * 
   * @param v1 
   * @param v2 
   * @param point 
   * @param radius 
   * @returns 
   */
  private _doesCollidesWithEdge(v1: Vector3, v2: Vector3, point: Vector3, radius: number) {
    const edge = { x: v2.x-v1.x, y:v2.z-v1.z };
    const sqrDistance = vector2DDot(edge, edge);
    const dot = vector2DDot(edge, { x: point.x-v1.x, y: point.z-v1.z }) / sqrDistance;

    if (dot < 0 || dot > 1) { return MIN_FLOOR; }

    const x = point.x - (edge.x * dot + v1.x);
    const y = point.z - (edge.y * dot + v1.z);

    if (Math.sqrt(x*x + y*y) <= radius) {
      return (v2.y - v1.y) * dot + v1.y;
    }

    return MIN_FLOOR;
  }

  /**
   * Returns the Y position of a point inside a triangle
   * 
   * @param v1 
   * @param v2 
   * @param toPosition 
   * @returns 
   */
  private _getTriangleYAtPoint(v1: Vector3, v2: Vector3, toPosition: Vector2) {
    const edge = { x: v2.x - v1.x, y: v2.z - v1.z };
    const sqrDistance = vector2DDot(edge, edge);
    const dot = vector2DDot(edge, toPosition) / sqrDistance;

    return dot * (v2.y - v1.y);
  }

  /**
   * Checks if a position is inside the floor triangles and returns the height
   * based on it's position. Otherwise checks if the position is colliding with 
   * one of the edges of the floor using the radius. Otherswise return the minimum 
   * height of a floor
   * 
   * @param position 
   * @param radius 
   * @returns 
   */
  private _getPolygonYAtPoint(position: Vector3, radius: number) {
    const tlToP = { x: position.x - this._vertices.tl.x, y: position.z - this._vertices.tl.z };

    // Is the point inside one of the triangles
    if (this._isPointInTriangle(this._tri1, position)) {
      const fy1 = this._getTriangleYAtPoint(this._vertices.tl, this._vertices.bl, tlToP);
      const fy2 = this._getTriangleYAtPoint(this._vertices.bl, this._vertices.br, tlToP);

      return this._vertices.tl.y + fy1 + fy2;
    }

    if (this._isPointInTriangle(this._tri2, position)) {
      const fy1 = this._getTriangleYAtPoint(this._vertices.tl, this._vertices.tr, tlToP);
      const fy2 = this._getTriangleYAtPoint(this._vertices.tr, this._vertices.br, tlToP);

      return this._vertices.tl.y + fy1 + fy2;
    }

    // Or does the point collides with one of the edges
    const topEdge = this._doesCollidesWithEdge(this._vertices.tl, this._vertices.tr, position, radius);
    if (topEdge !== MIN_FLOOR) { return topEdge; }

    const bottomEdge = this._doesCollidesWithEdge(this._vertices.bl, this._vertices.br, position, radius);
    if (bottomEdge !== MIN_FLOOR) { return bottomEdge; }

    const leftEdge = this._doesCollidesWithEdge(this._vertices.tl, this._vertices.bl, position, radius);
    if (leftEdge !== MIN_FLOOR) { return leftEdge; }

    const rightEdge = this._doesCollidesWithEdge(this._vertices.tr, this._vertices.br, position, radius);
    if (rightEdge !== MIN_FLOOR) { return rightEdge; }

    return MIN_FLOOR;
  }

  /**
   * Checks if the bounding box of the point is within the bounding
   * box (without the Y coordinate) and if so then return a Y
   * coordinate from one the vertices of the plane
   * 
   * @param position 
   * @param radius 
   * @returns 
   */
  private _getSquaredPlaneYAtPoint(position: Vector3, radius: number) {
    if (position.x + radius < this._boundingBox.x1 ||
        position.z + radius < this._boundingBox.z1 ||
        position.x - radius >= this._boundingBox.x2 || 
        position.z - radius >= this._boundingBox.z2) {
          return MIN_FLOOR;
    }

    return this._vertices.tl.y;
  }
  
  public getYAtPoint(position: Vector3, radius: number) {
    switch (this._type) {
      case 'SQUARED_PLANE':
        return this._getSquaredPlaneYAtPoint(position, radius);

      case 'POLYGON':
        return this._getPolygonYAtPoint(position, radius);
    }
  }

  public get boundingBox() {
    return this._boundingBox;
  }
}
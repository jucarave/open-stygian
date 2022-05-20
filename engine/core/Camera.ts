import { Entity } from '../entities/Entity';
import { degToRad, radToDeg } from '../math/Math';
import { Matrix4 } from '../math/Matrix4';
import { Quaternion } from '../math/Quaternion';
import { Vector3 } from '../math/Vector3';

export class Camera {
  private _viewMatrix: Matrix4;
  private _dirtyViewMatrix: boolean;
  private _verticalAngle: number;
  private _maxVerticalAngle: number;
  private _parent: Entity;
  
  public readonly projectionMatrix: Matrix4;
  public readonly position: Vector3;
  public readonly rotation: Quaternion;

  constructor(projection: Matrix4) {
    this.projectionMatrix = projection;
    this._viewMatrix = Matrix4.createIdentity();

    this._dirtyViewMatrix = true;

    this.position = new Vector3(0, 0, 0);
    this.rotation = Quaternion.createIdentity();

    this._verticalAngle = 0;

    this._parent = null;

    // Updates the view matrix dirty flag if the position or rotation changes
    this.position.onChange.add(this._setDirtyFlag, this);
    this.rotation.onChange.add(this._setDirtyFlag, this);
  }

  private _setDirtyFlag() {
    this._dirtyViewMatrix = true;
  }

  /**
   * Rotates the camera vertically keeping its angle between
   * -maxVerticalAngle and maxVerticalAngle
   * 
   * @param radians 
   */
  public rotateVertically(radians: number) {
    let angle = radians;

    // Clamps the rotation to -maxVerticalAngle and maxVerticalAngle
    if (this._verticalAngle + angle >= this._maxVerticalAngle) {
      angle = this._maxVerticalAngle - this._verticalAngle;
    } else if (this._verticalAngle + angle <= -this._maxVerticalAngle) {
      angle = -this._maxVerticalAngle - this._verticalAngle;
    }

    if (angle !== 0) {
      // Rotate the camera along the right axis
      this.rotation.rotateX(angle);

      this._verticalAngle += angle;
    }
  }

  /**
   * Rotates the camera vertically on it's inverse angle
   * to reset it to 0
   */
  public resetVerticalRotation() {
    // Reverts the rotation of the camera
    this.rotation.rotateX(-this._verticalAngle)

    this._verticalAngle = 0;
  }

  public set maxVerticalAngle(degrees: number) {
    this._maxVerticalAngle = degToRad(degrees);
  }

  public get maxVerticalAngle() {
    return radToDeg(this._maxVerticalAngle);
  }

  /**
   * Uses dirty flag pattern for updating the view matrix
   * if the position or rotation has changed
   * 
   * @returns The updated view matrix
   */
  public get viewMatrix(): Matrix4 {
    if (!this._dirtyViewMatrix) {
      return this._viewMatrix;
    }

    this._viewMatrix
      .setIdentity()
      .multiply(this.rotation.getRotationMatrix())
      .multiply(Matrix4.createIdentity().translate(this.position.x, this.position.y, this.position.z, false));

    if (this.parent) {
      this._viewMatrix.multiply(this.parent.transform);
    }

    this._viewMatrix = this._viewMatrix.inverse;

    this._dirtyViewMatrix = false;

    return this._viewMatrix;
  }

  /**
   * Allows the camera to be parented to an entity to inherit
   * the position and rotation of the entity
   */
  public set parent(parent: Entity) {
    if (this._parent !== null) {
      this._parent.position.onChange.remove(this._setDirtyFlag);
      this._parent.rotation.onChange.remove(this._setDirtyFlag);
    }

    this._parent = parent;
    parent.position.onChange.add(this._setDirtyFlag, this);
    parent.rotation.onChange.add(this._setDirtyFlag, this);
  }

  public get parent() {
    return this._parent;
  }

  /**
   * Creates a camera using a perspective projection
   * 
   * @param fov horizontal field of view
   * @param ratio camera width / height
   * @param znear how near can objects be to the camera before the disapear
   * @param zfar how far can objects be to the camera before the disapear
   * 
   * @returns a new Camera instance
   */
  public static createPerspective(fov: number, ratio: number, znear: number, zfar: number): Camera {
    return new Camera(Matrix4.createPerspective(fov, ratio, znear, zfar));
  }

  /**
   * Creates a camera using an orthogonal projection
   * 
   * @param width
   * @param height 
   * @param znear 
   * @param zfar 
   * 
   * @returns a new Camera instance
   */
  public static createOrthogonal(width: number, height: number, znear: number, zfar: number): Camera {
    return new Camera(Matrix4.createOrthogonal(width, height, znear, zfar));
  }
}
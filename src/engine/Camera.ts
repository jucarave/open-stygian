import { Matrix4 } from './math/Matrix4';
import { Quaternion } from './math/Quaternion';
import { Vector3 } from './math/Vector3';

export class Camera {
  private _viewMatrix: Matrix4;
  private _dirtyViewMatrix: boolean;
  
  public readonly projectionMatrix: Matrix4;
  public readonly position: Vector3;
  public readonly rotation: Quaternion;

  constructor(projection: Matrix4) {
    this.projectionMatrix = projection;
    this._viewMatrix = Matrix4.createIdentity();

    this._dirtyViewMatrix = true;

    this.position = new Vector3(0, 0, 0);
    this.rotation = Quaternion.createIdentity();

    // Updates the view matrix dirty flag if the position or rotation changes
    this.position.onChange.add(this._setDirtyFlag, this);
    this.rotation.onChange.add(this._setDirtyFlag, this);
  }

  private _setDirtyFlag() {
    this._dirtyViewMatrix = true;
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
      .translate(-this.position.x, -this.position.y, -this.position.z, false)
      .multiply(this.rotation.getRotationMatrix());

    this._dirtyViewMatrix = false;

    return this._viewMatrix;
  }
}
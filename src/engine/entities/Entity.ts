import { Camera } from 'engine/Camera';
import { Geometry } from 'engine/geometries/Geometry';
import { Material } from 'engine/materials/Material';
import { Matrix4 } from 'engine/math/Matrix4';
import { Quaternion } from 'engine/math/Quaternion';
import { Vector3 } from 'engine/math/Vector3';

export class Entity {
  private _transform: Matrix4;
  private _worldMatrix: Matrix4;
  private _dirtyTransformMatrix: boolean;
  
  public readonly position: Vector3;
  public readonly rotation: Quaternion;

  public material: Material;
  public geometry: Geometry;

  constructor(position?: Vector3) {
    this._transform = Matrix4.createIdentity();
    this._worldMatrix = Matrix4.createIdentity();

    this.position = position ? position : Vector3.zero;
    this.rotation = Quaternion.createIdentity();

    this._dirtyTransformMatrix = true;

    // Updates the transform matrix dirty flag if the position or rotation changes
    this.position.onChange.add(this._setDirtyFlag, this);
    this.rotation.onChange.add(this._setDirtyFlag, this);
  }

  private _setDirtyFlag() {
    this._dirtyTransformMatrix = true;
  }

  /**
   * Returns the entity transformation matrix from the perspective
   * of a camera
   * 
   * @param camera 
   * @returns world transformation matrix
   */
  public getWorldMatrix(camera: Camera): Matrix4 {
    return this._worldMatrix.copy(this.transform).multiply(camera.viewMatrix);
  }

  /**
   * Renders the entity if it has a geometry and a material
   * 
   * @param camera render the entity from this camera perspective
   */
  public render(camera: Camera) {
    if (this.material && this.geometry) {
      this.material.render(this, camera, this.geometry);
    }
  }

  /**
   * Uses dirty flag pattern for updating the transform matrix
   * if the position or rotation has changed
   * 
   * @returns The updated view matrix
   */
  public get transform(): Matrix4 {
    if (!this._dirtyTransformMatrix) {
      return this._transform;
    }

    this._transform
      .setIdentity()
      .translate(this.position.x, this.position.y, this.position.z, false)
      .multiply(this.rotation.getRotationMatrix());

    this._dirtyTransformMatrix = false;

    return this._transform;
  }
}
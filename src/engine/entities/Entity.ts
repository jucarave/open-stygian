import { Camera } from '../core/Camera';
import { Component } from '../components/Component';
import { Geometry } from '../geometries/Geometry';
import { Material } from '../materials/Material';
import { Matrix4 } from '../math/Matrix4';
import { Quaternion } from '../math/Quaternion';
import { Vector3 } from '../math/Vector3';

export class Entity {
  protected _transform: Matrix4;
  protected _worldMatrix: Matrix4;
  protected _dirtyTransformMatrix: boolean;
  protected _components: Component[];
  protected _initialized: boolean;
  
  
  public readonly position: Vector3;
  public readonly rotation: Quaternion;
  public forward: Vector3;
  public right: Vector3;

  public material: Material;
  public geometry: Geometry;

  constructor(position?: Vector3) {
    this._transform = Matrix4.createIdentity();
    this._worldMatrix = Matrix4.createIdentity();
    this._components = [];
    this._initialized = false;

    this.position = position ? position : Vector3.zero;
    this.rotation = Quaternion.createIdentity();
    this.forward = Vector3.forward;
    this.right = Vector3.right;

    this._dirtyTransformMatrix = true;

    // Updates the transform matrix dirty flag if the position or rotation changes
    this.position.onChange.add(this._setDirtyFlag, this);
    this.rotation.onChange.add(this._setDirtyFlag, this);
  }

  /**
   * Signals that the transform matrix needs to be updated during
   * the rendering process
   */
  private _setDirtyFlag() {
    this._dirtyTransformMatrix = true;
  }

  /**
   * Adds a component to the entity, if the entity had been initialized
   * beforehand then it calls the init method of the component
   * 
   * @param component 
   */
  public addComponent(component: Component) {
    this._components.push(component);
    component.entity = this;

    if (this._initialized) {
      component.init();
    }
  }

  /**
   * Returns the first component with the componentType if it exists
   * otherwise returns null
   * 
   * @param componentType name of the component to search
   * @returns Component or null
   */
  public getComponent<T extends Component>(componentType: string): T {
    for (let i=0;i<this._components.length;i++) {
      if (this._components[i].type === componentType) {
        return this._components[i] as T;
      }
    }

    return null;
  }

  /**
   * Removes a component from the entity and calls its destroy method
   * 
   * @param component 
   */
  public removeComponent(component: Component) {
    const index = this._components.indexOf(component);
    if (index !== -1) {
      this._components.splice(index, 1);
    }

    component.destroy();
  }

  /**
   * Iterates through each component and calls their init method, it marks
   * the entity as initialized
   */
  public initComponents() {
    this._components.forEach((component: Component) => {
      component.init();
    });

    this._initialized = true;
  }

  /**
   * Call each component's update method once during each frame of the game loop
   */
  public updateComponents() {
    this._components.forEach((component: Component) => {
      component.update();
    });
  }

  /**
   * Destroy and removes all the components the entity
   */
  public destroy() {
    this._components.forEach((component: Component) => {
      component.destroy();
    });

    this._components = [];
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
      .multiply(this.rotation.getRotationMatrix())
      .multiply(Matrix4.createIdentity().translate(this.position.x, this.position.y, this.position.z, false));

    this._dirtyTransformMatrix = false;

    return this._transform;
  }
}
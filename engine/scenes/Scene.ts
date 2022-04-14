import { Camera } from '../core/Camera';
import { Entity } from '../entities/Entity';

export class Scene {
  protected _entities: Entity[];
  protected _camera: Camera;
  protected _initialized: boolean;

  constructor() {
    this._entities = [];
    this._initialized = false;
  }

  /**
   * Adds an entity to the scene, if the scene was already
   * initialized then it also initializes the entity
   * 
   * @param entity 
   */
  public addEntity(entity: Entity) {
    this._entities.push(entity);
    
    entity.scene = this;
    
    if (this._initialized) {
      entity.initComponents();
    }
  }

  /**
   * Removes an entity and destroy all its components
   * 
   * @param entity 
   */
  public removeEntity(entity: Entity) {
    const index = this._entities.indexOf(entity);
    if (index !== -1) {
      this._entities.splice(index, 1);
    }

    entity.scene = null;
    entity.destroy();
  }

  /**
   * Initializes all the components of all the entities in
   * the scene
   */
  public init() {
    this._entities.forEach((entity: Entity) => {
      entity.initComponents();
    });

    this._initialized = true;
  }

  /**
   * Executes the game logic during the game loop
   */
  public update() {
    this._entities.forEach((entity: Entity) => {
      entity.updateComponents();
    });
  }

  /**
   * Renders all the entities that can be renderer
   */
  public render() {
    this._entities.forEach((entity: Entity) => {
      entity.render(this._camera);
    });
  }

  public set camera(camera: Camera) {
    this._camera = camera;
  }
}
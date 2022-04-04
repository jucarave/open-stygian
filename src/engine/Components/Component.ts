import { Entity } from '../entities/Entity';

export abstract class Component {
  protected _entity: Entity;

  public abstract init(): void;
  public abstract update(): void;
  public abstract destroy(): void;

  public set entity(entity: Entity) {
    this._entity = entity;
  }
}
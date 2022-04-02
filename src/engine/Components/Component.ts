export abstract class Component {
  public abstract init(): void;
  public abstract update(): void;
  public abstract destroy(): void;
}
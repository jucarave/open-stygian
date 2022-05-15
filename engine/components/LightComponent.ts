import { PointLight } from '../lights/PointLight';
import { Vector3 } from '../math/Vector3';
import { SceneDungeon } from '../scenes/SceneDungeon';
import { Component } from './Component';

export class LightComponent extends Component {
  private _pointLight: PointLight;
  private _localPosition: Vector3;

  constructor(localPosition: Vector3) {
    super();

    this._localPosition = localPosition;
  }

  public init(): void {
    this._pointLight = new PointLight(this._localPosition.clone(), [1, 1, 1, 1], 5.0);
    
    (this._entity.scene as SceneDungeon).addLight(this._pointLight);
  }

  public update(): void {
    this._pointLight.position.copy(this._localPosition).sum(this._entity.position);
  }

  public destroy(): void {
  }

  public type: string;

}
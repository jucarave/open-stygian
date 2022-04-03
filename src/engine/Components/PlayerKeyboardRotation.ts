import { Camera } from 'engine/Camera';
import { Config } from 'engine/Config';
import { Vector2 } from 'engine/math/Vector2';
import { Vector3 } from 'engine/math/Vector3';
import { Input } from 'engine/system/Input';
import { Component } from './Component';

export class PlayerKeyboardRotation extends Component {
  private _camera: Camera;

  public sensitivity: Vector2;

  constructor(camera: Camera) {
    super();

    this._camera = camera;
  }

  public init(): void { }

  public update(): void {
    const hor = Input.isKeyDown(Config.input.lookLeft) - Input.isKeyDown(Config.input.lookRight);

    if (hor != 0) {
      // Update the player and camera rotation so that I don't have to do parenting just for the rotation
      this._entity.rotation.rotateY(hor * this.sensitivity.x);
      this._camera.rotation.rotateY(hor * this.sensitivity.x);

      // Rotates the player's forward and right vector to help with the movement
      this._entity.forward = Vector3.forward.rotateOnQuaternion(this._entity.rotation).normalize();
      this._entity.right = Vector3.right.rotateOnQuaternion(this._entity.rotation).normalize();
    }
  }

  public destroy(): void { }
}
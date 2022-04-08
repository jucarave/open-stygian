import { Camera } from '../core/Camera';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Input } from '../system/Input';
import { Component } from './Component';

export class PlayerMouseRotation extends Component {
  private _camera: Camera;

  public sensitivity: Vector2;

  public readonly type = 'PlayerMouseRotation';

  constructor(camera: Camera) {
    super();

    this._camera = camera;
  }

  public init(): void { }

  private _updateHorizontalRotation() {
    const hor = Input.mouseMovement.x;

    if (hor !== 0) {
      // Update the player and camera rotation so that I don't have to do parenting just for the rotation
      this._entity.rotation.rotateY(hor * this.sensitivity.x);

      // Rotates the player's forward and right vector to help with the movement
      this._entity.forward = Vector3.forward.rotateOnQuaternion(this._entity.rotation).normalize();
      this._entity.right = Vector3.right.rotateOnQuaternion(this._entity.rotation).normalize();
    }
  }

  private _updateVerticalRotation() {
    const ver = Input.mouseMovement.y;

    if (ver !== 0) {
      this._camera.rotateVertically(-ver * this.sensitivity.y);
    }
  }

  public update(): void {
    this._updateHorizontalRotation();
    this._updateVerticalRotation();
  }

  public destroy(): void { }
}
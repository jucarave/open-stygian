import { Camera } from '../Camera';
import { Config } from '../Config';
import { degToRad } from '../math/Math';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Input } from '../system/Input';
import { Component } from './Component';

export class PlayerKeyboardRotation extends Component {
  private _camera: Camera;
  private _verticalAngle: number;
  private _maxVerticalAngle: number;

  public sensitivity: Vector2;

  constructor(camera: Camera) {
    super();

    this._camera = camera;
    this._verticalAngle = 0;
    this.maxVerticalAngle = 60;
  }

  public init(): void { }

  private _updateHorizontalRotation() {
    const hor = Input.isKeyDown(Config.input.lookLeft) - Input.isKeyDown(Config.input.lookRight);

    if (hor !== 0) {
      // Update the player and camera rotation so that I don't have to do parenting just for the rotation
      this._entity.rotation.rotateY(hor * this.sensitivity.x);
      this._camera.rotation.rotateY(hor * this.sensitivity.x);

      // Rotates the player's forward and right vector to help with the movement
      this._entity.forward = Vector3.forward.rotateOnQuaternion(this._entity.rotation).normalize();
      this._entity.right = Vector3.right.rotateOnQuaternion(this._entity.rotation).normalize();
    }
  }

  private _updateVerticalRotation() {
    const ver = Input.isKeyDown(Config.input.lookUp) - Input.isKeyDown(Config.input.lookDown);

    if (ver !== 0) {
      let angle = ver * this.sensitivity.y;

      // Clamps the rotation to -maxVerticalAngle and maxVerticalAngle
      if (this._verticalAngle + angle >= this._maxVerticalAngle) {
        angle = this._maxVerticalAngle - this._verticalAngle;
      } else if (this._verticalAngle + angle <= -this._maxVerticalAngle) {
        angle = -this._maxVerticalAngle - this._verticalAngle;
      }

      if (angle !== 0) {
        // Rotate the camera along the right axis of the player
        this._camera.rotation.rotate(angle, this._entity.right);

        this._verticalAngle += angle;
      }
    }

    if (Input.isKeyPressed(Config.input.lookCenter)) {
      // Center the camera looking along the player forward axis
      this._camera.rotation.lookToDirection(this._entity.forward);

      this._verticalAngle = 0;
    }
  }

  public update(): void {
    this._updateHorizontalRotation();
    this._updateVerticalRotation();
  }

  public destroy(): void { }

  public set maxVerticalAngle(degrees: number) {
    this._maxVerticalAngle = degToRad(degrees);
  }
}
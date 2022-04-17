import { Component } from '../../../engine/components/Component';
import { Camera } from '../../../engine/core/Camera';
import { degToRad } from '../../../engine/math/Math';
import { Vector2 } from '../../../engine/math/Vector2';
import { Vector3 } from '../../../engine/math/Vector3';
import { Input } from '../../../engine/system/Input';
import { KEY_CODES } from '../../../engine/system/KeyCodes';

export class FlyingCamera extends Component {
  private _camera: Camera;

  public sensitivity: Vector2;
  public speed: number;

  public readonly type = 'FlyingCamera';

  constructor(camera: Camera) {
    super();

    this._camera = camera;
    this.sensitivity = { x: 0.3, y: 0.3 };
    this.speed = 0.3;
  }

  private _updateMovement() {
    const hor = Input.isKeyDown(KEY_CODES.A) - Input.isKeyDown(KEY_CODES.D);
    const fwd = Input.isKeyDown(KEY_CODES.W) - Input.isKeyDown(KEY_CODES.S);

    if (fwd !== 0 || hor !== 0) {
      const direction = this._entity.rotation.forward.multiplyScalar(this.speed * fwd);
      direction.sum(this._entity.rotation.right.multiplyScalar(this.speed * hor));
      direction.normalize();

      this._entity.position.sum(direction);
    }

    const ver = Input.isKeyDown(KEY_CODES.E) - Input.isKeyDown(KEY_CODES.Q);
    if (ver !== 0) {
      this._entity.position.y += ver * this.speed;
    }
  }

  private _updateMouseRotation() {
    const hor = Input.mouseMovement.x;

    if (hor != 0) {
      this._entity.rotation.rotate(degToRad(this.sensitivity.x * hor), Vector3.up);
    }

    const ver = Input.mouseMovement.y;
    if (ver != 0) {
      this._entity.rotation.rotateX(degToRad(-this.sensitivity.y * ver), 'local');
    }
  }

  public init(): void {
    this._camera.parent = this._entity;
  }

  public update(): void {
    this._updateMovement();
    this._updateMouseRotation();
  }

  public destroy(): void {
    
  }
}
import { Camera } from 'engine/Camera';
import { Config } from 'engine/Config';
import { Vector2 } from 'engine/math/Vector2';
import { Vector3 } from 'engine/math/Vector3';
import { Input } from 'engine/system/Input';
import { Component } from './Component';

export class PlayerKeyboardRotation extends Component {
  private _camera: Camera;
  private _input = {
    LEFT: 0,
    RIGHT: 0,
    UP: 0,
    DOWN: 0,
    CENTER: 0
  }

  public sensitivity: Vector2;

  constructor(camera: Camera) {
    super();

    this._camera = camera;
  }

  private _handleKeyInput(ev: KeyboardEvent, keyInput: number) {
    switch (ev.key) {
      case Config.input.rotateLeft: this._input.LEFT = keyInput; break;
      case Config.input.rotateRight: this._input.RIGHT = keyInput; break;
    }
  }

  private _handleKeyDown(ev: KeyboardEvent) {
    this._handleKeyInput(ev, 1);
  }

  private _handleKeyUp(ev: KeyboardEvent) {
    this._handleKeyInput(ev, 0);
  }

  public init(): void {
    Input.instance.onKeyDown.add(this._handleKeyDown, this);
    Input.instance.onKeyUp.add(this._handleKeyUp, this);
  }

  public update(): void {
    const hor = this._input.LEFT - this._input.RIGHT;

    if (hor != 0) {
      // Update the player and camera rotation so that I don't have to do parenting just for the rotation
      this._entity.rotation.rotateY(hor * this.sensitivity.x);
      this._camera.rotation.rotateY(hor * this.sensitivity.x);

      // Rotates the player's forward and right vector to help with the movement
      this._entity.forward = Vector3.forward.rotateOnQuaternion(this._entity.rotation).normalize();
      this._entity.right = Vector3.right.rotateOnQuaternion(this._entity.rotation).normalize();
    }
  }

  public destroy(): void {
    Input.instance.onKeyDown.remove(this._handleKeyDown);
    Input.instance.onKeyUp.remove(this._handleKeyUp);
  }
}
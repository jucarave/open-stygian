import { Camera } from 'engine/Camera';
import { getAngleBetwen2DVectors } from 'engine/math/Math';
import { Input } from 'engine/system/Input';
import { Component } from './Component';
import { Config } from '../Config';

/**
 * This component manages the movement of the character
 * in a smooth way
 */
export class PlayerSmoothMovement extends Component {
  private _camera: Camera;
  private _input = {
    UP: 0,
    RIGHT: 0,
    LEFT: 0,
    DOWN: 0
  };

  // Movement speed in units/frame
  public movementSpeed = 0.1;

  constructor(camera: Camera) {
    super();

    this._camera = camera;
  }

  /**
   * Handles the player's input to control the movement with
   * the configured keys
   * 
   * @param ev 
   * @param keyInput Is the key being pressed (1)? or relased (0)?
   */
  private _handleKeyInput(ev: KeyboardEvent, keyInput: number) {
    switch (ev.key.toLowerCase()) {
      case Config.input.up: this._input.UP = keyInput; break;
      case Config.input.left: this._input.LEFT = keyInput; break;
      case Config.input.down: this._input.DOWN = keyInput; break;
      case Config.input.right: this._input.RIGHT = keyInput; break;
    }
  }

  private _handleKeyDown(ev: KeyboardEvent) {
    this._handleKeyInput(ev, 1);
  }

  private _handleKeyUp(ev: KeyboardEvent) {
    this._handleKeyInput(ev, 0);
  }

  /**
   * Gets the angle of the movement based on the key pressed and
   * moves the player in that direction
   */
  private updateMovement() {
    const ver = this._input.UP - this._input.DOWN;
    const hor = this._input.LEFT - this._input.RIGHT;

    if (hor != 0 || ver != 0) {
      const dir = this._entity.forward.clone().multiplyScalar(ver).sum(this._entity.right.clone().multiplyScalar(hor));
      const angle = getAngleBetwen2DVectors(1, 0, dir.x, dir.z);

      this._entity.position.x += Math.cos(angle) * this.movementSpeed;
      this._entity.position.z += Math.sin(angle) * this.movementSpeed;
    }
  }

  public init(): void {
    Input.instance.onKeyDown.add(this._handleKeyDown, this);
    Input.instance.onKeyUp.add(this._handleKeyUp, this);
  }

  public update(): void {
    this.updateMovement();

    // Positions the camera at the player's position
    this._camera.position.copy(this._entity.position);
  }
  
  public destroy(): void {
    Input.instance.onKeyDown.remove(this._handleKeyDown);
    Input.instance.onKeyUp.remove(this._handleKeyUp);
  }
}
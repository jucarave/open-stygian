import { Camera } from 'engine/Camera';
import { getAngleBetwen2DVectors } from 'engine/math/Math';
import { Input } from 'engine/system/Input';
import { SignalCallbackType } from 'engine/system/Signal';
import { Component } from './Component';

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
  private _handleKey(ev: KeyboardEvent, keyInput: number) {
    switch (ev.key.toLowerCase()) {
      case 'w': this._input.UP = keyInput; break;
      case 'a': this._input.LEFT = keyInput; break;
      case 's': this._input.DOWN = keyInput; break;
      case 'd': this._input.RIGHT = keyInput; break;
    }
  }

  /**
   * Gets the angle of the movement based on the key pressed and
   * moves the player in that direction
   */
  private updateMovement() {
    const ver = this._input.UP - this._input.DOWN;
    const hor = this._input.RIGHT - this._input.LEFT;

    if (hor != 0 || ver != 0) {
      const angle = getAngleBetwen2DVectors(1, 0, hor, ver);

      this._entity.position.x += Math.cos(angle) * this.movementSpeed;
      this._entity.position.z += Math.sin(angle) * this.movementSpeed;
    }
  }

  public init(): void {
    Input.instance.onKeyDown.add((args: SignalCallbackType) => this._handleKey(args as KeyboardEvent, 1), this);
    Input.instance.onKeyUp.add((args: SignalCallbackType) => this._handleKey(args as KeyboardEvent, 0), this);
  }

  public update(): void {
    this.updateMovement();

    // Positions the camera at the player's position
    this._camera.position.copy(this._entity.position);
  }
  
  public destroy(): void {}
}
import { Camera } from 'engine/Camera';
import { Config } from 'engine/Config';
import { getAngleBetwen2DVectors } from 'engine/math/Math';
import { Input } from 'engine/system/Input';
import { Component } from './Component';

/**
 * This component manages the movement of the character
 * in a smooth way
 */
export class PlayerSmoothMovement extends Component {
  private _camera: Camera;

  // Movement speed in units/frame
  public movementSpeed = 0.1;

  constructor(camera: Camera) {
    super();

    this._camera = camera;
  }

  /**
   * Gets the angle of the movement based on the key pressed and
   * moves the player in that direction
   */
  private updateMovement() {
    const ver = Input.isKeyDown(Config.input.up) - Input.isKeyDown(Config.input.down);
    const hor = Input.isKeyDown(Config.input.left) - Input.isKeyDown(Config.input.right);

    if (hor != 0 || ver != 0) {
      const dir = this._entity.forward.clone().multiplyScalar(ver).sum(this._entity.right.clone().multiplyScalar(hor));
      const angle = getAngleBetwen2DVectors(1, 0, dir.x, dir.z);

      this._entity.position.x += Math.cos(angle) * this.movementSpeed;
      this._entity.position.z += Math.sin(angle) * this.movementSpeed;
    }
  }

  public init(): void {
  }

  public update(): void {
    this.updateMovement();

    // Positions the camera at the player's position
    this._camera.position.copy(this._entity.position);
  }
  
  public destroy(): void {
  }
}
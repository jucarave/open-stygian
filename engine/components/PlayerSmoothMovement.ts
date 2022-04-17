import { Camera } from '../core/Camera';
import { Config } from '../system/Config';
import { getAngleBetwen2DVectors } from '../math/Math';
import { Input } from '../system/Input';
import { Component } from './Component';
import { CharacterMovement } from './CharacterMovement';
import { KEY_CODES } from '../system/KeyCodes';

/**
 * This component manages the movement of the character
 * in a smooth way
 */
export class PlayerSmoothMovement extends Component {
  private _camera: Camera;
  private _characterMovement: CharacterMovement;

  // Movement speed in units/frame
  public movementSpeed = 0.1;

  public readonly type = 'PlayerSmoothMovement';

  constructor(camera: Camera) {
    super();

    this._camera = camera;
    this._camera.position.set(0, 0.5, 0);
  }

  /**
   * Gets the angle of the movement based on the key pressed and
   * moves the player in that direction
   */
  private updateMovement() {
    const ver = Input.isKeyDown(Config.input.up) - Input.isKeyDown(Config.input.down);
    const hor = Input.isKeyDown(Config.input.left) - Input.isKeyDown(Config.input.right);

    if (hor != 0 || ver != 0) {
      const dir = this._entity.rotation.forward.multiplyScalar(ver).sum(this._entity.rotation.right.multiplyScalar(hor));
      const angle = getAngleBetwen2DVectors(1, 0, dir.x, dir.z);

      this._characterMovement.moveTo(Math.cos(angle) * this.movementSpeed, Math.sin(angle) * this.movementSpeed);
    }
  }

  // For debugging collisions
  // TODO: Remove
  private _updateFloat() {
    const ver = Input.isKeyPressed(KEY_CODES.U) - Input.isKeyPressed(KEY_CODES.J);

    if (ver != 0) {
      this._entity.position.y += 0.1 * ver;
    }
  }

  public init(): void {
    this._characterMovement = this._entity.getComponent<CharacterMovement>('CharacterMovement');
  }

  public update(): void {
    this.updateMovement();
    this._updateFloat();
  }
  
  public destroy(): void {
  }
}
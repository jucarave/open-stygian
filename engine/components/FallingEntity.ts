import { SceneDungeon } from '../scenes/SceneDungeon';
import { Config } from '../system/Config';
import { Input } from '../system/Input';
import { KEY_CODES } from '../system/KeyCodes';
import { Component } from './Component';

export class FallingEntity extends Component {
  private _vspeed = 0;
  private _scene: SceneDungeon;
  private _isGrounded: boolean;
  private _radius: number;
  private _height: number;
  private _gravity: number;

  public readonly type = 'FallingEntity';

  constructor(radius: number, height: number) {
    super();

    this._radius = radius;
    this._height = height;
  }

  public init(): void {
    this._scene = this._entity.scene as SceneDungeon;
    this._isGrounded = true;
    this._gravity = Config.gravity;
  }

  /**
   * Checks for ground above the entity and if there is collision
   * then place the entity beneath the ground
   */
  private _checkForCeiling() {
    const ceiling = this._scene.getLowestPlane(this._entity.position, this._height, this._radius);

    if (this._entity.position.y + this._vspeed + this._height >= ceiling) {
      this._entity.position.y = ceiling - this._height;
      this._vspeed = 0;
    }
  }

  /**
   * Checks for ground below the entity and if there is collision
   * then place the entity at the ground
   */
  private _checkForGround() {
    const floorY = this._scene.getHighestPlane(this._entity.position, this._radius);

    if (!this._isGrounded) {
      if (this._entity.position.y + this._vspeed < floorY) {
        this._entity.position.y = floorY;
        this._isGrounded = true;
        this._vspeed = 0;
      }
    }

    if (floorY < this._entity.position.y) {
      this._isGrounded = false;
    }
  }

  /**
   * Each frame check if the entity is not grounded and if so
   * then made them fall
   */
  public update(): void {
    if (this._vspeed <= 0) {
      this._checkForGround();
    } else {
      this._checkForCeiling();
    }

    if (!this._isGrounded) {
      this._vspeed += this._gravity;
      this._entity.position.y += this._vspeed;
    }

    // TODO: Temporal for testing
    if (Input.isKeyPressed(KEY_CODES.Space)) {
      this._vspeed = 0.06;
      this._isGrounded = false;
    }
  }

  public destroy(): void {
    
  }

  /**
   * Place the entity on the ground if it's not
   * falling or jumping, usefull for when moving
   * on slopes
   * 
   * @returns 
   */
  public placeOnFloor(): void {
    if (this._vspeed !== 0) { return; }

    const floorY = this._scene.getHighestPlane(this._entity.position, this._radius);

    if (Math.abs(floorY - this._entity.position.y) <= Config.slopeHeight) {
      this._entity.position.y = floorY;
    }
  }
}
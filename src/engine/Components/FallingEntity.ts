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
  private _gravity: number;

  public readonly type = 'FallingEntity';

  constructor(radius: number) {
    super();

    this._radius = radius;
  }

  public init(): void {
    this._entity.position.y = 5;
    this._scene = this._entity.scene as SceneDungeon;
    this._isGrounded = true;
    this._radius = Config.player.radius;
    this._gravity = Config.gravity;
  }

  /**
   * Each frame check if the entity is not grounded and if so
   * then made them fall
   */
  public update(): void {
    const floorY = this._scene.getDungeon().getFloorHeight(this._entity.position, this._radius);

    if (!this._isGrounded) {
      this._vspeed += this._gravity;

      if (this._entity.position.y + this._vspeed < floorY) {
        this._entity.position.y = floorY;
        this._isGrounded = true;
        this._vspeed = 0;
      } else {
        this._entity.position.y += this._vspeed;
      }
    }

    if (floorY < this._entity.position.y) {
      this._isGrounded = false;
    }

    // TODO: Temporal for testing
    if (Input.isKeyPressed(KEY_CODES.Space)) {
      this._vspeed = 0.06;
      this._isGrounded = false;
    }
  }

  public destroy(): void {
    
  }

  public placeOnFloor(): void {
    if (this._vspeed !== 0) { return; }

    const floorY = this._scene.getDungeon().getFloorHeight(this._entity.position, this._radius);

    if (Math.abs(floorY - this._entity.position.y) <= Config.slopeHeight) {
      this._entity.position.y = floorY;
    }
  }
}
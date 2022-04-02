import { Camera } from './Camera';
import { PlayerSmoothMovement } from './Components/PlayerSmoothMovement';
import { Entity } from './entities/Entity';

export class PlayerSetup {
  private _player: Entity;
  private _camera: Camera;
  private _movement: PlayerSmoothMovement;

  constructor(player: Entity, camera: Camera) {
    this._player = player;
    this._camera = camera;

    this._movement = null;
  }

  addSmoothMovement(movementSpeed = 0.1) {
    // Can only have a movement component at the time
    if (this._movement !== null) {
      this._player.removeComponent(this._movement);
    }

    const smoothMovement = new PlayerSmoothMovement(this._camera);
    smoothMovement.movementSpeed = movementSpeed;

    this._player.addComponent(smoothMovement);

    this._movement = smoothMovement;

    return this;
  }
}
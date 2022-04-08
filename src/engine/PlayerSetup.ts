import { Camera } from './core/Camera';
import { PlayerKeyboardRotation } from './components/PlayerKeyboardRotation';
import { PlayerMouseRotation } from './components/PlayerMouseRotation';
import { PlayerSmoothMovement } from './components/PlayerSmoothMovement';
import { Entity } from './entities/Entity';
import { Vector2 } from './math/Vector2';

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

  addKeyboardFirsPersonLook(sensitivity: Vector2 = {x: 0.03, y: 0.03}, maxVerticalAngle = 60) {
    const rotation = new PlayerKeyboardRotation(this._camera);
    rotation.sensitivity = sensitivity;
    this._camera.maxVerticalAngle = maxVerticalAngle;

    this._player.addComponent(rotation);

    return this;
  }

  addMouseFirstPersonLook(sensitivity: Vector2 = {x: 0.01, y: 0.01}, maxVerticalAngle = 60) {
    const rotation = new PlayerMouseRotation(this._camera);
    rotation.sensitivity = sensitivity;
    this._camera.maxVerticalAngle = maxVerticalAngle;

    this._player.addComponent(rotation);

    return this;
  }
}
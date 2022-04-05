import * as chai from 'chai';
import * as spies from 'chai-spies';
import 'mocha';
import { PlayerKeyboardRotation } from '../../src/engine/components/PlayerKeyboardRotation';
import { PlayerMouseRotation } from '../../src/engine/components/PlayerMouseRotation';
import { PlayerSmoothMovement } from '../../src/engine/components/PlayerSmoothMovement';
import { Camera } from '../../src/engine/core/Camera';
import { Entity } from '../../src/engine/entities/Entity';
import { PlayerSetup } from '../../src/engine/PlayerSetup';

const expect = chai.expect;
chai.use(spies);

describe('Player Setup Helper Functions', () => {
  it('Can be instantiated', () => {
    const playerSetup = new PlayerSetup(null, null);

    expect(playerSetup).to.be.instanceOf(PlayerSetup);
  });

  it('Can add a smooth movement component with parameters', () => {
    const player = new Entity();
    const camera = Camera.createPerspective(60, 16/9, 0.1, 1000);
    const playerSetup = new PlayerSetup(player, camera);

    expect(player.getComponent<PlayerSmoothMovement>('PlayerSmoothMovement')).to.be.null;

    const movementSpeed = 5;
    playerSetup.addSmoothMovement(movementSpeed)
    const component = player.getComponent<PlayerSmoothMovement>('PlayerSmoothMovement');
    
    expect(component).to.be.instanceOf(PlayerSmoothMovement);
    expect(component.movementSpeed).to.eql(movementSpeed)
  });

  it('Removes a movement component before adding another one', () => {
    const player = new Entity();
    const camera = Camera.createPerspective(60, 16/9, 0.1, 1000);
    const playerSetup = new PlayerSetup(player, camera);
    const spy = chai.spy.on(player, 'removeComponent');

    expect(player.getComponent<PlayerSmoothMovement>('PlayerSmoothMovement')).to.be.null;

    playerSetup.addSmoothMovement()
    expect(player.getComponent<PlayerSmoothMovement>('PlayerSmoothMovement')).to.be.instanceOf(PlayerSmoothMovement);

    playerSetup.addSmoothMovement()
    expect(player.getComponent<PlayerSmoothMovement>('PlayerSmoothMovement')).to.be.instanceOf(PlayerSmoothMovement);
    expect(spy).to.have.been.called.exactly(1);
  });

  it('Can add a keyboard first person rotation component with parameters', () => {
    const player = new Entity();
    const camera = Camera.createPerspective(60, 16/9, 0.1, 1000);
    const playerSetup = new PlayerSetup(player, camera);

    expect(player.getComponent<PlayerKeyboardRotation>('PlayerKeyboardRotation')).to.be.null

    const sensitivity = {x: 3, y: 8};
    const maxAngle = 90;

    playerSetup.addKeyboardFirsPersonLook(sensitivity, maxAngle);
    const component = player.getComponent<PlayerKeyboardRotation>('PlayerKeyboardRotation');
    
    expect(component).to.be.instanceOf(PlayerKeyboardRotation);
    expect(component.sensitivity).to.deep.equal(sensitivity);
    expect(component.maxVerticalAngle).to.eql(maxAngle);
  });

  it('Can add a mouse first person rotation component with parameters', () => {
    const player = new Entity();
    const camera = Camera.createPerspective(60, 16/9, 0.1, 1000);
    const playerSetup = new PlayerSetup(player, camera);

    expect(player.getComponent<PlayerMouseRotation>('PlayerMouseRotation')).to.be.null

    const sensitivity = {x: 3, y: 8};
    const maxAngle = 90;

    playerSetup.addMouseFirstPersonLook(sensitivity, maxAngle);
    const component = player.getComponent<PlayerMouseRotation>('PlayerMouseRotation');
    
    expect(component).to.be.instanceOf(PlayerMouseRotation);
    expect(component.sensitivity).to.deep.equal(sensitivity);
    expect(component.maxVerticalAngle).to.eql(maxAngle);
  });

  it('Can add multiple first person rotation components', () => {
    const player = new Entity();
    const camera = Camera.createPerspective(60, 16/9, 0.1, 1000);
    const playerSetup = new PlayerSetup(player, camera);

    expect(player.getComponent<PlayerMouseRotation>('PlayerMouseRotation')).to.be.null
    expect(player.getComponent<PlayerKeyboardRotation>('PlayerKeyboardRotation')).to.be.null

    playerSetup.addKeyboardFirsPersonLook();
    playerSetup.addMouseFirstPersonLook();

    expect(player.getComponent<PlayerMouseRotation>('PlayerMouseRotation')).to.be.instanceOf(PlayerMouseRotation);
    expect(player.getComponent<PlayerKeyboardRotation>('PlayerKeyboardRotation')).to.be.instanceOf(PlayerKeyboardRotation);
  });
});
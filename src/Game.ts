import { Stygian } from 'engine/Stygian';
import { Texture } from 'engine/Texture';

class Game {
  constructor() {
    new Texture('texture', 'img/texture.png')

    const canvas = document.getElementById('openStygianCanvas') as HTMLCanvasElement;
    
    const stygian = new Stygian(canvas);
    
    const level = stygian.loadLevel();
    level.playerSetup
      .addSmoothMovement()
      .addKeyboardFirsPersonLook();

    stygian.play();
  }
}

window.onload = () => {
  new Game();
}
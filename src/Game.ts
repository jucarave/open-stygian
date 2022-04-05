import { DungeonMap } from './engine/DungeonMap';
import { Stygian } from './engine/Stygian';
import { Texture } from './engine/core/Texture';

class Game {
  constructor() {
    new Texture('texture', 'img/texture.png')

    const canvas = document.getElementById('openStygianCanvas') as HTMLCanvasElement;
    
    const stygian = new Stygian(canvas);
    
    const level = stygian.loadLevel(this._getLevel());
    level.playerSetup
      .addSmoothMovement()
      .addKeyboardFirsPersonLook()
      .addMouseFirstPersonLook();

    stygian.play();
  }

  private _getLevel(): DungeonMap {
    return {
      texture: 'texture',
      tiles: [
        { type: 'Floor', uv: [1/256,1/256,30/256,30/256], ceilUV: [65/256,1/256,30/256,30/256] },
        { type: 'Wall', uv: [33/256,1/256,30/256,30/256] }
      ],
      map: [
        [ 2, 2, 2, 2, 2, 2, 2 ],
        [ 2, 1, 1, 1, 1, 1, 2 ],
        [ 2, 1, 2, 1, 2, 1, 2 ],
        [ 2, 1, 1, 1, 1, 1, 2 ],
        [ 2, 1, 1, 1, 1, 1, 2 ],
        [ 2, 2, 2, 1, 2, 2, 2 ]
      ]
    };
  }
}

window.onload = () => {
  new Game();
}
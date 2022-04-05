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
        { y1: 0, y2: 1, floor: { uv: [1/256,1/256,30/256,30/256] }, ceiling: { uv: [65/256,1/256,30/256,30/256] } },
        { y1: 0, y2: 1, wall: { uv: [33/256,1/256,30/256,30/256] } },
        { y1: -0.2, y2: 1.5, floor: { uv: [1/256,1/256,30/256,30/256], lowWallUV: [33/256,1/256,30/256,30/256] }, ceiling: { uv: [65/256,1/256,30/256,30/256], highWallUV: [33/256,1/256,30/256,30/256] } },
        { y1: 0.2, y2: 0.8, floor: { lowWallUV: [65/256,1/256,30/256,30/256] }, wall: { uv: [33/256,1/256,30/256,30/256] } }
      ],
      map: [
        [ 2, 2, 2, 2, 2, 2, 2 ],
        [ 2, 1, 1, 1, 1, 1, 2 ],
        [ 2, 1, 1, 1, 1, 3, 2 ],
        [ 2, 1, 4, 1, 1, 3, 2 ],
        [ 2, 1, 1, 1, 1, 1, 2 ],
        [ 2, 2, 2, 1, 2, 2, 2 ]
      ]
    };
  }
}

window.onload = () => {
  new Game();
}
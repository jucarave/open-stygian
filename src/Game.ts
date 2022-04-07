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
    const UVs = {
      dirt: [1/256,1/256,30/256,30/256],
      stoneWall: [33/256,1/256,30/256,30/256],
      ceiling: [65/256,1/256,30/256,30/256]
    };
    return {
      texture: 'texture',
      tiles: [
        { y1: 0, y2: 1, floor: { uv: UVs.dirt }, ceiling: { uv: UVs.ceiling } },
        { y1: 0, y2: 1, wall: { uv: UVs.stoneWall } },
        { y1: -0.2, y2: 1.5, floor: { uv: UVs.dirt, lowWallUV: UVs.stoneWall }, ceiling: { uv: UVs.ceiling, highWallUV: UVs.stoneWall } },
        { y1: 0.2, y2: 0.8, floor: { lowWallUV: UVs.ceiling }, wall: { uv: UVs.stoneWall } },
        { y1: 0, y2: 1, wall: { diagonal: 'tl', uv: UVs.stoneWall }, floor: { uv: UVs.dirt }, ceiling: { uv: UVs.ceiling } },
        { y1: 0, y2: 1, wall: { diagonal: 'tr', uv: UVs.stoneWall }, floor: { uv: UVs.dirt }, ceiling: { uv: UVs.ceiling } },
        { y1: 0.3, y2: 1, wall: { diagonal: 'bl', uv: UVs.stoneWall }, floor: { uv: UVs.dirt, lowWallUV: UVs.stoneWall }, ceiling: { uv: UVs.ceiling } },
        { y1: 0, y2: 1, wall: { diagonal: 'br', uv: UVs.stoneWall }, floor: { uv: UVs.dirt }, ceiling: { uv: UVs.ceiling } },

        { y1: 0, y2: 3, floor: { uv: UVs.dirt }, ceiling: { uv: UVs.ceiling } },
        { y1: 0, y2: 3, wall: { uv: UVs.stoneWall } },
        { y1: 0.5, y2: 3, floor: { slope: 'l', uv: UVs.dirt, lowWallUV: UVs.stoneWall }, ceiling: { uv: UVs.ceiling } },
        { y1: 0, y2: 3, floor: { slope: 'l', uv: UVs.dirt, lowWallUV: UVs.stoneWall }, ceiling: { uv: UVs.ceiling } },

        { y1: 0.4, y2: 3, floor: { uv: UVs.dirt }, ceiling: { uv: UVs.ceiling } },
      ],
      map: [
        [  2,  2,  2,  2,  2,  2,  2,  2,  2,  2 ],
        [  2,  5,  1,  1,  1,  1,  1,  1,  6,  2 ],
        [  2,  1,  1,  1,  1,  1,  1,  1,  3,  2 ],
        [  2,  4,  1,  7,  8,  1,  1,  1,  3,  2 ],
        [  2,  1,  1,  6,  5,  1,  1,  1,  1,  2 ],
        [  2,  1,  1,  1,  1,  1,  1,  1,  1,  2 ],
        [  2,  7,  1,  1,  1,  1,  1,  1,  8,  2 ],
        [  2,  2,  2,  2,  1,  1,  2,  2,  2,  2 ],
        [  0, 10, 10,  1,  9,  9, 10,  0,  0,  0 ],
        [  0, 10, 13, 11, 12,  9, 10,  0,  0,  0 ],
        [  0, 10, 10,  9,  9,  9, 10,  0,  0,  0 ],
        [  0,  0, 10,  9,  9,  9, 10,  0,  0,  0 ],
        [  0,  0, 10,  9,  9,  9, 10,  0,  0,  0 ]
      ]
    };
  }
}

window.onload = () => {
  new Game();
}
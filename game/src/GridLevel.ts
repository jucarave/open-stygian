import { DungeonGrid } from '../../engine/dungeon/GridLevel/DungeonGrid';

export function gridLevel() {
  const level: DungeonGrid = {
    texture: 'texture',
    tiles: [
      {
        y: 0,
        height: 1.2,
        wallUV: [33/256,1/256,30/256,30/256]
      },
      {
        y: 0,
        height: 1.2,
        floorUV: [1/256,1/256,30/256,30/256],
        ceilingUV: [65/256,1/256,30/256,30/256]
      },
      {
        y: 0.2,
        height: 3,
        floorUV: [1/256,1/256,30/256,30/256],
        ceilingUV: [65/256,1/256,30/256,30/256],
        lowWallUV: [33/256,1/256,30/256,30/256],
        highWallUV: [33/256,1/256,30/256,30/256],
      },
      {
        y: 0,
        height: 3,
        wallUV: [33/256,1/256,30/256,30/256]
      },
      {
        y: 0,
        height: 3,
        floorUV: [1/256,1/256,30/256,30/256],
        ceilingUV: [65/256,1/256,30/256,30/256]
      },
      {
        y: 0,
        height: 1.2,
        wallUV: [33/256,1/256,30/256,30/256],
        floorUV: [1/256,1/256,30/256,30/256],
        ceilingUV: [65/256,1/256,30/256,30/256],
        diagonal: 'tl'
      },
      {
        y: 0,
        height: 1.2,
        wallUV: [33/256,1/256,30/256,30/256],
        floorUV: [1/256,1/256,30/256,30/256],
        ceilingUV: [65/256,1/256,30/256,30/256],
        diagonal: 'tr'
      },
      {
        y: 0.3,
        height: 0.6,
        wallUV: [33/256,1/256,30/256,30/256],
        floorUV: [1/256,1/256,30/256,30/256],
        ceilingUV: [65/256,1/256,30/256,30/256],
        diagonal: 'bl'
      },
      {
        y: 0,
        height: 1.2,
        wallUV: [33/256,1/256,30/256,30/256],
        floorUV: [1/256,1/256,30/256,30/256],
        ceilingUV: [65/256,1/256,30/256,30/256],
        diagonal: 'br'
      },
      {
        y: 0,
        height: 3,
        lowWallUV: [33/256,1/256,30/256,30/256],
        floorUV: [1/256,1/256,30/256,30/256],
        ceilingUV: [65/256,1/256,30/256,30/256],
        slope: 'w'
      },
      {
        y: 0.5,
        height: 2.5,
        lowWallUV: [33/256,1/256,30/256,30/256],
        floorUV: [1/256,1/256,30/256,30/256],
        ceilingUV: [65/256,1/256,30/256,30/256],
        slope: 'w'
      },
    ],
    map: [
      [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
      [  1,  6,  2,  2,  2,  2,  2,  2,  7,  1],
      [  1,  2,  2,  2,  2,  2,  2,  2,  3,  1],
      [  1,  2,  2,  2,  2,  2,  2,  2,  3,  1],
      [  1,  8,  2,  2,  2,  2,  2,  2,  9,  1],
      [  1,  1,  1,  1,  2,  2,  1,  1,  1,  1],
      [  4,  4,  4,  4,  5,  5,  4,  0,  0,  0],
      [  4,  5, 11, 10,  5,  5,  4,  0,  0,  0],
      [  4,  5,  5,  5,  5,  5,  4,  0,  0,  0],
      [  4,  4,  4,  4,  5,  5,  4,  0,  0,  0],
      [  0,  0,  0,  4,  4,  4,  4,  0,  0,  0],
    ]
  }

  return level;
}
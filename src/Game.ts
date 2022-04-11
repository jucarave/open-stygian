import { DungeonMap } from './engine/DungeonMap';
import { Stygian } from './engine/Stygian';
import { Texture } from './engine/core/Texture';
import { Vector3 } from './engine/math/Vector3';

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
      meshes: [
        { // Wall of 1 height with floor and ceiling
          vertices: [
            0,0,0,   1,0,0,   0,1,0,   1,1,0,
            0,0,1,   1,0,1,   0,0,0,   1,0,0,
            0,1,0,   1,1,0,   0,1,1,   1,1,1,
          ], 
          texCoords: [
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            1/256,31/256,    31/256,31/256,   1/256,1/256,    31/256,1/256,
            65/256,31/256,   95/256,31/256,   65/256,1/256,   95/256,1/256,
          ], indices: [
            0,1,2,   1,3,2,
            4,5,6,   5,7,6,
            8,9,10,  9,11,10
          ] 
        },

        { // Diagonal Wall of 1 height with floor and ceiling
          vertices: [
            0,0,1,   1,0,0,   0,1,1,   1,1,0,
            0,0,1,   1,0,1,   1,0,0,
            1,1,0,   1,1,1,   0,1,1
          ], 
          texCoords: [
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            1/256,31/256,    31/256,31/256,   31/256,1/256,
            95/256,1/256,    95/256,31/256,   65/256,31/256
          ], indices: [
            0,1,2,   1,3,2,
            4,5,6,
            7,8,9
          ] 
        },

        { // floor and ceiling of 1 height
          vertices: [
            0,0,1,   1,0,1,   0,0,0,   1,0,0,
            0,1,0,   1,1,0,   0,1,1,   1,1,1
          ], 
          texCoords: [
            1/256,31/256,    31/256,31/256,   1/256,1/256,   31/256,1/256,
            65/256,31/256,   95/256,31/256,   65/256,1/256,   95/256,1/256
          ], indices: [
            0,1,2,   1,3,2,
            4,5,6,   5,7,6
          ] 
        },

        { // 4 Wall of 0.3 height with floor
          vertices: [
            0,0,1,     1,0,1,     0,0.3,1,     1,0.3,1,
            1,0,0,     0,0,0,     1,0.3,0,     0,0.3,0,
            0,0,0,     0,0,1,     0,0.3,0,     0,0.3,1,
            1,0,1,     1,0,0,     1,0.3,1,     1,0.3,0,
            0,0.3,1,   1,0.3,1,   0,0.3,0,     1,0.3,0,
          ], 
          texCoords: [
            33/256,31/256,   63/256,31/256,   33/256,22/256,   63/256,22/256,
            33/256,31/256,   63/256,31/256,   33/256,22/256,   63/256,22/256,
            33/256,31/256,   63/256,31/256,   33/256,22/256,   63/256,22/256,
            33/256,31/256,   63/256,31/256,   33/256,22/256,   63/256,22/256,
            1/256,31/256,    31/256,31/256,   1/256,1/256,    31/256,1/256,
          ], indices: [
            0,1,2,    1,3,2,
            4,5,6,    5,7,6,
            8,9,10,   9,11,10,
            12,13,14, 13,15,14,
            16,17,18, 17,19,18
          ] 
        },

        { // Wall of 3 height with floor and ceiling
          vertices: [
            0,0,0,   1,0,0,   0,1,0,   1,1,0,
            0,1,0,   1,1,0,   0,2,0,   1,2,0,
            0,2,0,   1,2,0,   0,3,0,   1,3,0,
            0,0,1,   1,0,1,   0,0,0,   1,0,0,
            0,3,0,   1,3,0,   0,3,1,   1,3,1,
          ], 
          texCoords: [
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            1/256,31/256,    31/256,31/256,   1/256,1/256,    31/256,1/256,
            65/256,31/256,   95/256,31/256,   65/256,1/256,   95/256,1/256,
          ], indices: [
            0,1,2,   1,3,2,
            4,5,6,   5,7,6,
            8,9,10,  9,11,10,
            12,13,14, 13,15,14,
            16,17,18, 17,19,18
          ] 
        },

        { // Corner Wall of 3 height with floor and ceiling
          vertices: [
            0,0,0,   1,0,0,   0,1,0,   1,1,0,
            0,1,0,   1,1,0,   0,2,0,   1,2,0,
            0,2,0,   1,2,0,   0,3,0,   1,3,0,
            0,0,1,   0,0,0,   0,1,1,   0,1,0,
            0,1,1,   0,1,0,   0,2,1,   0,2,0,
            0,2,1,   0,2,0,   0,3,1,   0,3,0,
            0,0,1,   1,0,1,   0,0,0,   1,0,0,
            0,3,0,   1,3,0,   0,3,1,   1,3,1,
          ], 
          texCoords: [
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            1/256,31/256,    31/256,31/256,   1/256,1/256,    31/256,1/256,
            65/256,31/256,   95/256,31/256,   65/256,1/256,   95/256,1/256,
          ], indices: [
            0,1,2,   1,3,2,
            4,5,6,   5,7,6,
            8,9,10,  9,11,10,
            12,13,14, 13,15,14,
            16,17,18, 17,19,18,
            20,21,22, 21,23,22,
            24,25,26, 25,27,26,
            28,29,30, 29,31,30
          ] 
        },

        { // Wall of 2 height
          vertices: [
            0,0,0,   1,0,0,   0,1,0,   1,1,0,
            0,1,0,   1,1,0,   0,2,0,   1,2,0,
          ], 
          texCoords: [
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
            33/256,31/256,   63/256,31/256,   33/256,1/256,   63/256,1/256,
          ], indices: [
            0,1,2,   1,3,2,
            4,5,6,   5,7,6,
          ] 
        },

        { // floor and ceiling of 3 height
          vertices: [
            0,0,1,   1,0,1,   0,0,0,   1,0,0,
            0,3,0,   1,3,0,   0,3,1,   1,3,1
          ], 
          texCoords: [
            1/256,31/256,    31/256,31/256,   1/256,1/256,   31/256,1/256,
            65/256,31/256,   95/256,31/256,   65/256,1/256,   95/256,1/256
          ], indices: [
            0,1,2,   1,3,2,
            4,5,6,   5,7,6
          ] 
        }
      ],
      instances: [
        // Room 1
        { meshInd: 1, position: new Vector3(0,0,0), rotationY: 0},
        { meshInd: 0, position: new Vector3(1,0,0), rotationY: 0},
        { meshInd: 0, position: new Vector3(2,0,0), rotationY: 0},
        { meshInd: 0, position: new Vector3(3,0,0), rotationY: 0},
        { meshInd: 1, position: new Vector3(5,0,0), rotationY: 90},
        { meshInd: 0, position: new Vector3(5,0,1), rotationY: 90},
        { meshInd: 0, position: new Vector3(5,0,2), rotationY: 90},
        { meshInd: 0, position: new Vector3(5,0,3), rotationY: 90},
        { meshInd: 1, position: new Vector3(5,0,5), rotationY: 180},
        { meshInd: 0, position: new Vector3(4,0,5), rotationY: 180},
        { meshInd: 2, position: new Vector3(2,0,4), rotationY: 0},
        { meshInd: 0, position: new Vector3(2,0,5), rotationY: 180},
        { meshInd: 1, position: new Vector3(0,0,5), rotationY: 270},
        { meshInd: 0, position: new Vector3(0,0,4), rotationY: 270},
        { meshInd: 0, position: new Vector3(0,0,3), rotationY: 270},
        { meshInd: 0, position: new Vector3(0,0,2), rotationY: 270},
        { meshInd: 2, position: new Vector3(1,0,1), rotationY: 0},
        { meshInd: 2, position: new Vector3(2,0,1), rotationY: 0},
        { meshInd: 2, position: new Vector3(3,0,1), rotationY: 0},
        { meshInd: 2, position: new Vector3(1,0,2), rotationY: 0},
        { meshInd: 2, position: new Vector3(2,0,2), rotationY: 0},
        { meshInd: 2, position: new Vector3(3,0,2), rotationY: 0},
        { meshInd: 2, position: new Vector3(1,0,3), rotationY: 0},
        { meshInd: 2, position: new Vector3(2,0,3), rotationY: 0},
        { meshInd: 2, position: new Vector3(3,0,3), rotationY: 0},
        { meshInd: 3, position: new Vector3(0,0,4), rotationY: 0},
        { meshInd: 3, position: new Vector3(4,-0.1,2), rotationY: 0},
        { meshInd: 3, position: new Vector3(4,-0.1,3), rotationY: 0},
        // Room 2
        { meshInd: 0, position: new Vector3(3,0,5), rotationY: 90},
        { meshInd: 0, position: new Vector3(2,0,6), rotationY: 270},
        { meshInd: 4, position: new Vector3(3,0,6), rotationY: 90},
        { meshInd: 4, position: new Vector3(3,0,7), rotationY: 90},
        { meshInd: 4, position: new Vector3(3,0,8), rotationY: 90},
        { meshInd: 5, position: new Vector3(3,0,10), rotationY: 180},
        { meshInd: 5, position: new Vector3(1,0,6), rotationY: 0},
        { meshInd: 4, position: new Vector3(1,0,8), rotationY: 270},
        { meshInd: 4, position: new Vector3(1,0,9), rotationY: 270},
        { meshInd: 5, position: new Vector3(1,0,10), rotationY: 270},
        { meshInd: 4, position: new Vector3(1,0,10), rotationY: 270},
        { meshInd: 6, position: new Vector3(2,1,6), rotationY: 0},
      ],
      solidWalls: [
        // Room 1
        {x1:0,x2:1,y1:0,h1:1,y2:0,h2:1,z1:1,z2:0},
        {x1:1,x2:4,y1:0,h1:1,y2:0,h2:1,z1:0,z2:0},
        {x1:4,x2:5,y1:0,h1:1,y2:0,h2:1,z1:0,z2:1},
        {x1:5,x2:5,y1:0,h1:1,y2:0,h2:1,z1:1,z2:4},
        {x1:5,x2:4,y1:0,h1:1,y2:0,h2:1,z1:4,z2:5},
        {x1:4,x2:3,y1:0,h1:1,y2:0,h2:1,z1:5,z2:5},
        {x1:2,x2:1,y1:0,h1:1,y2:0,h2:1,z1:5,z2:5},
        {x1:1,x2:0,y1:0,h1:1,y2:0,h2:1,z1:5,z2:4},
        {x1:0,x2:0,y1:0,h1:1,y2:0,h2:1,z1:4,z2:1},
        {x1:1,x2:0,y1:0,h1:0.3,y2:0,h2:0.3,z1:4,z2:4},
        {x1:1,x2:1,y1:0,h1:0.3,y2:0,h2:0.3,z1:5,z2:4},
        {x1:5,x2:4,y1:0,h1:0.2,y2:0,h2:0.2,z1:2,z2:2},
        {x1:4,x2:4,y1:0,h1:0.2,y2:0,h2:0.2,z1:2,z2:4},
        {x1:4,x2:5,y1:0,h1:0.2,y2:0,h2:0.2,z1:4,z2:4},
        // Room 2
        {x1:3,x2:3,y1:0,h1:1,y2:0,h2:1,z1:5,z2:6},
        {x1:2,x2:2,y1:0,h1:1,y2:0,h2:1,z1:6,z2:5},
        {x1:3,x2:3,y1:0,h1:3,y2:0,h2:3,z1:6,z2:10},
        {x1:1,x2:1,y1:0,h1:3,y2:0,h2:3,z1:10,z2:6},
        {x1:3,x2:1,y1:0,h1:3,y2:0,h2:3,z1:10,z2:10},
        {x1:1,x2:2,y1:0,h1:3,y2:0,h2:3,z1:6,z2:6},
        {x1:2,x2:3,y1:1,h1:2,y2:1,h2:2,z1:6,z2:6},
      ]
    };
  }
}

window.onload = () => {
  new Game();
}
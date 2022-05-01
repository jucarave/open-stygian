import { Stygian } from '../../engine/Stygian';
import { Texture } from '../../engine/core/Texture';
import { DungeonGridGeometry } from '../../engine/dungeon/GridLevel/DungeonGridGeometry';
import { gridLevel } from './GridLevel';
import { SolidMap } from '../../engine/physics/SolidMap';
import { Vector3 } from '../../engine/math/Vector3';
import { MaterialDungeon } from '../../engine/materials/MaterialDungeon';

class Game {
  constructor() {
    const texture = new Texture('texture', 'img/texture.png')

    const canvas = document.getElementById('openStygianCanvas') as HTMLCanvasElement;
    
    const stygian = new Stygian(canvas);
    
    const material = new MaterialDungeon(texture);
    const map = gridLevel();
    const geometry = (new DungeonGridGeometry()).parseMap(map);
    const solidMap = new SolidMap();
    solidMap.parseGeometryMap({instances: [], meshes: [], solidPlanes: [{tl:new Vector3(0,0,0),tr:new Vector3(10,0,0),bl:new Vector3(0,0,10),br:new Vector3(10,0,10)}], solidWalls: [], texture: 'texture'})

    const level = stygian.loadLevel(geometry, material, solidMap);
    level.playerSetup
      .addSmoothMovement()
      .addKeyboardFirsPersonLook()
      .addMouseFirstPersonLook();

    stygian.play();
  }
}

window.onload = () => {
  new Game();
}
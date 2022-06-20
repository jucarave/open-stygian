import { Stygian } from '../../engine/Stygian';
import { Texture } from '../../engine/core/Texture';
import { DungeonGridGeometry } from '../../engine/dungeon/GridLevel/DungeonGridGeometry';
import { gridLevel } from './GridLevel';
import { MaterialDungeon } from '../../engine/materials/MaterialDungeon';
import { SolidGridMap } from '../../engine/physics/SolidGridMap';
import { SceneUI } from './scenes/SceneUI';
import { Font } from '../../engine/core/Font';

class Game {
  constructor() {
    const texture = new Texture('texture', 'img/texture.png')
    new Font('font', 'img/font.png', 'abcdefghijklmnñopqrstuvxyzáéíóúABCDEFGHIJKLMNÑOPQRSTUVXYZÁÉÍÓÚ0123456789!¡?¿()-=/', {x: 6, y: 9});

    const canvas = document.getElementById('openStygianCanvas') as HTMLCanvasElement;
    
    const stygian = new Stygian(canvas);
    
    const material = new MaterialDungeon(texture);
    const map = gridLevel();
    const geometry = (new DungeonGridGeometry()).parseMap(map);
    const solidMap = new SolidGridMap();
    solidMap.parseGridDungeon(map);

    const level = stygian.loadLevel(geometry, material, solidMap);
    level.playerSetup
      .addSmoothMovement()
      .addKeyboardFirsPersonLook()
      .addMouseFirstPersonLook();

    level.setUI(new SceneUI());

    stygian.play();
  }
}

window.onload = () => {
  new Game();
}
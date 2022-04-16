import { Entity } from '../../../engine/entities/Entity';
import { Geometry } from '../../../engine/geometries/Geometry';
import { VertexColoredMaterial } from '../materials/VertexColoredMaterial';

export class GridEntity extends Entity {
  constructor() {
    super();

    this._buildGeometry();
    this.material = new VertexColoredMaterial();
  }

  /**
   * Creates a grid geometry to be rendered using
   * gl.LINES, the position 0,0,0 are colored to separate
   * the axis and every 10 lines the line is drawed
   * brighter
   */
  private _buildGeometry() {
    this.geometry = new Geometry();

    // Axis colors
    this.geometry
      // X
        .addVertice(0,0,0).addColor(0,0,1,1)
        .addVertice(0,0,1000).addColor(0,0,1,1)
      // Y
        .addVertice(0,0,0).addColor(0,1,0,1)
        .addVertice(0,1000,0).addColor(0,1,0,1)
      // Z
        .addVertice(0,0,0).addColor(1,0,0,1)
        .addVertice(1000,0,0).addColor(1,0,0,1);

    for (let i=1;i<=100;i++) {
      const color = (i % 10 === 0) ? [1,1,1,1] : [0.5,0.5,0.5,1];
      
      this.geometry
        .addVertice(i,0,0).addColor(color[0], color[1], color[2], color[3])
        .addVertice(i,0,100).addColor(color[0], color[1], color[2], color[3])
        .addVertice(0,0,i).addColor(color[0], color[1], color[2], color[3])
        .addVertice(100,0,i).addColor(color[0], color[1], color[2], color[3]);
    }

    this.geometry.build();
  }
}
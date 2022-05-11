import { Cube } from '../math/Cube';
import { Vector3 } from '../math/Vector3';
import { Config } from '../system/Config';
import { SolidPlane } from './SolidPlane';
import { SolidWall } from './SolidWall';

export abstract class SolidMap {
  protected _walls: SolidWall[];
  protected _planes: SolidPlane[];

  public abstract getOverlappingWalls(cube: Cube): SolidWall[];
  public abstract getOverlappingPlanes(position: Vector3, radius: number): SolidPlane[];
  
  

  /**
   * Returns the highest plane at a circled area
   * 
   * @param position center of the circle
   * @param radius 
   * @returns Maximum y or -10
   */
   public getHighestPlane(position: Vector3, radius: number) {
    const planes = this.getOverlappingPlanes(position, radius);
    let y = -10;
    planes.forEach((plane: SolidPlane) => {
      const planeY = Math.max(y, plane.getYAtPoint(position, radius));

      if (planeY <= position.y + Config.slopeHeight) {
        y = Math.max(planeY, y);
      }
    });

    return y;
  }

  /**
   * Returns the lowest plane at a cylinder
   * 
   * @param position bottom center of the cylinder
   * @param height 
   * @param radius 
   * @returns 
   */
  public getLowestPlane(position: Vector3, height: number, radius: number) {
    const planes = this.getOverlappingPlanes(position, radius);
    let y = 100000;
    planes.forEach((plane: SolidPlane) => {
      const planeY = Math.min(y, plane.getYAtPoint(position, radius));

      if (planeY > position.y + height) {
        y = Math.min(planeY, y);
      }
    });

    return y;
  }
}
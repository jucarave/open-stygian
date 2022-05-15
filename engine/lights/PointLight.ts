import { Vector3 } from '../math/Vector3';

export class PointLight {
  public position: Vector3;
  public color: number[];
  public radius: number;

  constructor(position: Vector3, color: number[], radius: number) {
    this.position = position;
    this.color = color;
    this.radius = radius;
  }
}
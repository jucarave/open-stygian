import { Vector3 } from './math/Vector3';

export interface Wall {
  x1: number;
  y1: number;
  h1: number;
  z1: number;
  x2: number;
  y2: number;
  h2: number;
  z2: number;
}

export interface Floor {
  tl: Vector3;
  tr: Vector3;
  bl: Vector3;
  br: Vector3;
}
export interface Mesh {
  vertices: number[];
  texCoords: number[]
  indices: number[];
}

export interface MeshInstance {
  meshInd: number;
  position: Vector3;
  rotationY: number;
}

export interface DungeonMap {
  texture: string;
  meshes: Mesh[];
  instances: MeshInstance[];
  solidWalls: Wall[];
  solidFloors: Floor[];
}
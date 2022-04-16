import { Geometry } from './geometries/Geometry';
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

export interface Plane {
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
  solidPlanes: Plane[];
}

export function createGeometryFromMesh(mesh: Mesh) {
  const geometry = new Geometry();
  const vertexLength = mesh.vertices.length / 3;

  for (let i=0;i<vertexLength;i++) {
    const vx = mesh.vertices[i * 3];
    const vy = mesh.vertices[i * 3 + 1];
    const vz = mesh.vertices[i * 3 + 2];
    const tu = mesh.texCoords[i * 2];
    const tv = mesh.texCoords[i * 2 + 1];

    geometry.addVertice(vx, vy, vz).addTexCoord(tu, 1 - tv);
  }

  for (let i=0;i<mesh.indices.length;i+=3) {
    geometry.addTriangle(mesh.indices[i], mesh.indices[i + 1], mesh.indices[i + 2]);
  }

  geometry.build();

  return geometry;
}
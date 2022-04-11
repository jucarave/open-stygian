import { DungeonMap, MeshInstance } from '../DungeonMap';
import { degToRad } from '../math/Math';
import { Quaternion } from '../math/Quaternion';
import { Vector3 } from '../math/Vector3';
import { TEXCOORD_SIZE, VERTICE_SIZE } from '../system/Constants';
import { Geometry } from './Geometry';

export class DungeonBuilder extends Geometry {
  private _parseWalls(dungeon: DungeonMap) {
    dungeon.instances.forEach((instance: MeshInstance) => {
      const mesh = dungeon.meshes[instance.meshInd];
      const vertexLength = mesh.vertices.length / 3;
      const ind = this.trianglesLength;

      for (let i=0;i<vertexLength;i++) {
        const vertex = new Vector3(
          mesh.vertices[i * 3],
          mesh.vertices[i * 3 + 1],
          mesh.vertices[i * 3 + 2]);

        vertex.rotateOnQuaternion(Quaternion.createRotationOnAxis(degToRad(instance.rotationY), Vector3.up));
        vertex.sum(instance.position);
        
        const tx = mesh.texCoords[i * 2];
        const ty = 1 - mesh.texCoords[i * 2 + 1];

        this.addVertice(vertex.x, vertex.y, vertex.z)
          .addTexCoord(tx, ty);
      }
      
      for (let i=0;i<mesh.indices.length;i+=3) {
        this.addTriangle(ind + mesh.indices[i], ind + mesh.indices[i + 1], ind + mesh.indices[i + 2]);
      }
    });
  }

  public parseMap(dungeon: DungeonMap) {
    this._parseWalls(dungeon);
  }

  public get trianglesLength() {
    return this.vertexLength / (TEXCOORD_SIZE + VERTICE_SIZE);
  }
}
import { Mesh } from '../../../engine/DungeonMap';

export class GeometryLoader {
  private _parseOBJFile(lines: string[]) {
    const mesh: Mesh = {
      vertices: [],
      texCoords: [],
      indices: []
    };

    const vertices: number[][] = [];
    const texCoords: number[][] = [];
    const faces: string[][] = [];

    lines.forEach((line: string) => {
      const params = line.split(/ /g);

      if (params[0] === 'v') {
        vertices.push([parseFloat(params[1]), parseFloat(params[2]), parseFloat(params[3])]);
      } else if (params[0] === 'vt') {
        texCoords.push([parseFloat(params[1]), 1-parseFloat(params[2])]);
      } else if (params[0] === 'f') {
        faces.push([params[1], params[2], params[3]]);
      }
    });

    let ind = 0;
    faces.forEach((face: string[]) => {
      const v1 = vertices[parseInt(face[0].split(/\//g)[0]) - 1];
      const v2 = vertices[parseInt(face[1].split(/\//g)[0]) - 1];
      const v3 = vertices[parseInt(face[2].split(/\//g)[0]) - 1];

      const t1 = texCoords[parseInt(face[0].split(/\//g)[1]) - 1];
      const t2 = texCoords[parseInt(face[1].split(/\//g)[1]) - 1];
      const t3 = texCoords[parseInt(face[2].split(/\//g)[1]) - 1];

      mesh.vertices.push(...v1, ...v2, ...v3);
      mesh.texCoords.push(...t1, ...t2, ...t3);
      mesh.indices.push(ind, ind + 1, ind + 2);

      ind += 3;
    });

    return mesh;
  }

  public async loadOBJ(file: File) {
    const mesh: Mesh = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fileContent = e.target.result.toString();
        const lines = fileContent.split(/\r?\n/g);

        resolve(this._parseOBJFile(lines));
      };
    });
    
    return mesh;
  }
}
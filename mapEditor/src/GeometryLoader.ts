import { Geometry } from '../../engine/geometries/Geometry';

export class GeometryLoader {
  private _parseOBJFile(lines: string[]) {
    const geometry = new Geometry();
    const vertices: number[][] = [];
    const texCoords: number[][] = [];
    const faces: string[][] = [];

    lines.forEach((line: string) => {
      const params = line.split(/ /g);

      if (params[0] === 'v') {
        vertices.push([parseFloat(params[1]), parseFloat(params[2]), parseFloat(params[3])]);
      } else if (params[0] === 'vt') {
        texCoords.push([parseFloat(params[1]), parseFloat(params[2])]);
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

      geometry.addVertice(v1[0], v1[1], v1[2]).addTexCoord(t1[0], t1[1])
        .addVertice(v2[0], v2[1], v2[2]).addTexCoord(t2[0], t2[1])
        .addVertice(v3[0], v3[1], v3[2]).addTexCoord(t3[0], t3[1])
        .addTriangle(ind, ind + 1, ind + 2);

      ind += 3;
    });

    return geometry;
  }

  public async loadOBJ(file: File) {
    const geometry: Geometry = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fileContent = e.target.result.toString();
        const lines = fileContent.split(/\r?\n/g);

        resolve(this._parseOBJFile(lines));
      };
    });
    
    return geometry;
  }
}
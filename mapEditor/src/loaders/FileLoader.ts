import { Texture } from '../../../engine/core/Texture';
import { Mesh } from '../../../engine/DungeonMap';
import { GeometryLoader } from './GeometryLoader';

export type LoadedMesh = {
  name: string;
  mesh: Mesh;
}

export class FileLoader {
  private _geometryLoader: GeometryLoader;

  constructor() {
    this._geometryLoader = new GeometryLoader();
  }

  public async loadGeometry(evt: Event) {
    const files = (evt.target as HTMLInputElement).files;
    const meshes: LoadedMesh[] = [];
    for (let i=0;i<files.length;i++) {
      const file = files[i];
      const extension = file.name.substring(file.name.indexOf('.') + 1);

      switch (extension) {
        case 'obj': 
          meshes.push({
            name: file.name,
            mesh: await this._geometryLoader.loadOBJ(file)
          });
          break;

        default: 
          throw new Error(`Unsupported file extension ${extension}`);
      }
    }

    return meshes;
  }

  public loadTexture(evt: Event) {
    return new Promise((resolve) => {
      const file = (evt.target as HTMLInputElement).files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        resolve(new Texture(file.name, e.target.result.toString()))
      };
    })
  }
}
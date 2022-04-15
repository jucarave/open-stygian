import { Geometry } from '../../engine/geometries/Geometry';
import { GeometryLoader } from './GeometryLoader';

interface LoadedGeometry {
  name: string;
  geometry: Geometry;
  element: HTMLDivElement;
}

class MapEditor {
  private _geometryLoader: GeometryLoader;
  private _geometries: LoadedGeometry[];
  private _selectedGeometry: Geometry;

  constructor() {
    document.getElementById('geometryFileInput').addEventListener('change', (evt: Event) => { this._loadGeometry(evt); });

    this._geometries = [];
    this._geometryLoader = new GeometryLoader();
    this._selectedGeometry; // TODO: Delete
  }

  private _addGeometryToList(name: string, geometry: Geometry) {
    const element = document.createElement('div');
    element.className = 'geometryElement';
    element.innerHTML = name;

    element.addEventListener('click', () => {
      document.getElementsByClassName('selected')[0]?.classList.remove('selected');

      element.classList.add('selected');
      this._selectedGeometry = geometry;
    });

    document.getElementById('geometryList').appendChild(element);

    return element;
  }

  private async _loadGeometry(evt: Event) {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      throw new Error('File loading is not supported in the current browser');
    }

    const files = (evt.target as HTMLInputElement).files;
    for (let i=0;i<files.length;i++) {
      const file = files[i];
      const extension = file.name.substring(file.name.indexOf('.') + 1);
      let geometry;

      switch (extension) {
        case 'obj': 
          geometry = await this._geometryLoader.loadOBJ(file);
          this._geometries.push({
            name: file.name,
            geometry: geometry,
            element: this._addGeometryToList(file.name, geometry)
          }); 
          break;

        default: throw new Error(`Unsupported file extension ${extension}`);
      }
    }
  }
}

window.onload = () => {
  new MapEditor();
};
import { Mesh } from '../../engine/DungeonMap';

export class DOMBuilder {
  private _selectedMesh: Mesh;

  public addGeometryToList(name: string, mesh: Mesh) {
    const element = document.createElement('div');
    element.className = 'geometryElement';
    element.innerHTML = name;

    // Select the geometry for painting with it
    element.addEventListener('click', () => {
      document.getElementsByClassName('selected')[0]?.classList.remove('selected');

      if (mesh !== this._selectedMesh) {
        element.classList.add('selected');
        this._selectedMesh = mesh;
      } else {
        this._selectedMesh = null;
      }
    });

    document.getElementById('geometryList').appendChild(element);

    return element;
  }
}
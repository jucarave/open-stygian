import { Camera } from '../../engine/core/Camera';
import { Renderer } from '../../engine/core/Renderer';
import { Texture } from '../../engine/core/Texture';
import { createGeometryFromMesh, DungeonMap, Mesh } from '../../engine/DungeonMap';
import { Entity } from '../../engine/entities/Entity';
import { Geometry } from '../../engine/geometries/Geometry';
import { MaterialDungeon } from '../../engine/materials/MaterialDungeon';
import { Scene } from '../../engine/scenes/Scene';
import { Stygian } from '../../engine/Stygian';
import { DOMBuilder } from './DOMBuilder';
import { FlyingCamera } from './entities/FlyingCamera';
import { GridEntity } from './entities/GridEntity';
import { FileLoader, LoadedMesh } from './loaders/FileLoader';
import { VertexColoredShader } from './shaders/VertexColoredShader';

interface MeshData {
  name: string;
  mesh: Mesh;
  geometry: Geometry;
  element: HTMLDivElement;
}

class MapEditor {
  private _canvas: HTMLCanvasElement;
  private _stygian: Stygian;
  private _fileLoader: FileLoader;
  private _geometries: MeshData[];
  private _selectedMesh: Mesh;
  private _scene: Scene;
  private _map: DungeonMap;
  private _DOMBuilder: DOMBuilder;

  constructor() {
    document.getElementById('geometryFileInput').addEventListener('change', (e: Event) => { this._loadGeometry(e); });
    document.getElementById('textureFileInput').addEventListener('change', (e: Event) => { this._loadTexture(e); });

    this._geometries = [];
    this._fileLoader = new FileLoader();
    this._DOMBuilder = new DOMBuilder();

    // TODO: Delete
    this._selectedMesh;

    this._initMap();
    this._initCanvas();
    this._initScene();
    this._initGrid();
    this._stygian.play();
  }

  private _initMap() {
    this._map = {
      texture: '',
      meshes: [],
      instances: [],
      solidPlanes: [],
      solidWalls: []
    };
  }

  private _initGrid() {
    Renderer.instance.loadShader('VERTEX_COLORED', VertexColoredShader);
    this._scene.addEntity(new GridEntity());
  }

  private _initCanvas() {
    this._canvas = document.getElementById('mapEditor') as HTMLCanvasElement;
    this._stygian = new Stygian(this._canvas);
  }

  private _initScene() {
    this._scene = new Scene();
    this._scene.camera = Camera.createPerspective(60, this._canvas.width / this._canvas.height, 0.1, 1000);

    const flyingCamera = new FlyingCamera(this._scene.camera);
    const camera = new Entity();
    camera.position.set(20,10,20);
    camera.addComponent(flyingCamera);
    this._scene.addEntity(camera);

    this._stygian.loadScene(this._scene);
  }

  private async _loadGeometry(e: Event) {
    const meshes = await this._fileLoader.loadGeometry(e);
    meshes.forEach((loaded: LoadedMesh) => {
      this._geometries.push({
        name: loaded.name,
        mesh: loaded.mesh,
        geometry: createGeometryFromMesh(loaded.mesh),
        element: this._DOMBuilder.addGeometryToList(loaded.name, loaded.mesh)
      });

      // TODO: Delete
      const entity = new Entity();
      entity.geometry = this._geometries[this._geometries.length - 1].geometry;
      entity.material = new MaterialDungeon(Texture.getTexture(this._map.texture));

      this._scene.addEntity(entity);
    })
  }

  private async _loadTexture(e: Event) {
    this._map.texture = (await this._fileLoader.loadTexture(e) as Texture).key;
  }
}

window.onload = () => {
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    throw new Error('File loading is not supported in the current browser');
  }
  
  new MapEditor();
};
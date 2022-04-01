import { Camera } from 'engine/Camera';
import { Geometry } from 'engine/geometries/Geometry';

export abstract class Material {
    public abstract render(camera: Camera, geometry: Geometry): void;
}
import { Geometry } from 'engine/geometries/Geometry';

export abstract class Material {
    public abstract render(geometry: Geometry): void;
}
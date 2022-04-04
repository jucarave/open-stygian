import { Camera } from '../Camera';
import { Entity } from '../entities/Entity';
import { Geometry } from '../geometries/Geometry';

export abstract class Material {
    public abstract render(entity: Entity, camera: Camera, geometry: Geometry): void;
}
import { Camera } from 'engine/Camera';
import { Entity } from 'engine/entities/Entity';
import { Geometry } from 'engine/geometries/Geometry';

export abstract class Material {
    public abstract render(entity: Entity, camera: Camera, geometry: Geometry): void;
}
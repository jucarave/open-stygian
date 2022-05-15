import { Camera } from '../core/Camera';
import { Entity } from '../entities/Entity';
import { Geometry } from '../geometries/Geometry';
import { Scene } from '../scenes/Scene';

export abstract class Material {
    public abstract render(scene: Scene, entity: Entity, camera: Camera, geometry: Geometry): void;
}
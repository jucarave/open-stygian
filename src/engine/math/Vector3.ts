import { Signal } from 'engine/system/Signal';
import { Quaternion } from './Quaternion';

export class Vector3 {
  private _x: number;
  private _y: number;
  private _z: number;

  public readonly onChange: Signal<void>;

  constructor(x: number, y: number, z: number) {
    this.onChange = new Signal();

    this.set(x, y, z);
  }

  public set(x: number, y: number, z: number): Vector3 {
    this._x = x;
    this._y = y;
    this._z = z;

    this.onChange.dispatch();

    return this;
  }

  public normalize(): Vector3 {
    const l = this.length;

    this._x /= l;
    this._y /= l;
    this._z /= l;

    return this;
  }

  public sum(vector: Vector3): Vector3 {
    this._x += vector.x;
    this._y += vector.y;
    this._z += vector.z;

    this.onChange.dispatch();

    return this;
  }

  public multiply(vector: Vector3): Vector3 {
    this._x *= vector.x;
    this._y *= vector.y;
    this._z *= vector.z;

    this.onChange.dispatch();

    return this;
  }

  public multiplyScalar(scalar: number): Vector3 {
    this._x *= scalar;
    this._y *= scalar;
    this._z *= scalar;

    this.onChange.dispatch();

    return this;
  }

  public clone(): Vector3 {
    return new Vector3(this._x, this._y, this._z);
  }

  public copy(vector: Vector3): Vector3 {
    this.set(vector.x, vector.y, vector.z);

    this.onChange.dispatch();

    return this;
  }

  public rotateOnQuaternion(quaternion: Quaternion): Vector3 {
    const q = quaternion.clone(),
      qInv = q.inverse,
      
      p = new Quaternion(0, this);

    qInv.multiplyQuaternion(p).multiplyQuaternion(q);

    this.copy(qInv.imaginary);

    return this;
  }

  public static cross(vectorA: Vector3, vectorB: Vector3): Vector3 {
    return new Vector3(
      vectorA.y * vectorB.z - vectorA.z * vectorB.y,
      vectorA.z * vectorB.x - vectorA.x * vectorB.z,
      vectorA.x * vectorB.y - vectorA.y * vectorB.x
    );
  }

  public static dot(vectorA: Vector3, vectorB: Vector3): number {
    return vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z;
  }

  public get x(): number {
    return this._x;
  }

  public set x(x: number) {
    this._x = x;

    this.onChange.dispatch();
  }

  public get y(): number {
    return this._y;
  }

  public set y(y: number) {
    this._y = y;

    this.onChange.dispatch();
  }

  public get z(): number {
    return this._z;
  }

  public set z(z: number) {
    this._z = z;

    this.onChange.dispatch();
  }

  public get length(): number {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
  }

  public static get zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  public static get up(): Vector3 { 
    return new Vector3(0, 1, 0);
  }

  public static get down(): Vector3 { 
    return new Vector3(0, -1, 0);
  }

  public static get left(): Vector3 { 
    return new Vector3(-1, 0, 0);
  }

  public static get right(): Vector3 { 
    return new Vector3(1, 0, 0);
  }

  public static get forward(): Vector3 { 
    return new Vector3(0, 0, 1);
  }

  public static get back(): Vector3 { 
    return new Vector3(0, 0, -1);
  }
}
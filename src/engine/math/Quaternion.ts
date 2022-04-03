import { Vector3 } from './Vector3';
import { Matrix4 } from './Matrix4';
import { Signal } from 'engine/system/Signal';

export class Quaternion {
  private _s: number;
  private _imaginary: Vector3;
  private _axisX: Vector3;
  private _axisY: Vector3;
  private _axisZ: Vector3;
  
  public readonly onChange: Signal<void>;
  public local: boolean;

  constructor(scalar = 1, imaginary: Vector3 = new Vector3(0, 0, 0)) {
    this._s = scalar;
    this._imaginary = imaginary;

    this._axisX = Vector3.right;
    this._axisY = Vector3.up;
    this._axisZ = Vector3.forward;

    this.onChange = new Signal();

    this.local = false;
  }

  public copy(q: Quaternion): Quaternion {
    this._s = q.s;
    this._imaginary.copy(q.imaginary);

    return this;
  }

  public sum(q: Quaternion): Quaternion {
    this._s += q.s;
    this._imaginary.sum(q.imaginary);

    this.onChange.dispatch();

    return this;
  }

  public multiplyScalar(s: number): Quaternion {
    this._s *= s;
    this._imaginary.multiplyScalar(s);

    this.onChange.dispatch();

    return this;
  }

  public multiplyQuaternion(q: Quaternion): Quaternion {
    const sA = this.s,
      sB = q.s,
      
      imaginaryB = q.imaginary.clone(),
      
      cross = Vector3.cross(this.imaginary, q.imaginary);

    this._s = sA * sB - Vector3.dot(this._imaginary, imaginaryB);

    this._imaginary.multiplyScalar(sB)
      .sum(imaginaryB.multiplyScalar(sA))
      .sum(cross);

    this.onChange.dispatch();

    return this;
  }

  public normalize(): Quaternion {
    const norm = this.norm;
    if (norm != 0) {
      this.multiplyScalar(1 / this.norm);
    }

    this.onChange.dispatch();

    return this;
  }

  public setEuler(x: number, y: number, z: number) {
    this.setIdentity()
      .rotateX(x)
      .rotateY(y)
      .rotateZ(z);
  }

  public rotateX(radians: number): Quaternion {
    const axis = (this.local) ? this._axisX : Vector3.right,
      rotation = Quaternion.createRotationOnAxis(radians, axis);

    this.multiplyQuaternion(rotation);

    if (this.local) {
      this._axisY.rotateOnQuaternion(rotation).normalize();
      this._axisZ.rotateOnQuaternion(rotation).normalize();
    }

    return this;
  }

  public rotateY(radians: number): Quaternion {
    const axis = (this.local) ? this._axisY : Vector3.down,
      rotation = Quaternion.createRotationOnAxis(radians, axis);

    this.multiplyQuaternion(rotation);

    if (this.local) {
      this._axisX.rotateOnQuaternion(rotation).normalize();
      this._axisZ.rotateOnQuaternion(rotation).normalize();
    }

    return this;
  }

  public rotateZ(radians: number): Quaternion {
    const axis = (this.local) ? this._axisZ : Vector3.back,
      rotation = Quaternion.createRotationOnAxis(radians, axis);

    this.multiplyQuaternion(rotation);

    if (this.local) {
      this._axisX.rotateOnQuaternion(rotation).normalize();
      this._axisY.rotateOnQuaternion(rotation).normalize();
    }

    return this;
  }

  public getRotationMatrix(): Matrix4 {
    const ret = Matrix4.createIdentity(),
    
      qx = this._imaginary.x,
      qy = this._imaginary.y,
      qz = this._imaginary.z,
      qw = this._s,
      
      m11 = 1 - 2*qy*qy - 2*qz*qz,        m12 = 2*qx*qy - 2*qz*qw,        m13 = 2*qx*qz + 2*qy*qw,
      m21 = 2*qx*qy + 2*qz*qw,            m22 = 1 - 2*qx*qx - 2*qz*qz,    m23 = 2*qy*qz - 2*qx*qw,
      m31 = 2*qx*qz - 2*qy*qw,            m32 = 2*qy*qz + 2*qx*qw,        m33 = 1 - 2*qx*qx - 2*qy*qy;

    ret.set(
      m11, m12, m13, 0,
      m21, m22, m23, 0,
      m31, m32, m33, 0,
        0,   0,   0, 1
    );

    return ret;
  }

  public setIdentity(): Quaternion {
    this._s = 1;
    this._imaginary.set(0, 0, 0);

    this._axisX.copy(Vector3.right);
    this._axisY.copy(Vector3.up);
    this._axisZ.copy(Vector3.forward);

    this.onChange.dispatch();

    return this;
  }
  
  public lookToDirection(direction: Vector3): void {
    const directionNormal = direction.clone().normalize();

    const pitch = Math.asin(directionNormal.y);
    const yaw = Math.atan2(-directionNormal.z, directionNormal.x);

    this.setIdentity();

    this.rotateY(yaw-Math.PI/2);
    this.rotateX(-pitch);
  }

  public clone(): Quaternion {
    return new Quaternion(this._s, this._imaginary.clone());
  }

  public get norm(): number {
    const s2 = this._s * this._s,
      v2 = Vector3.dot(this._imaginary, this._imaginary);

    return Math.sqrt(s2 + v2);
  }

  public get conjugate(): Quaternion {
    return new Quaternion(this._s, this._imaginary.clone().multiplyScalar(-1));
  }

  public get inverse(): Quaternion {
    const norm = this.norm;
    return this.conjugate.multiplyScalar( 1 / (norm * norm));
  }

  public get s(): number { 
    return this._s; 
  }

  public set s(s: number) {
    this._s = s;
    this.onChange.dispatch();
  }

  public get imaginary(): Vector3 { 
    return this._imaginary; 
  }

  public static createRotationOnAxis(radians: number, axis: Vector3): Quaternion {
    const angle = radians * 0.5,
      ret = new Quaternion(radians, axis.clone().normalize());

    ret.s = Math.cos(angle);
    ret.imaginary.multiplyScalar(Math.sin(angle));

    return ret;
  }

  public static createIdentity() {
    return new Quaternion(1, new Vector3(0, 0, 0));
  }
}
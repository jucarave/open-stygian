import { degToRad } from './Math';

const MATRIX_LENGTH = 16;

export class Matrix4 {
  public data: Array<number>;

  public static helper: Matrix4 = Matrix4.createIdentity();

  constructor(...values: Array<number>) {
    if (values.length !== MATRIX_LENGTH) {
      throw new Error(`Matrix4 needs ${MATRIX_LENGTH} values`);
    }

    this.data = new Array(MATRIX_LENGTH);

    this.set(...values);
  }

  public set(...values: Array<number>): Matrix4 {
    for (let i = 0; i < MATRIX_LENGTH; i++) {
      this.data[i] = values[i];
    }

    return this;
  }

  public copy(matrix4: Matrix4): Matrix4 {
    return this.set(...matrix4.data);
  }

  public translate(x: number, y: number, z: number, relative = false): Matrix4 {
    if (relative) {
      this.data[12] += x;
      this.data[13] += y;
      this.data[14] += z;
    } else {
      this.data[12] = x;
      this.data[13] = y;
      this.data[14] = z;
    }

    return this;
  }

  public scale(x: number, y: number, z: number): Matrix4 {
    this.data[0] *= x;
    this.data[5] *= y;
    this.data[10] *= z;

    return this;
  }

  public setIdentity(): Matrix4 {
    return this.set(
      1, 0, 0, 0, 
      0, 1, 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1
    );
  }

  public setRotationX(degrees: number): Matrix4 {
    const R = degToRad(degrees),
      C = Math.cos(R),
      S = Math.sin(R);

    return this.set(
      1, 0, 0, 0,
      0, C, S, 0,
      0,-S, C, 0,
      0, 0, 0, 1
    );
  }

  public setRotationY(degrees: number): Matrix4 {
    const R = degToRad(degrees),
      C = Math.cos(R),
      S = Math.sin(R);

    return this.set(
       C, 0, S, 0,
       0, 1, 0, 0,
      -S, 0, C, 0,
       0, 0, 0, 1
    );
  }

  public setRotationZ(degrees: number): Matrix4 {
    const R = degToRad(degrees),
      C = Math.cos(R),
      S = Math.sin(R);

    return this.set(
       C, S, 0, 0,
      -S, C, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1
    );
  }

  private _vector4Dot(A: Array<number>, B: Array<number>): number {
    return A[0] * B[0] + A[1] * B[1] + A[2] * B[2] + A[3] * B[3];
  }

  public multiply(matrixB: Matrix4): Matrix4 {
    let T: Array<number> = matrixB.data;

    const C1 = [T[0], T[4], T[8], T[12]];
    const C2 = [T[1], T[5], T[9], T[13]];
    const C3 = [T[2], T[6], T[10], T[14]];
    const C4 = [T[3], T[7], T[11], T[15]];

    T = this.data;
    const R1 = [T[0], T[1], T[2], T[3]];
    const R2 = [T[4], T[5], T[6], T[7]];
    const R3 = [T[8], T[9], T[10], T[11]];
    const R4 = [T[12], T[13], T[14], T[15]];

    return this.set(
      this._vector4Dot(R1, C1),
      this._vector4Dot(R1, C2),
      this._vector4Dot(R1, C3),
      this._vector4Dot(R1, C4),

      this._vector4Dot(R2, C1),
      this._vector4Dot(R2, C2),
      this._vector4Dot(R2, C3),
      this._vector4Dot(R2, C4),

      this._vector4Dot(R3, C1),
      this._vector4Dot(R3, C2),
      this._vector4Dot(R3, C3),
      this._vector4Dot(R3, C4),

      this._vector4Dot(R4, C1),
      this._vector4Dot(R4, C2),
      this._vector4Dot(R4, C3),
      this._vector4Dot(R4, C4)
    );
  }

  public clone(): Matrix4 {
    return Matrix4.createIdentity().copy(this);
  }

  public static createIdentity(): Matrix4 {
    return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }

  public static createPerspective(fov: number, ratio: number, znear: number, zfar: number): Matrix4 {
    const S = 1 / Math.tan(degToRad(fov) / 2),
      R = S * ratio,
      A = -zfar / (zfar - znear),
      B = -(zfar * znear) / (zfar - znear);

    return new Matrix4(
        S, 0, 0, 0, 
        0, R, 0, 0, 
        0, 0, A, -1, 
        0, 0, B, 0
    );
  }
}
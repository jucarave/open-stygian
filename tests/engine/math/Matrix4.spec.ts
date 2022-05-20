import { expect } from 'chai';
import 'mocha';
import { degToRad } from '../../../engine/math/Math';
import { Matrix4 } from '../../../engine/math/Matrix4';

describe('Matrix4 class', () => {
  it('Creates a class with the given values', () => {
    const matrix = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

    expect(matrix.data).to.deep.equal([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
  });

  it('Throws an error if not enough parameters are supplied', () => {
    expect((() => { new Matrix4(1); }).bind(this)).to.throw('Matrix4 needs 16 values');
    expect((() => { new Matrix4(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16); }).bind(this)).to.not.throw();
  });

  it('Can set the values', () => {
    const matrix = new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    matrix.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

    expect(matrix.data).to.deep.equal([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
  });

  it('Can copy the values from another Matrix4', () => {
    const matrixA = new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    const matrixB = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

    expect(matrixA.copy(matrixB)).to.eql(matrixA);
    expect(matrixA === matrixB).to.be.false;
    expect(matrixA.data).to.deep.equal([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
  });

  it('Can be translated', () => {
    const matrix = new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    
    expect(matrix.translate(5, 20, 33)).to.eql(matrix);
    expect(matrix.data).to.deep.equal([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 20, 33, 1]);

    expect(matrix.translate(5, 20, 33, true)).to.eql(matrix);
    expect(matrix.data).to.deep.equal([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 40, 66, 1]);
  });

  it('Can be scaled', () => {
    const matrix = new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

    expect(matrix.scale(4, 5, 6)).to.eql(matrix);
    expect(matrix.data).to.deep.equal([4, 0, 0, 0, 0, 5, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1]);
  });

  it('Can be returned to an identity matrix', () => {
    const matrix = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

    expect(matrix.setIdentity()).to.eql(matrix);
    expect(matrix.data).to.deep.equal([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  });

  it('Can be rotated along the X Axis', () => {
    const matrix = Matrix4.createIdentity();
    const angle = degToRad(60);
    const C = Math.cos(angle);
    const S = Math.sin(angle);
    const data = [
      1, 0, 0, 0,
      0, C, S, 0,
      0,-S, C, 0,
      0, 0, 0, 1
    ];

    expect(matrix.setRotationX(60)).to.eql(matrix);
    expect(matrix.data).to.deep.equal(data);
  });

  it('Can be rotated along the Y Axis', () => {
    const matrix = Matrix4.createIdentity();
    const angle = degToRad(60);
    const C = Math.cos(angle);
    const S = Math.sin(angle);
    const data = [
       C, 0, S, 0,
       0, 1, 0, 0,
      -S, 0, C, 0,
       0, 0, 0, 1
    ];

    expect(matrix.setRotationY(60)).to.eql(matrix);
    expect(matrix.data).to.deep.equal(data);
  });

  it('Can be rotated along the Z Axis', () => {
    const matrix = Matrix4.createIdentity();
    const angle = degToRad(60);
    const C = Math.cos(angle);
    const S = Math.sin(angle);
    const data = [
       C, S, 0, 0,
      -S, C, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1
    ];

    expect(matrix.setRotationZ(60)).to.eql(matrix);
    expect(matrix.data).to.deep.equal(data);
  });

  it('Can multiply two matrices to combine rotations', () => {
    const matrixA = Matrix4.createIdentity();
    const matrixB = Matrix4.createIdentity();

    matrixA.setRotationY(60);
    matrixB.setRotationX(60);

    expect(matrixA.multiply(matrixB)).to.eql(matrixA);
    expect(matrixA.data).to.deep.equal([
      0.5000000000000003, -0.7499999999999997, 0.4330127018922195, 0, 
      0, 0.5000000000000003, 0.8660254037844385, 0, 
      -0.8660254037844385, -0.4330127018922195, 0.25000000000000033, 0, 
      0, 0, 0, 1
    ]);
  });

  it('Can be cloned', () => {
    const matrixA = new Matrix4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
    const matrixB = matrixA.clone();

    expect(matrixA === matrixB).to.be.false;
    expect(matrixA.data).to.deep.equal(matrixB.data);
  });

  it('Can create an identity matrix', () => {
    const matrix = Matrix4.createIdentity();

    expect(matrix.data).to.deep.equal([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  });

  it('Can create a perspective matrix', () => {
    const fov = 60;
    const ratio = 1920 / 1080;
    const znear = 0.1;
    const zfar = 1000;
    const S = 1 / Math.tan(degToRad(fov) / 2);
    const R = S * ratio;
    const A = -zfar / (zfar - znear);
    const B = -(zfar * znear) / (zfar - znear);
    const data = [
        S, 0, 0, 0, 
        0, R, 0, 0, 
        0, 0, A, -1, 
        0, 0, B, 0
    ];

    expect(Matrix4.createPerspective(fov, ratio, znear, zfar).data).to.deep.equal(data);
  });

  it('Can calculate the determinant of a Matrix', () => {
    const matrix = Matrix4.createIdentity()
      .setRotationY(45)
      .multiply(Matrix4.createIdentity().setRotationZ(37));
    const determinant = matrix.determinant;

    expect(determinant).to.eql(0.9999999999999998);
  });

  it('Can be inversed', () => {
    const matrix = Matrix4.createIdentity()
      .setRotationY(45)
      .multiply(Matrix4.createIdentity().setRotationZ(37));

    const inverted = Matrix4.createIdentity()
      .setRotationZ(-37)
      .multiply(Matrix4.createIdentity().setRotationY(-45));

    for (let i=0;i<16;i++) {
      expect(matrix.inverse.data[i]).closeTo(inverted.data[i], 0.0000000000000005);
    }
  });

  it('Can create an orthogonal matrix', () => {
    const width = 320;
    const height = 180;
    const znear = 0.1;
    const zfar = 1000;

    const C = 2.0 / width;
    const R = 2.0 / height;
    const A = -2.0 / (zfar - znear);
    const B = -(zfar + znear) / (zfar - znear);
    
    const data = [
      C, 0, 0, 0,
      0, R, 0, 0,
      0, 0, A, B,
      0, 0, 0, 1
    ];

    expect(Matrix4.createOrthogonal(width, height, znear, zfar).data).to.deep.equal(data);
  });
});
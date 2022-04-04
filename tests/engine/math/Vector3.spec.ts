import { expect } from 'chai';
import { Vector3 } from '../../../src/engine/math/Vector3';
import 'mocha';
import { Quaternion } from '../../../src/engine/math/Quaternion';

describe('Vector3 class', () => {
  it('Creates a class with the given values', () => {
    const vector = new Vector3(1, 2, 3);

    expect(vector.x).to.eql(1);
    expect(vector.y).to.eql(2);
    expect(vector.z).to.eql(3);
  });

  it('Can set vector values', () => {
    const vector = new Vector3(0, 0, 0);

    vector.set(1, 2, 3);

    expect(vector.x).to.eql(1);
    expect(vector.y).to.eql(2);
    expect(vector.z).to.eql(3);
  });

  it('Can be normalized', () => {
    const vector = new Vector3(5, 6, 7);
    const length = Math.sqrt(5 * 5 + 6 * 6 + 7 * 7);

    expect(vector.length).to.eql(length);

    vector.normalize();

    expect(vector.x).to.eql(5 / length);
    expect(vector.y).to.eql(6 / length);
    expect(vector.z).to.eql(7 / length);
  });

  it('Can add another\'s vector values to itself', () => {
    const vectorA = new Vector3(13, 43, 21);
    const vectorB = new Vector3(61, 55, 14);

    vectorA.sum(vectorB);

    expect(vectorA.x).to.eql(13 + 61);
    expect(vectorA.y).to.eql(43 + 55);
    expect(vectorA.z).to.eql(21 + 14);
  });

  it('Can multiply another\'s vector values to each one of it\'s values', () => {
    const vectorA = new Vector3(4, 2, 6);
    const vectorB = new Vector3(3, 8, 9);

    vectorA.multiply(vectorB);

    expect(vectorA.x).to.eql(4 * 3);
    expect(vectorA.y).to.eql(2 * 8);
    expect(vectorA.z).to.eql(6 * 9);
  });

  it('Can be multiplied by a scalar', () => {
    const vector = new Vector3(2, 4, 6);

    vector.multiplyScalar(2);

    expect(vector.x).to.eql(2 * 2);
    expect(vector.y).to.eql(4 * 2);
    expect(vector.z).to.eql(6 * 2);
  });

  it('Can produce a clone of itself', () => {
    const vectorA = new Vector3(1, 2, 3);
    const vectorB = vectorA.clone();

    expect(vectorA === vectorB).to.be.false;
    expect(vectorA.x).to.eql(vectorB.x);
    expect(vectorA.y).to.eql(vectorB.y);
    expect(vectorA.z).to.eql(vectorB.z);
  });

  it('Can copy other vector\'s values onto itself', () => {
    const vectorA = new Vector3(1, 2, 3);
    const vectorB = new Vector3(4, 5, 6);

    vectorA.copy(vectorB);

    expect(vectorA.x).to.eql(vectorB.x);
    expect(vectorA.y).to.eql(vectorB.y);
    expect(vectorA.z).to.eql(vectorB.z);
  });

  it('Can rotate using a Quaternion', () => {
    const vector = new Vector3(1, 0, 0);
    const quaternion = Quaternion.createRotationOnAxis(Math.PI / 2, Vector3.up);

    vector.rotateOnQuaternion(quaternion);

    expect(vector.x).to.eql(2.220446049250313e-16); // Basically 0
    expect(vector.y).to.eql(0);
    expect(vector.z).to.eql(1);
  });

  it('Calculates the dot product between two vectors', () => {
    const angle = 60 * Math.PI / 180;
    const vectorA = new Vector3(1, 0, 0);
    const vectorB = new Vector3(Math.cos(angle), Math.sin(angle), 0);

    expect(Vector3.dot(vectorA, vectorB)).to.eql(Math.cos(angle));
    expect(Vector3.dot(vectorB, vectorA)).to.eql(Math.cos(angle));
  });

  it('Calculates the cross product between two vectors', () => {
    const vectorA = new Vector3(1, 0, 0);
    const vectorB = new Vector3(0, 0, 1);
    
    let vector = Vector3.cross(vectorA, vectorB);
    expect(vector.x).to.eql(0);
    expect(vector.y).to.eql(-1);
    expect(vector.z).to.eql(0);

    vector = Vector3.cross(vectorB, vectorA);
    expect(vector.x).to.eql(0);
    expect(vector.y).to.eql(1);
    expect(vector.z).to.eql(0);
  });
});
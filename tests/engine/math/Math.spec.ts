import { expect } from 'chai';
import { degToRad, getAngleBetwen2DVectors, radToDeg } from '../../../src/engine/math/Math';
import 'mocha';

describe('Helper Math functions', () => {
  it('should convert angles in degrees to radians', () => {
    let angle = 90;
    let radians = Math.PI / 2;

    expect(degToRad(angle)).to.eql(radians);

    angle = 180;
    radians = Math.PI;

    expect(degToRad(angle)).to.eql(radians);

    angle = 270;
    radians = 3 * Math.PI / 2;

    expect(degToRad(angle)).to.eql(radians);

    angle = -90;
    radians = 3 * Math.PI / 2;

    expect(degToRad(angle)).to.eql(radians);
  });

  it('should convert angles in radians to degrees', () => {
    let angle = 90;
    let radians = Math.PI / 2;

    expect(radToDeg(radians)).to.eql(angle);

    angle = 180;
    radians = Math.PI;

    expect(radToDeg(radians)).to.eql(angle);

    angle = 270;
    radians = 3 * Math.PI / 2;

    expect(radToDeg(radians)).to.eql(angle);

    angle = 270;
    radians = -Math.PI / 2;

    expect(radToDeg(radians)).to.eql(angle);
  });

  it('should return the inner angle in radians between two vectors', () => {
    expect(getAngleBetwen2DVectors(1, 0, 1, 0)).to.eql(0);
    expect(getAngleBetwen2DVectors(1, 0, 0, 1)).to.eql(Math.PI / 2);
    expect(getAngleBetwen2DVectors(1, 0, -1, 0)).to.eql(Math.PI);
    expect(getAngleBetwen2DVectors(1, 0, 0, -1)).to.eql(3 * Math.PI / 2);

    const x = Math.cos(degToRad(45));
    const y = Math.sin(degToRad(45));

    expect(getAngleBetwen2DVectors(x, y, -x, y)).to.eql(Math.PI / 2);
    expect(getAngleBetwen2DVectors(x, -y, -x, y)).to.eql(Math.PI);
  });
});
import * as chai from 'chai';
import * as spies from 'chai-spies';
import 'mocha';
import { Signal } from '../../../src/engine/system/Signal';

const expect = chai.expect;
chai.use(spies);

describe('Signal Class', () => {
  it('Can be instantiated', () => {
    expect(new Signal()).to.be.instanceOf(Signal);
  });

  it('Can add and call a listener function', () => {
    const signal = new Signal();
    const testObject = { callback: () => {} };
    const spy = chai.spy.on(testObject, 'callback');

    signal.add(testObject.callback, testObject);
    signal.dispatch();

    expect(spy).to.have.been.called.exactly(1);
  });

  it('Can add multiple callback and call them all', () => {
    const signal = new Signal();
    const testObject = { callback: () => {}, callback2: () => {} };
    const spy = chai.spy.on(testObject, 'callback');
    const spy2 = chai.spy.on(testObject, 'callback2');

    signal.add(testObject.callback, testObject);
    signal.add(testObject.callback2, testObject);
    signal.dispatch();

    expect(spy).to.have.been.called.exactly(1);
    expect(spy2).to.have.been.called.exactly(1);
  });

  it('Can dispatch parameters to a callback', () => {
    const signal = new Signal();
    const testObject = { callback: (x: number, y: number) => { x + y } };
    const spy = chai.spy.on(testObject, 'callback');

    signal.add(testObject.callback, testObject);
    signal.dispatch(3, 8);

    expect(spy).to.have.been.called.exactly(1);
    expect(spy).to.have.been.called.with(3, 8);
  });

  it('Can remove a callback', () => {
    const signal = new Signal();
    const testObject = { callback: () => {} };
    const spy = chai.spy.on(testObject, 'callback');

    signal.add(testObject.callback, testObject);
    signal.dispatch();

    expect(spy).to.have.been.called.exactly(1);

    signal.remove(testObject.callback);
    signal.dispatch();

    expect(spy).to.have.been.called.exactly(1);
  });
});
import {isClass} from './is-class.js';
import {expect} from 'chai';

describe('isClass', function () {
  it('returns true for a class', function () {
    class MyClass {}
    expect(isClass(MyClass)).to.be.true;
  });

  it('returns false for a non-class value', function () {
    expect(isClass('str')).to.be.false;
    expect(isClass('')).to.be.false;
    expect(isClass(10)).to.be.false;
    expect(isClass(0)).to.be.false;
    expect(isClass(true)).to.be.false;
    expect(isClass(false)).to.be.false;
    expect(isClass(null)).to.be.false;
    expect(isClass(undefined)).to.be.false;
    expect(isClass({foo: 'bar'})).to.be.false;
    expect(isClass({})).to.be.false;
    expect(isClass([1, 2, 3])).to.be.false;
    expect(isClass([])).to.be.false;
    expect(isClass(() => undefined)).to.be.false;
    expect(isClass(function () {})).to.be.false;
  });
});

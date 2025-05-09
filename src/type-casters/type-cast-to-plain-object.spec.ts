import {expect} from 'chai';
import {TypeCastError} from '../errors/index.js';
import {typeCastToPlainObject} from './type-cast-to-plain-object.js';

describe('typeCastToPlainObject', function () {
  it('throws TypeCastError for string', function () {
    const throwable = () => typeCastToPlainObject('test');
    expect(throwable).to.throw(TypeCastError);
  });

  it('converts JSON-object to object', function () {
    const res = typeCastToPlainObject('{"foo": 10}');
    expect(res).to.be.eql({foo: 10});
  });

  it('requires a given JSON to contain an object', function () {
    const throwable = (v: unknown) => () => typeCastToPlainObject(v);
    expect(throwable('"foo"')).to.throw(TypeCastError);
    expect(throwable('10')).to.throw(TypeCastError);
    expect(throwable('true')).to.throw(TypeCastError);
    expect(throwable('false')).to.throw(TypeCastError);
    expect(throwable('null')).to.throw(TypeCastError);
    expect(throwable('[]')).to.throw(TypeCastError);
    expect(throwable('[1, 2, 3]')).to.throw(TypeCastError);
  });

  it('throws TypeCastError for number', function () {
    const throwable = () => typeCastToPlainObject(10);
    expect(throwable).to.throw(TypeCastError);
  });

  it('throws TypeCastError for boolean', function () {
    const throwable = () => typeCastToPlainObject(true);
    expect(throwable).to.throw(TypeCastError);
  });

  it('throws TypeCastError for array', function () {
    const throwable = () => typeCastToPlainObject([]);
    expect(throwable).to.throw(TypeCastError);
  });

  it('returns a plain object as is', function () {
    const res1 = typeCastToPlainObject({});
    const res2 = typeCastToPlainObject({foo: 'bar'});
    expect(res1).to.be.eql({});
    expect(res2).to.be.eql({foo: 'bar'});
  });

  it('throws TypeCastError for an instance', function () {
    const throwable = () => typeCastToPlainObject(new Date());
    expect(throwable).to.throw(TypeCastError);
  });

  it('throws TypeCastError for undefined', function () {
    const throwable = () => typeCastToPlainObject(undefined);
    expect(throwable).to.throw(TypeCastError);
  });

  it('throws TypeCastError for null', function () {
    const throwable = () => typeCastToPlainObject(null);
    expect(throwable).to.throw(TypeCastError);
  });
});

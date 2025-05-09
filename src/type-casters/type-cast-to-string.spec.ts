import {expect} from 'chai';
import {TypeCastError} from '../errors/index.js';
import {typeCastToString} from './type-cast-to-string.js';

describe('typeCastToString', function () {
  it('return a given string as is', function () {
    const res = typeCastToString('foo');
    expect(res).to.be.eq('foo');
  });

  it('converts number to string', function () {
    const res = typeCastToString(10);
    expect(res).to.be.eq('10');
  });

  it('throws TypeCastError for boolean', function () {
    const throwable = () => typeCastToString(false);
    expect(throwable).to.throw(TypeCastError);
  });

  it('throws TypeCastError for array', function () {
    const throwable = () => typeCastToString([]);
    expect(throwable).to.throw(TypeCastError);
  });

  it('throws TypeCastError for object', function () {
    const throwable = () => typeCastToString({});
    expect(throwable).to.throw(TypeCastError);
  });

  it('throws TypeCastError for an instance', function () {
    const throwable = () => typeCastToString(new Date());
    expect(throwable).to.throw(TypeCastError);
  });

  it('throws TypeCastError for undefined', function () {
    const throwable = () => typeCastToString(undefined);
    expect(throwable).to.throw(TypeCastError);
  });

  it('throws TypeCastError for null', function () {
    const throwable = () => typeCastToString(null);
    expect(throwable).to.throw(TypeCastError);
  });
});

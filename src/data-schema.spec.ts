import {expect} from 'chai';
import {DataType} from './data-schema.js';
import {dataTypeFrom} from './data-schema.js';

describe('dataTypeFrom', function () {
  it('returns DataType.ANY for undefined and null values', function () {
    const res1 = dataTypeFrom(undefined);
    const res2 = dataTypeFrom(null);
    expect(res1).to.be.eq(DataType.ANY);
    expect(res2).to.be.eq(DataType.ANY);
  });

  it('returns DataType.STRING for a string value', function () {
    const res1 = dataTypeFrom('value');
    const res2 = dataTypeFrom('');
    expect(res1).to.be.eq(DataType.STRING);
    expect(res2).to.be.eq(DataType.STRING);
  });

  it('returns DataType.NUMBER for an integer value', function () {
    const res1 = dataTypeFrom(10);
    const res2 = dataTypeFrom(-10);
    expect(res1).to.be.eq(DataType.NUMBER);
    expect(res2).to.be.eq(DataType.NUMBER);
  });

  it('returns DataType.NUMBER for a float value', function () {
    const res1 = dataTypeFrom(10.5);
    const res2 = dataTypeFrom(-10.5);
    expect(res1).to.be.eq(DataType.NUMBER);
    expect(res2).to.be.eq(DataType.NUMBER);
  });

  it('returns DataType.BOOLEAN for a boolean value', function () {
    const res1 = dataTypeFrom(true);
    const res2 = dataTypeFrom(false);
    expect(res1).to.be.eq(DataType.BOOLEAN);
    expect(res2).to.be.eq(DataType.BOOLEAN);
  });

  it('returns DataType.ARRAY for an array value', function () {
    const res1 = dataTypeFrom([1, 2, 3]);
    const res2 = dataTypeFrom([]);
    expect(res1).to.be.eq(DataType.ARRAY);
    expect(res2).to.be.eq(DataType.ARRAY);
  });

  it('returns DataType.OBJECT for an object value', function () {
    const res1 = dataTypeFrom({foo: 'bar'});
    const res2 = dataTypeFrom({});
    expect(res1).to.be.eq(DataType.OBJECT);
    expect(res2).to.be.eq(DataType.OBJECT);
  });
});

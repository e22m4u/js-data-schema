import {expect} from 'chai';
import {DataType} from './data-schema.js';
import {dataTypeFrom} from './data-schema.js';

describe('dataTypeFrom', function () {
  it('returns undefined for undefined and null values', function () {
    const res1 = dataTypeFrom(undefined);
    const res2 = dataTypeFrom(null);
    expect(res1).to.be.undefined;
    expect(res2).to.be.undefined;
  });

  it('returns String for a string value', function () {
    const res1 = dataTypeFrom('value');
    const res2 = dataTypeFrom('');
    expect(res1).to.be.eq(DataType.STRING);
    expect(res2).to.be.eq(DataType.STRING);
  });

  it('returns Number for an integer value', function () {
    const res1 = dataTypeFrom(10);
    const res2 = dataTypeFrom(-10);
    expect(res1).to.be.eq(DataType.NUMBER);
    expect(res2).to.be.eq(DataType.NUMBER);
  });

  it('returns Number for a float value', function () {
    const res1 = dataTypeFrom(10.5);
    const res2 = dataTypeFrom(-10.5);
    expect(res1).to.be.eq(DataType.NUMBER);
    expect(res2).to.be.eq(DataType.NUMBER);
  });

  it('returns Boolean for a boolean value', function () {
    const res1 = dataTypeFrom(true);
    const res2 = dataTypeFrom(false);
    expect(res1).to.be.eq(DataType.BOOLEAN);
    expect(res2).to.be.eq(DataType.BOOLEAN);
  });

  it('returns Array for an array value', function () {
    const res1 = dataTypeFrom([1, 2, 3]);
    const res2 = dataTypeFrom([]);
    expect(res1).to.be.eq(DataType.ARRAY);
    expect(res2).to.be.eq(DataType.ARRAY);
  });

  it('returns Object for an object value', function () {
    const res1 = dataTypeFrom({foo: 'bar'});
    const res2 = dataTypeFrom({});
    expect(res1).to.be.eq(DataType.OBJECT);
    expect(res2).to.be.eq(DataType.OBJECT);
  });
});

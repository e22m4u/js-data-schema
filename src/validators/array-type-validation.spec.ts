import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {DataType} from '../data-schema.js';
import {ValidationError} from '../errors/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {arrayTypeValidator} from './array-type-validator.js';

const SC = new ServiceContainer();

describe('arrayTypeValidator', function () {
  it('skips validation for non-array schema', function () {
    arrayTypeValidator(NaN, {type: DataType.ANY}, undefined, SC);
    arrayTypeValidator(NaN, {type: DataType.STRING}, undefined, SC);
    arrayTypeValidator(NaN, {type: DataType.NUMBER}, undefined, SC);
    arrayTypeValidator(NaN, {type: DataType.BOOLEAN}, undefined, SC);
    arrayTypeValidator(NaN, {type: DataType.OBJECT}, undefined, SC);
  });

  it('skips empty values', function () {
    arrayTypeValidator(undefined, {type: DataType.ARRAY}, undefined, SC);
    arrayTypeValidator(null, {type: DataType.ARRAY}, undefined, SC);
  });

  it('throws an error for non-array value in case of array schema', function () {
    const throwable = (v: unknown) => () =>
      arrayTypeValidator(v, {type: DataType.ARRAY}, undefined, SC);
    const error = (v: string) =>
      format('Value must be an Array, but %s given.', v);
    expect(throwable('str')).to.throw(ValidationError, error('"str"'));
    expect(throwable('')).to.throw(ValidationError, error('""'));
    expect(throwable(10)).to.throw(ValidationError, error('10'));
    expect(throwable(0)).to.throw(ValidationError, error('0'));
    expect(throwable(true)).to.throw(ValidationError, error('true'));
    expect(throwable(false)).to.throw(ValidationError, error('false'));
    expect(throwable({foo: 'bar'})).to.throw(ValidationError, error('Object'));
    expect(throwable({})).to.throw(ValidationError, error('Object'));
  });

  describe('with sourcePath', function () {
    it('throws an error for non-array value in case of array schema', function () {
      const throwable = (v: unknown) => () =>
        arrayTypeValidator(v, {type: DataType.ARRAY}, 'source.path', SC);
      const error = (v: string) =>
        format('Value of "source.path" must be an Array, but %s given.', v);
      expect(throwable('str')).to.throw(ValidationError, error('"str"'));
      expect(throwable('')).to.throw(ValidationError, error('""'));
      expect(throwable(10)).to.throw(ValidationError, error('10'));
      expect(throwable(0)).to.throw(ValidationError, error('0'));
      expect(throwable(true)).to.throw(ValidationError, error('true'));
      expect(throwable(false)).to.throw(ValidationError, error('false'));
      expect(throwable({foo: 'bar'})).to.throw(
        ValidationError,
        error('Object'),
      );
      expect(throwable({})).to.throw(ValidationError, error('Object'));
    });
  });
});

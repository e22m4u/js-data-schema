import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {DataType} from '../data-schema.js';
import {ValidationError} from '../errors/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {booleanTypeValidator} from './boolean-type-validator.js';

const SC = new ServiceContainer();

describe('booleanTypeValidator', function () {
  it('skips validation for non-boolean schema', function () {
    booleanTypeValidator(NaN, {type: DataType.ANY}, undefined, SC);
    booleanTypeValidator(NaN, {type: DataType.STRING}, undefined, SC);
    booleanTypeValidator(NaN, {type: DataType.NUMBER}, undefined, SC);
    booleanTypeValidator(NaN, {type: DataType.OBJECT}, undefined, SC);
    booleanTypeValidator(NaN, {type: DataType.ARRAY}, undefined, SC);
  });

  it('skips empty values', function () {
    booleanTypeValidator(undefined, {type: DataType.BOOLEAN}, undefined, SC);
    booleanTypeValidator(null, {type: DataType.BOOLEAN}, undefined, SC);
  });

  it('throws an error for non-boolean value in case of boolean schema', function () {
    const throwable = (v: unknown) => () =>
      booleanTypeValidator(v, {type: DataType.BOOLEAN}, undefined, SC);
    const error = (v: string) =>
      format('Value must be a Boolean, but %s given.', v);
    expect(throwable('str')).to.throw(ValidationError, error('"str"'));
    expect(throwable('')).to.throw(ValidationError, error('""'));
    expect(throwable(10)).to.throw(ValidationError, error('10'));
    expect(throwable(0)).to.throw(ValidationError, error('0'));
    expect(throwable([1, 2, 3])).to.throw(ValidationError, error('Array'));
    expect(throwable([])).to.throw(ValidationError, error('Array'));
    expect(throwable({foo: 'bar'})).to.throw(ValidationError, error('Object'));
    expect(throwable({})).to.throw(ValidationError, error('Object'));
  });

  describe('with sourcePath', function () {
    it('throws an error for non-boolean value in case of boolean schema', function () {
      const throwable = (v: unknown) => () =>
        booleanTypeValidator(v, {type: DataType.BOOLEAN}, 'source.path', SC);
      const error = (v: string) =>
        format('Value of "source.path" must be a Boolean, but %s given.', v);
      expect(throwable('str')).to.throw(ValidationError, error('"str"'));
      expect(throwable('')).to.throw(ValidationError, error('""'));
      expect(throwable(10)).to.throw(ValidationError, error('10'));
      expect(throwable(0)).to.throw(ValidationError, error('0'));
      expect(throwable([1, 2, 3])).to.throw(ValidationError, error('Array'));
      expect(throwable([])).to.throw(ValidationError, error('Array'));
      expect(throwable({foo: 'bar'})).to.throw(
        ValidationError,
        error('Object'),
      );
      expect(throwable({})).to.throw(ValidationError, error('Object'));
    });
  });
});

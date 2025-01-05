import {expect} from 'chai';
import {describe} from 'mocha';
import {format} from '@e22m4u/js-format';
import {DataType} from '../data-schema.js';
import {ValidationError} from '../errors/index.js';
import {stringTypeValidator} from './string-type-validator.js';

describe('stringTypeValidator', function () {
  it('skips validation for non-string schema', function () {
    stringTypeValidator(NaN, {type: DataType.ANY});
    stringTypeValidator(NaN, {type: DataType.NUMBER});
    stringTypeValidator(NaN, {type: DataType.BOOLEAN});
    stringTypeValidator(NaN, {type: DataType.OBJECT});
    stringTypeValidator(NaN, {type: DataType.ARRAY});
  });

  it('throws an error for non-string value in case of string schema', function () {
    const throwable = (v: unknown) => () =>
      stringTypeValidator(v, {type: DataType.STRING});
    const error = (v: string) =>
      format('Value must be a String, but %s given.', v);
    expect(throwable(10)).to.throw(ValidationError, error('10'));
    expect(throwable(0)).to.throw(ValidationError, error('0'));
    expect(throwable(true)).to.throw(ValidationError, error('true'));
    expect(throwable(false)).to.throw(ValidationError, error('false'));
    expect(throwable([1, 2, 3])).to.throw(ValidationError, error('Array'));
    expect(throwable([])).to.throw(ValidationError, error('Array'));
    expect(throwable({foo: 'bar'})).to.throw(ValidationError, error('Object'));
    expect(throwable({})).to.throw(ValidationError, error('Object'));
  });

  describe('with sourcePath', function () {
    it('throws an error for non-string value in case of string schema', function () {
      const throwable = (v: unknown) => () =>
        stringTypeValidator(v, {type: DataType.STRING}, 'source.path');
      const error = (v: string) =>
        format('Value of "source.path" must be a String, but %s given.', v);
      expect(throwable(10)).to.throw(ValidationError, error('10'));
      expect(throwable(0)).to.throw(ValidationError, error('0'));
      expect(throwable(true)).to.throw(ValidationError, error('true'));
      expect(throwable(false)).to.throw(ValidationError, error('false'));
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

import {expect} from 'chai';
import {describe} from 'mocha';
import {DataType} from '../data-schema.js';
import {ValidationError} from '../errors/validation-error.js';
import {isRequiredValidator} from './is-required-validator.js';

describe('isRequiredValidator', function () {
  it('skips validation for non-string schema', function () {
    isRequiredValidator(NaN, {type: DataType.ANY});
    isRequiredValidator(NaN, {type: DataType.NUMBER});
    isRequiredValidator(NaN, {type: DataType.BOOLEAN});
    isRequiredValidator(NaN, {type: DataType.OBJECT});
    isRequiredValidator(NaN, {type: DataType.ARRAY});
  });

  it('throws ValidationError for undefined in case of required option', function () {
    const schema = {type: DataType.ANY, required: true};
    const throwable = () => isRequiredValidator(undefined, schema);
    expect(throwable).to.throw(
      ValidationError,
      'Value is required, but undefined given.',
    );
  });

  it('throws ValidationError for null in case of required option', function () {
    const schema = {type: DataType.ANY, required: true};
    const throwable = () => isRequiredValidator(null, schema);
    expect(throwable).to.throw(
      ValidationError,
      'Value is required, but null given.',
    );
  });

  describe('with sourcePath', function () {
    it('throws ValidationError for undefined in case of required option', function () {
      const schema = {type: DataType.ANY, required: true};
      const throwable = () => isRequiredValidator(undefined, schema, 'source');
      expect(throwable).to.throw(
        ValidationError,
        'Value of "source" is required, but undefined given.',
      );
    });

    it('throws ValidationError for null in case of required option', function () {
      const schema = {type: DataType.ANY, required: true};
      const throwable = () => isRequiredValidator(null, schema, 'source');
      expect(throwable).to.throw(
        ValidationError,
        'Value of "source" is required, but null given.',
      );
    });
  });
});

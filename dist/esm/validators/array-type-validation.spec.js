import { expect } from 'chai';
import { describe } from 'mocha';
import { format } from '@e22m4u/js-format';
import { DataType } from '../data-schema.js';
import { arrayTypeValidator } from './array-type-validator.js';
import { ValidationError } from '../errors/validation-error.js';
describe('arrayTypeValidator', function () {
    it('skips validation for non-array schema', function () {
        arrayTypeValidator(NaN, { type: DataType.ANY });
        arrayTypeValidator(NaN, { type: DataType.STRING });
        arrayTypeValidator(NaN, { type: DataType.NUMBER });
        arrayTypeValidator(NaN, { type: DataType.BOOLEAN });
        arrayTypeValidator(NaN, { type: DataType.OBJECT });
    });
    it('throws ValidationError for non-array value in case of array schema', function () {
        const throwable = (v) => () => arrayTypeValidator(v, { type: DataType.ARRAY });
        const error = (v) => format('Value must be an Array, but %s given.', v);
        expect(throwable('str')).to.throw(ValidationError, error('"str"'));
        expect(throwable('')).to.throw(ValidationError, error('""'));
        expect(throwable(10)).to.throw(ValidationError, error('10'));
        expect(throwable(0)).to.throw(ValidationError, error('0'));
        expect(throwable(true)).to.throw(ValidationError, error('true'));
        expect(throwable(false)).to.throw(ValidationError, error('false'));
        expect(throwable({ foo: 'bar' })).to.throw(ValidationError, error('Object'));
        expect(throwable({})).to.throw(ValidationError, error('Object'));
    });
    describe('with sourcePath', function () {
        it('throws ValidationError for non-array value in case of array schema', function () {
            const throwable = (v) => () => arrayTypeValidator(v, { type: DataType.ARRAY }, 'source.path');
            const error = (v) => format('Value of "source.path" must be an Array, but %s given.', v);
            expect(throwable('str')).to.throw(ValidationError, error('"str"'));
            expect(throwable('')).to.throw(ValidationError, error('""'));
            expect(throwable(10)).to.throw(ValidationError, error('10'));
            expect(throwable(0)).to.throw(ValidationError, error('0'));
            expect(throwable(true)).to.throw(ValidationError, error('true'));
            expect(throwable(false)).to.throw(ValidationError, error('false'));
            expect(throwable({ foo: 'bar' })).to.throw(ValidationError, error('Object'));
            expect(throwable({})).to.throw(ValidationError, error('Object'));
        });
    });
});

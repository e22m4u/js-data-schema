import { expect } from 'chai';
import { format } from '@e22m4u/js-format';
import { DataType } from '../data-schema.js';
import { ValidationError } from '../errors/index.js';
import { ServiceContainer } from '@e22m4u/js-service';
import { stringTypeValidator } from './string-type-validator.js';
const SC = new ServiceContainer();
describe('stringTypeValidator', function () {
    it('skips validation for non-string schema', function () {
        stringTypeValidator(NaN, { type: DataType.ANY }, undefined, SC);
        stringTypeValidator(NaN, { type: DataType.NUMBER }, undefined, SC);
        stringTypeValidator(NaN, { type: DataType.BOOLEAN }, undefined, SC);
        stringTypeValidator(NaN, { type: DataType.OBJECT }, undefined, SC);
        stringTypeValidator(NaN, { type: DataType.ARRAY }, undefined, SC);
    });
    it('skips empty values', function () {
        stringTypeValidator(undefined, { type: DataType.STRING }, undefined, SC);
        stringTypeValidator(null, { type: DataType.STRING }, undefined, SC);
    });
    it('throws an error for non-string value in case of string schema', function () {
        const throwable = (v) => () => stringTypeValidator(v, { type: DataType.STRING }, undefined, SC);
        const error = (v) => format('Value must be a String, but %s given.', v);
        expect(throwable(10)).to.throw(ValidationError, error('10'));
        expect(throwable(0)).to.throw(ValidationError, error('0'));
        expect(throwable(true)).to.throw(ValidationError, error('true'));
        expect(throwable(false)).to.throw(ValidationError, error('false'));
        expect(throwable([1, 2, 3])).to.throw(ValidationError, error('Array'));
        expect(throwable([])).to.throw(ValidationError, error('Array'));
        expect(throwable({ foo: 'bar' })).to.throw(ValidationError, error('Object'));
        expect(throwable({})).to.throw(ValidationError, error('Object'));
    });
    describe('with sourcePath', function () {
        it('throws an error for non-string value in case of string schema', function () {
            const throwable = (v) => () => stringTypeValidator(v, { type: DataType.STRING }, 'source.path', SC);
            const error = (v) => format('Value of "source.path" must be a String, but %s given.', v);
            expect(throwable(10)).to.throw(ValidationError, error('10'));
            expect(throwable(0)).to.throw(ValidationError, error('0'));
            expect(throwable(true)).to.throw(ValidationError, error('true'));
            expect(throwable(false)).to.throw(ValidationError, error('false'));
            expect(throwable([1, 2, 3])).to.throw(ValidationError, error('Array'));
            expect(throwable([])).to.throw(ValidationError, error('Array'));
            expect(throwable({ foo: 'bar' })).to.throw(ValidationError, error('Object'));
            expect(throwable({})).to.throw(ValidationError, error('Object'));
        });
    });
});

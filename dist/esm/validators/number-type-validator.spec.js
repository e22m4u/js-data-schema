import { expect } from 'chai';
import { format } from '@e22m4u/js-format';
import { DataType } from '../data-schema.js';
import { ValidationError } from '../errors/index.js';
import { ServiceContainer } from '@e22m4u/js-service';
import { numberTypeValidator } from './number-type-validator.js';
const SC = new ServiceContainer();
describe('numberTypeValidator', function () {
    it('skips validation for non-number schema', function () {
        numberTypeValidator(NaN, { type: DataType.ANY }, undefined, SC);
        numberTypeValidator(NaN, { type: DataType.STRING }, undefined, SC);
        numberTypeValidator(NaN, { type: DataType.BOOLEAN }, undefined, SC);
        numberTypeValidator(NaN, { type: DataType.OBJECT }, undefined, SC);
        numberTypeValidator(NaN, { type: DataType.ARRAY }, undefined, SC);
    });
    it('skips empty values', function () {
        numberTypeValidator(undefined, { type: DataType.NUMBER }, undefined, SC);
        numberTypeValidator(null, { type: DataType.NUMBER }, undefined, SC);
    });
    it('throws an error for non-number value in case of number schema', function () {
        const throwable = (v) => () => numberTypeValidator(v, { type: DataType.NUMBER }, undefined, SC);
        const error = (v) => format('Value must be a Number, but %s given.', v);
        expect(throwable('str')).to.throw(ValidationError, error('"str"'));
        expect(throwable('')).to.throw(ValidationError, error('""'));
        expect(throwable(true)).to.throw(ValidationError, error('true'));
        expect(throwable(false)).to.throw(ValidationError, error('false'));
        expect(throwable([1, 2, 3])).to.throw(ValidationError, error('Array'));
        expect(throwable([])).to.throw(ValidationError, error('Array'));
        expect(throwable({ foo: 'bar' })).to.throw(ValidationError, error('Object'));
        expect(throwable({})).to.throw(ValidationError, error('Object'));
    });
    it('throws an error for NaN value in case of number schema', function () {
        const throwable = () => numberTypeValidator(NaN, { type: DataType.NUMBER }, undefined, SC);
        expect(throwable).to.throw(ValidationError, 'Value must be a Number, but NaN given.');
    });
    describe('with sourcePath', function () {
        it('throws an error for non-number value in case of number schema', function () {
            const throwable = (v) => () => numberTypeValidator(v, { type: DataType.NUMBER }, 'source.path', SC);
            const error = (v) => format('Value of "source.path" must be a Number, but %s given.', v);
            expect(throwable('str')).to.throw(ValidationError, error('"str"'));
            expect(throwable('')).to.throw(ValidationError, error('""'));
            expect(throwable(true)).to.throw(ValidationError, error('true'));
            expect(throwable(false)).to.throw(ValidationError, error('false'));
            expect(throwable([1, 2, 3])).to.throw(ValidationError, error('Array'));
            expect(throwable([])).to.throw(ValidationError, error('Array'));
            expect(throwable({ foo: 'bar' })).to.throw(ValidationError, error('Object'));
            expect(throwable({})).to.throw(ValidationError, error('Object'));
        });
        it('throws an error for NaN value in case of number schema', function () {
            const throwable = () => numberTypeValidator(NaN, { type: DataType.NUMBER }, 'source.path', SC);
            expect(throwable).to.throw(ValidationError, 'Value of "source.path" must be a Number, but NaN given.');
        });
    });
});

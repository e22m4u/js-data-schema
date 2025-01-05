import { expect } from 'chai';
import { describe } from 'mocha';
import { format } from '@e22m4u/js-format';
import { DataType } from '../data-schema.js';
import { ValidationError } from '../errors/index.js';
import { objectTypeValidator } from './object-type-validator.js';
describe('objectTypeValidator', function () {
    it('skips validation for non-object schema', function () {
        objectTypeValidator(NaN, { type: DataType.ANY });
        objectTypeValidator(NaN, { type: DataType.STRING });
        objectTypeValidator(NaN, { type: DataType.NUMBER });
        objectTypeValidator(NaN, { type: DataType.BOOLEAN });
        objectTypeValidator(NaN, { type: DataType.ARRAY });
    });
    it('throws an error for non-object value', function () {
        const throwable = (v) => () => objectTypeValidator(v, { type: DataType.OBJECT });
        const error = (v) => format('Value must be a plain Object, but %s given.', v);
        expect(throwable('str')).to.throw(ValidationError, error('"str"'));
        expect(throwable('')).to.throw(ValidationError, error('""'));
        expect(throwable(10)).to.throw(ValidationError, error('10'));
        expect(throwable(0)).to.throw(ValidationError, error('0'));
        expect(throwable(true)).to.throw(ValidationError, error('true'));
        expect(throwable(false)).to.throw(ValidationError, error('false'));
        expect(throwable([1, 2, 3])).to.throw(ValidationError, error('Array'));
        expect(throwable([])).to.throw(ValidationError, error('Array'));
    });
    it('throws an error for a non-plain object', function () {
        const throwable = () => objectTypeValidator(new Date(), { type: DataType.OBJECT });
        expect(throwable).to.throw(ValidationError, 'Value must be a plain Object, but Date given.');
    });
    it('does not throw an error for a plain object', function () {
        objectTypeValidator(Object.create(null), { type: DataType.OBJECT });
    });
    describe('with sourcePath', function () {
        it('throws an error for non-object value', function () {
            const throwable = (v) => () => objectTypeValidator(v, { type: DataType.OBJECT }, 'source.path');
            const error = (v) => format('Value of "source.path" must be a plain Object, but %s given.', v);
            expect(throwable('str')).to.throw(ValidationError, error('"str"'));
            expect(throwable('')).to.throw(ValidationError, error('""'));
            expect(throwable(true)).to.throw(ValidationError, error('true'));
            expect(throwable(false)).to.throw(ValidationError, error('false'));
            expect(throwable(10)).to.throw(ValidationError, error('10'));
            expect(throwable(0)).to.throw(ValidationError, error('0'));
            expect(throwable([1, 2, 3])).to.throw(ValidationError, error('Array'));
            expect(throwable([])).to.throw(ValidationError, error('Array'));
        });
        it('throws an error for a non-plain object', function () {
            const throwable = () => objectTypeValidator(new Date(), { type: DataType.OBJECT }, 'source.path');
            expect(throwable).to.throw(ValidationError, 'Value of "source.path" must be a plain Object, but Date given.');
        });
        it('does not throw an error for a plain object', function () {
            objectTypeValidator(Object.create(null), { type: DataType.OBJECT }, 'source.path');
        });
    });
});

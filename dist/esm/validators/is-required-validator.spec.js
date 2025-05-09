import { expect } from 'chai';
import { DataType } from '../data-schema.js';
import { ValidationError } from '../errors/index.js';
import { ServiceContainer } from '@e22m4u/js-service';
import { isRequiredValidator } from './is-required-validator.js';
describe('isRequiredValidator', function () {
    it('skips validation for non-string schema', function () {
        const C = new ServiceContainer();
        isRequiredValidator(NaN, { type: DataType.ANY }, undefined, C);
        isRequiredValidator(NaN, { type: DataType.NUMBER }, undefined, C);
        isRequiredValidator(NaN, { type: DataType.BOOLEAN }, undefined, C);
        isRequiredValidator(NaN, { type: DataType.OBJECT }, undefined, C);
        isRequiredValidator(NaN, { type: DataType.ARRAY }, undefined, C);
    });
    it('throws an error for undefined in case of required option', function () {
        const C = new ServiceContainer();
        const schema = { type: DataType.ANY, required: true };
        const throwable = () => isRequiredValidator(undefined, schema, undefined, C);
        expect(throwable).to.throw(ValidationError, 'Value is required, but undefined given.');
    });
    it('throws an error for null in case of required option', function () {
        const C = new ServiceContainer();
        const schema = { type: DataType.ANY, required: true };
        const throwable = () => isRequiredValidator(null, schema, undefined, C);
        expect(throwable).to.throw(ValidationError, 'Value is required, but null given.');
    });
    describe('with sourcePath', function () {
        it('throws an error for undefined in case of required option', function () {
            const C = new ServiceContainer();
            const schema = { type: DataType.ANY, required: true };
            const throwable = () => isRequiredValidator(undefined, schema, 'source', C);
            expect(throwable).to.throw(ValidationError, 'Value of "source" is required, but undefined given.');
        });
        it('throws an error for null in case of required option', function () {
            const C = new ServiceContainer();
            const schema = { type: DataType.ANY, required: true };
            const throwable = () => isRequiredValidator(null, schema, 'source', C);
            expect(throwable).to.throw(ValidationError, 'Value of "source" is required, but null given.');
        });
    });
});

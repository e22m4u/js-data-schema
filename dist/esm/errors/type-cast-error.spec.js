import { expect } from 'chai';
import { DataType } from '../data-schema.js';
import { TypeCastError } from './type-cast-error.js';
describe('TypeCastError', function () {
    describe('constructor', function () {
        it('sets a given value and target type to properties', function () {
            const error = new TypeCastError(10, DataType.STRING);
            expect(error.value).to.be.eq(10);
            expect(error.targetType).to.be.eq(DataType.STRING);
        });
        it('sets error message', function () {
            const error = new TypeCastError(10, DataType.STRING);
            expect(error.message).to.be.eq('Unable to cast Number to String.');
        });
    });
});

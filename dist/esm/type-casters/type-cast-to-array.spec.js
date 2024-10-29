import { expect } from 'chai';
import { TypeCastError } from '../errors/index.js';
import { typeCastToArray } from './type-cast-to-array.js';
describe('typeCastToArray', function () {
    it('returns a given array as is', function () {
        const res = typeCastToArray([1, 2, 3]);
        expect(res).to.be.eql([1, 2, 3]);
    });
    it('parses JSON array to array', function () {
        const res = typeCastToArray('[1, 2, 3]');
        expect(res).to.be.eql([1, 2, 3]);
    });
    it('throws TypeCastError for non-JSON string', function () {
        const throwable = () => typeCastToArray('value');
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for JSON object', function () {
        const throwable = () => typeCastToArray('{"foo": "bar"}');
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for number', function () {
        const throwable = () => typeCastToArray(10);
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for boolean', function () {
        const throwable = () => typeCastToArray(true);
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for object', function () {
        const throwable = () => typeCastToArray({ foo: 'bar' });
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for undefined', function () {
        const throwable = () => typeCastToArray(undefined);
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for null', function () {
        const throwable = () => typeCastToArray(null);
        expect(throwable).to.throw(TypeCastError);
    });
});

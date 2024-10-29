import { expect } from 'chai';
import { describe } from 'mocha';
import { TypeCastError } from '../errors/index.js';
import { typeCastToNumber } from './type-cast-to-number.js';
describe('typeCastToNumber', function () {
    it('converts a string of integer to integer', function () {
        const res = typeCastToNumber('10');
        expect(res).to.be.eq(10);
    });
    it('converts a string of float to float', function () {
        const res = typeCastToNumber('10.5');
        expect(res).to.be.eq(10.5);
    });
    it('returns a given integer as is', function () {
        const res = typeCastToNumber(10);
        expect(res).to.be.eq(10);
    });
    it('returns a given float as is', function () {
        const res = typeCastToNumber(10.5);
        expect(res).to.be.eq(10.5);
    });
    it('converts boolean to 1 or 0', function () {
        const res1 = typeCastToNumber(true);
        const res2 = typeCastToNumber(false);
        expect(res1).to.be.eq(1);
        expect(res2).to.be.eq(0);
    });
    it('throws TypeCastError for array', function () {
        const throwable = () => typeCastToNumber([]);
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for object', function () {
        const throwable = () => typeCastToNumber({});
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for an instance', function () {
        const throwable = () => typeCastToNumber(new Date());
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for undefined', function () {
        const throwable = () => typeCastToNumber(undefined);
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for null', function () {
        const throwable = () => typeCastToNumber(null);
        expect(throwable).to.throw(TypeCastError);
    });
});

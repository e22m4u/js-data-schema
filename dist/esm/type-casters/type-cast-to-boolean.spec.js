import { expect } from 'chai';
import { describe } from 'mocha';
import { TypeCastError } from '../errors/index.js';
import { typeCastToBoolean } from './type-cast-to-boolean.js';
describe('typeCastToBoolean', function () {
    it('converts "1" and "0" to boolean', function () {
        const res1 = typeCastToBoolean('1');
        const res2 = typeCastToBoolean('0');
        expect(res1).to.be.eq(true);
        expect(res2).to.be.eq(false);
    });
    it('converts "true" and "false" to boolean', function () {
        const res1 = typeCastToBoolean('true');
        const res2 = typeCastToBoolean('false');
        expect(res1).to.be.eq(true);
        expect(res2).to.be.eq(false);
    });
    it('converts 1 and 0 to boolean', function () {
        const res1 = typeCastToBoolean(1);
        const res2 = typeCastToBoolean(0);
        expect(res1).to.be.eq(true);
        expect(res2).to.be.eq(false);
    });
    it('returns boolean as is', function () {
        const res1 = typeCastToBoolean(true);
        const res2 = typeCastToBoolean(false);
        expect(res1).to.be.eq(true);
        expect(res2).to.be.eq(false);
    });
    it('throws TypeCastError for string', function () {
        const throwable1 = () => typeCastToBoolean('foo');
        const throwable2 = () => typeCastToBoolean('bar');
        expect(throwable1).to.throw(TypeCastError);
        expect(throwable2).to.throw(TypeCastError);
    });
    it('throws TypeCastError for integer', function () {
        const throwable1 = () => typeCastToBoolean(2);
        const throwable2 = () => typeCastToBoolean(-1);
        expect(throwable1).to.throw(TypeCastError);
        expect(throwable2).to.throw(TypeCastError);
    });
    it('throws TypeCastError for float', function () {
        const throwable1 = () => typeCastToBoolean(1.5);
        const throwable2 = () => typeCastToBoolean(-1.5);
        expect(throwable1).to.throw(TypeCastError);
        expect(throwable2).to.throw(TypeCastError);
    });
    it('throws TypeCastError for array', function () {
        const throwable = () => typeCastToBoolean([1, 2, 3]);
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for object', function () {
        const throwable = () => typeCastToBoolean({ foo: 'bar' });
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for an instance', function () {
        const throwable = () => typeCastToBoolean(new Date());
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for undefined', function () {
        const throwable = () => typeCastToBoolean(undefined);
        expect(throwable).to.throw(TypeCastError);
    });
    it('throws TypeCastError for null', function () {
        const throwable = () => typeCastToBoolean(null);
        expect(throwable).to.throw(TypeCastError);
    });
});

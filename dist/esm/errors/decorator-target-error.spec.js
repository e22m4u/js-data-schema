import { expect } from 'chai';
import { Errorf } from '@e22m4u/js-format';
import { DecoratorTargetError } from './decorator-target-error.js';
describe('DecoratorTargetError', function () {
    describe('constructor', function () {
        it('extends the Errorf class', function () {
            const error = new DecoratorTargetError('My error');
            expect(error).to.be.instanceof(Errorf);
        });
        it('interpolates given message', function () {
            const error = new DecoratorTargetError('The value is %v.', 10);
            expect(error.message).to.be.eq('The value is 10.');
        });
    });
});

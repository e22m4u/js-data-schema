import { expect } from 'chai';
import { Errorf } from '@e22m4u/js-format';
import { ValidationError } from './validation-error.js';
describe('ValidationError', function () {
    describe('constructor', function () {
        it('extends the Errorf class', function () {
            const error = new ValidationError('My error');
            expect(error).to.be.instanceof(Errorf);
        });
        it('interpolates given message', function () {
            const error = new ValidationError('The value is %v.', 10);
            expect(error.message).to.be.eq('The value is 10.');
        });
    });
});

import {expect} from 'chai';
import {DataType} from './data-schema.js';
import {ValidationError} from './errors/index.js';
import {DataValidator} from './data-validator.js';
import {CallableValidator} from './data-validator.js';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {arrayTypeValidator} from './validators/index.js';
import {isRequiredValidator} from './validators/index.js';
import {numberTypeValidator} from './validators/index.js';
import {objectTypeValidator} from './validators/index.js';
import {stringTypeValidator} from './validators/index.js';
import {booleanTypeValidator} from './validators/index.js';

const DEFAULT_VALIDATORS = [
  stringTypeValidator,
  numberTypeValidator,
  booleanTypeValidator,
  arrayTypeValidator,
  objectTypeValidator,
  isRequiredValidator,
];

describe('DataValidator', function () {
  it('has default validators upon instantiation', function () {
    const validator = new DataValidator();
    const result = validator.getValidators();
    expect(result).to.be.eql(DEFAULT_VALIDATORS);
  });

  describe('addValidator', function () {
    it('returns the instance for chaining', function () {
      const validator = new DataValidator();
      const result = validator.addValidator(() => undefined);
      expect(result).to.be.equal(validator);
    });

    it('adds a new validator to the set', function () {
      const validator = new DataValidator();
      const customValidator = () => undefined;
      validator.addValidator(customValidator);
      const allValidators = validator.getValidators();
      expect(allValidators).to.include(customValidator);
    });
  });

  describe('hasValidator', function () {
    it('returns true if the validator exists', function () {
      const validator = new DataValidator();
      const customValidator = () => undefined;
      validator.addValidator(customValidator);
      expect(validator.hasValidator(customValidator)).to.be.true;
    });

    it('returns false if the validator does not exist', function () {
      const validator = new DataValidator();
      const customValidator = () => undefined;
      expect(validator.hasValidator(customValidator)).to.be.false;
    });
  });

  describe('getValidators', function () {
    it('returns an array of all registered validators', function () {
      const validator = new DataValidator();
      const result = validator.getValidators();
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(DEFAULT_VALIDATORS.length);
    });
  });

  describe('removeValidator', function () {
    it('removes an existing validator', function () {
      const validator = new DataValidator();
      const customValidator = () => undefined;
      validator.addValidator(customValidator);
      validator.removeValidator(customValidator);
      expect(validator.hasValidator(customValidator)).to.be.false;
    });

    it('returns the instance for chaining', function () {
      const validator = new DataValidator();
      const customValidator = () => undefined;
      validator.addValidator(customValidator);
      const result = validator.removeValidator(customValidator);
      expect(result).to.be.equal(validator);
    });

    it('throws an error when trying to remove a non-existent validator', function () {
      const validator = new DataValidator();
      const customValidator = () => undefined;
      const throwable = () => validator.removeValidator(customValidator);
      expect(throwable).to.throw(
        'Unable to remove non-existent validator "customValidator".',
      );
    });
  });

  describe('removeAllValidators', function () {
    it('removes all validators from the set', function () {
      const validator = new DataValidator();
      validator.addValidator(() => undefined);
      validator.removeAllValidators();
      expect(validator.getValidators()).to.be.empty;
    });

    it('returns the instance for chaining', function () {
      const validator = new DataValidator();
      const result = validator.removeAllValidators();
      expect(result).to.be.equal(validator);
    });
  });

  describe('validate', function () {
    describe('with default type validators', function () {
      const validator = new DataValidator();

      it('should pass for a valid string', function () {
        const schema = {type: DataType.STRING};
        expect(() => validator.validate('text', schema)).to.not.throw();
      });

      it('should throw ValidationError for a non-string value', function () {
        const schema = {type: DataType.STRING};
        expect(() => validator.validate(123, schema)).to.throw(ValidationError);
      });

      it('should pass for a valid number', function () {
        const schema = {type: DataType.NUMBER};
        expect(() => validator.validate(123, schema)).to.not.throw();
      });

      it('should throw ValidationError for a non-number value', function () {
        const schema = {type: DataType.NUMBER};
        expect(() => validator.validate('text', schema)).to.throw(
          ValidationError,
        );
      });

      it('should throw ValidationError for NaN', function () {
        const schema = {type: DataType.NUMBER};
        expect(() => validator.validate(NaN, schema)).to.throw(ValidationError);
      });

      it('should pass for a valid boolean', function () {
        const schema = {type: DataType.BOOLEAN};
        expect(() => validator.validate(true, schema)).to.not.throw();
      });

      it('should throw ValidationError for a non-boolean value', function () {
        const schema = {type: DataType.BOOLEAN};
        expect(() => validator.validate(0, schema)).to.throw(ValidationError);
      });

      it('should pass for a valid array', function () {
        const schema = {type: DataType.ARRAY};
        expect(() => validator.validate([], schema)).to.not.throw();
      });

      it('should throw ValidationError for a non-array value', function () {
        const schema = {type: DataType.ARRAY};
        expect(() => validator.validate({}, schema)).to.throw(ValidationError);
      });

      it('should pass for a plain object', function () {
        const schema = {type: DataType.OBJECT};
        expect(() => validator.validate({}, schema)).to.not.throw();
      });

      it('should throw ValidationError for a non-plain-object value', function () {
        const schema = {type: DataType.OBJECT};
        class MyClass {}
        expect(() => validator.validate(new MyClass(), schema)).to.throw(
          ValidationError,
        );
      });
    });

    describe('with custom validator return values', function () {
      let validator: DataValidator;

      beforeEach(function () {
        validator = new DataValidator();
        validator.removeAllValidators();
      });

      it('should pass when a validator returns true', function () {
        const schema = {type: DataType.ANY, validate: () => true};
        expect(() => validator.validate('value', schema)).to.not.throw();
      });

      it('should pass when a validator returns undefined', function () {
        const schema = {type: DataType.ANY, validate: () => undefined};
        expect(() => validator.validate('value', schema)).to.not.throw();
      });

      it('should throw an error when a validator returns false', function () {
        const schema = {type: DataType.ANY, validate: () => false};
        expect(() => validator.validate('val', schema)).to.throw(
          ValidationError,
          'Validation failed with the value "val".',
        );
      });

      it('should throw an error with a custom message when a validator returns a string', function () {
        const customMessage = 'Value is not valid.';
        const schema = {type: DataType.ANY, validate: () => customMessage};
        expect(() => validator.validate(0, schema)).to.throw(
          ValidationError,
          customMessage,
        );
      });

      it('should throw the specific error instance when a validator returns an Error', function () {
        const customError = new Error('A specific error occurred.');
        const schema = {type: DataType.ANY, validate: () => customError};
        expect(() => validator.validate(0, schema)).to.throw(customError);
      });

      it('should throw InvalidArgumentError when a validator returns a Promise', function () {
        const schema = {type: DataType.ANY, validate: async function () {}};
        expect(() => validator.validate('val', schema)).to.throw(
          InvalidArgumentError,
          /Asynchronous validator is not supported/,
        );
      });

      it('should throw InvalidArgumentError for other truthy non-string/error return values', function () {
        const schema = {type: DataType.ANY, validate: () => 123};
        expect(() => validator.validate('val', schema)).to.throw(
          InvalidArgumentError,
          /User-specified validator should return one of values/,
        );
      });
    });

    describe('with validator invocation and order', function () {
      let validator: DataValidator;

      beforeEach(function () {
        validator = new DataValidator();
        validator.removeAllValidators();
      });

      it('runs global validators before local validators', function () {
        const order: string[] = [];
        const globalValidator = () => {
          order.push('global');
        };
        const localValidator = () => {
          order.push('local');
        };
        const schema = {type: DataType.ANY, validate: localValidator};
        validator.addValidator(globalValidator);
        validator.validate('value', schema);
        expect(order).to.eql(['global', 'local']);
      });
    });

    describe('with recursive validation', function () {
      let validator: DataValidator;
      let calls: {v: unknown; sp: unknown}[];

      beforeEach(function () {
        calls = [];
        const spyValidator: CallableValidator = (v, s, sp) => {
          calls.push({v, sp});
        };
        validator = new DataValidator();
        validator.removeAllValidators();
        validator.addValidator(spyValidator);
      });

      describe('for array values', function () {
        it('validates the array itself and then each of its items', function () {
          const value = ['a', 'b'];
          const schema = {
            type: DataType.ARRAY,
            items: {type: DataType.STRING},
          };
          validator.validate(value, schema, 'root');
          expect(calls).to.have.lengthOf(3);
          expect(calls[0]).to.eql({v: value, sp: 'root'});
          expect(calls[1]).to.eql({v: 'a', sp: 'root[0]'});
          expect(calls[2]).to.eql({v: 'b', sp: 'root[1]'});
        });
      });

      describe('for object values', function () {
        it('validates the object itself and then each of its properties', function () {
          const value = {name: 'test', id: 1};
          const schema = {
            type: DataType.OBJECT,
            properties: {
              name: {type: DataType.STRING},
              id: {type: DataType.NUMBER},
            },
          };
          validator.validate(value, schema, 'root');
          expect(calls).to.have.lengthOf(3);
          expect(calls[0]).to.eql({v: value, sp: 'root'});
          expect(calls[1]).to.eql({v: 'test', sp: 'root.name'});
          expect(calls[2]).to.eql({v: 1, sp: 'root.id'});
        });
      });
    });

    describe('with backward compatibility for thrown errors', function () {
      it('catches and re-throws errors from validators', function () {
        const errorMessage = 'Classic throw validation failed.';
        const schema = {
          type: DataType.ANY,
          validate: function () {
            throw new ValidationError(errorMessage);
          },
        };
        const validator = new DataValidator();
        validator.removeAllValidators();
        expect(() => validator.validate('value', schema)).to.throw(
          ValidationError,
          errorMessage,
        );
      });
    });
  });
});

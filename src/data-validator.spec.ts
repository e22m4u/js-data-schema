import {expect} from 'chai';
import {DataType} from './data-schema.js';
import {DataValidator} from './data-validator.js';
import {CallableValidator} from './data-validator.js';
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
  it('has default validators', function () {
    const s = new DataValidator();
    const res = s.getValidators();
    expect(res).to.be.eql(DEFAULT_VALIDATORS);
  });

  describe('addValidator', function () {
    it('returns itself', function () {
      const s = new DataValidator();
      const res = s.addValidator(() => undefined);
      expect(res).to.be.eq(s);
    });

    it('adds validator', function () {
      const s = new DataValidator();
      const res1 = s.getValidators();
      expect(res1).to.be.eql(DEFAULT_VALIDATORS);
      const validator = () => undefined;
      s.addValidator(validator);
      const res2 = s.getValidators();
      expect(res2).to.be.eql([...DEFAULT_VALIDATORS, validator]);
    });
  });

  describe('hasValidator', function () {
    it('checks validator existence', function () {
      const s = new DataValidator();
      const validator = () => undefined;
      const res1 = s.hasValidator(validator);
      expect(res1).to.be.false;
      s.addValidator(validator);
      const res2 = s.hasValidator(validator);
      expect(res2).to.be.true;
    });
  });

  describe('getValidators', function () {
    it('returns validators', function () {
      const s = new DataValidator();
      const res = s.getValidators();
      expect(res).to.be.eql(DEFAULT_VALIDATORS);
    });
  });

  describe('removeValidator', function () {
    it('removes existing validator and returns itself', function () {
      const s = new DataValidator();
      const validator = () => undefined;
      s.addValidator(validator);
      const res1 = s.hasValidator(validator);
      expect(res1).to.be.true;
      const res2 = s.removeValidator(validator);
      expect(res2).to.be.eq(s);
      const res3 = s.hasValidator(validator);
      expect(res3).to.be.false;
    });

    it('throws an error for non-existent validator', function () {
      const s = new DataValidator();
      const validator = () => undefined;
      const throwable = () => s.removeValidator(validator);
      expect(throwable).to.throw(
        'Unable to remove non-existent validator "validator".',
      );
    });
  });

  describe('removeAllValidators', function () {
    it('removes all validators and returns itself', function () {
      const s = new DataValidator();
      const validator = () => undefined;
      s.addValidator(validator);
      const res1 = s.getValidators();
      expect(res1.length).to.be.gte(1);
      const res2 = s.removeAllValidators();
      expect(res2).to.be.eq(s);
      const res3 = s.getValidators();
      expect(res3).to.be.empty;
    });
  });

  describe('validate', function () {
    describe('string value', function () {
      it('passes a given value through global validators in their order with certain arguments', function () {
        const value = 'myValue';
        const schema = {type: DataType.STRING};
        const order: number[] = [];
        const validator1: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(1);
        };
        const validator2: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(2);
        };
        const s = new DataValidator();
        s.addValidator(validator1);
        s.addValidator(validator2);
        s.validate(value, schema);
        expect(order).to.be.eql([1, 2]);
      });

      it('does nothing if no validators found', function () {
        const value = 'myValue';
        const schema = {type: DataType.STRING};
        const s = new DataValidator();
        s.removeAllValidators();
        s.validate(value, schema);
      });

      it('passes a given value through local validators in their order with certain arguments', function () {
        const value = 'myValue';
        const order: number[] = [];
        const validator1: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(1);
        };
        const validator2: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(2);
        };
        const schema = {
          type: DataType.STRING,
          validate: [validator1, validator2],
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(order).to.be.eql([1, 2]);
      });

      it('passes a given value through a single local validator with certain arguments', function () {
        const value = 'myValue';
        let invoked = 0;
        const validator: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          invoked++;
        };
        const schema = {
          type: DataType.STRING,
          validate: validator,
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(invoked).to.be.eq(1);
      });

      it('passes a given value through global validators in priority over local validators', function () {
        const value = 'myValue';
        const order: string[] = [];
        const globalValidator: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push('global');
        };
        const localValidator: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push('local');
        };
        const schema = {
          type: DataType.STRING,
          validate: localValidator,
        };
        const s = new DataValidator();
        s.addValidator(globalValidator);
        s.validate(value, schema);
        expect(order).to.be.eql(['global', 'local']);
      });
    });

    describe('array value', function () {
      it('passes array items through a global validator when items schema is specified', function () {
        const value = ['foo', 'bar', 'baz'];
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.ARRAY,
          items: {type: DataType.STRING},
        };
        const s = new DataValidator();
        s.addValidator(validator);
        s.validate(value, schema);
        expect(valueOrder).to.be.eql([value, 'foo', 'bar', 'baz']);
        expect(schemaOrder).to.be.eql([
          schema,
          schema.items,
          schema.items,
          schema.items,
        ]);
      });

      it('passes array items through global validators when items schema is specified', function () {
        const value = ['foo', 'bar', 'baz'];
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator1: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const validator2: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.ARRAY,
          items: {type: DataType.STRING},
        };
        const s = new DataValidator();
        s.addValidator(validator1);
        s.addValidator(validator2);
        s.validate(value, schema);
        expect(valueOrder).to.be.eql([
          value,
          value,
          'foo',
          'foo',
          'bar',
          'bar',
          'baz',
          'baz',
        ]);
        expect(schemaOrder).to.be.eql([
          schema,
          schema,
          schema.items,
          schema.items,
          schema.items,
          schema.items,
          schema.items,
          schema.items,
        ]);
      });

      it('passes array items through a local validator from items schema', function () {
        const value = ['foo', 'bar', 'baz'];
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.ARRAY,
          items: {
            type: DataType.STRING,
            validate: validator,
          },
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(valueOrder).to.be.eql(['foo', 'bar', 'baz']);
        expect(schemaOrder).to.be.eql([
          schema.items,
          schema.items,
          schema.items,
        ]);
      });

      it('passes array items through local validators from items schema', function () {
        const value = ['foo', 'bar', 'baz'];
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator1: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const validator2: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.ARRAY,
          items: {
            type: DataType.STRING,
            validate: [validator1, validator2],
          },
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(valueOrder).to.be.eql([
          'foo',
          'foo',
          'bar',
          'bar',
          'baz',
          'baz',
        ]);
        expect(schemaOrder).to.be.eql([
          schema.items,
          schema.items,
          schema.items,
          schema.items,
          schema.items,
          schema.items,
        ]);
      });

      it('should not pass array items through a local validator of the array schema', function () {
        const value = ['foo', 'bar', 'baz'];
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.ARRAY,
          items: {type: DataType.STRING},
          validate: validator,
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(valueOrder).to.be.eql([value]);
        expect(schemaOrder).to.be.eql([schema]);
      });

      it('should not pass array items through local validators of the array schema', function () {
        const value = ['foo', 'bar', 'baz'];
        const sourcePath = 'source';
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator1: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const validator2: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.ARRAY,
          items: {type: DataType.STRING},
          validate: [validator1, validator2],
        };
        const s = new DataValidator();
        s.validate(value, schema, sourcePath);
        expect(valueOrder).to.be.eql([value, value]);
        expect(schemaOrder).to.be.eql([schema, schema]);
      });
    });

    describe('object value', function () {
      it('passes object properties through a global validator when properties schema is specified', function () {
        const value = {foo: 'value', bar: 10, baz: true};
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.OBJECT,
          properties: {
            foo: {type: DataType.STRING},
            bar: {type: DataType.NUMBER},
            baz: {type: DataType.BOOLEAN},
          },
        };
        const s = new DataValidator();
        s.addValidator(validator);
        s.validate(value, schema);
        expect(valueOrder).to.be.eql([value, 'value', 10, true]);
        expect(schemaOrder).to.be.eql([
          schema,
          schema.properties.foo,
          schema.properties.bar,
          schema.properties.baz,
        ]);
      });

      it('passes object properties through global validators when properties schema is specified', function () {
        const value = {foo: 'value', bar: 10, baz: true};
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator1: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const validator2: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.OBJECT,
          properties: {
            foo: {type: DataType.STRING},
            bar: {type: DataType.NUMBER},
            baz: {type: DataType.BOOLEAN},
          },
        };
        const s = new DataValidator();
        s.addValidator(validator1);
        s.addValidator(validator2);
        s.validate(value, schema);
        expect(valueOrder).to.be.eql([
          value,
          value,
          'value',
          'value',
          10,
          10,
          true,
          true,
        ]);
        expect(schemaOrder).to.be.eql([
          schema,
          schema,
          schema.properties.foo,
          schema.properties.foo,
          schema.properties.bar,
          schema.properties.bar,
          schema.properties.baz,
          schema.properties.baz,
        ]);
      });

      it('passes object properties through a local validator from property schema', function () {
        const value = {foo: 'value', bar: 10, baz: true};
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.OBJECT,
          properties: {
            foo: {
              type: DataType.STRING,
              validate: validator,
            },
            bar: {
              type: DataType.NUMBER,
              validate: validator,
            },
            baz: {
              type: DataType.BOOLEAN,
              validate: validator,
            },
          },
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(valueOrder).to.be.eql(['value', 10, true]);
        expect(schemaOrder).to.be.eql([
          schema.properties.foo,
          schema.properties.bar,
          schema.properties.baz,
        ]);
      });

      it('passes object properties through local validators from property schema', function () {
        const value = {foo: 'value', bar: 10, baz: true};
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator1: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const validator2: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.OBJECT,
          properties: {
            foo: {
              type: DataType.STRING,
              validate: [validator1, validator2],
            },
            bar: {
              type: DataType.NUMBER,
              validate: [validator1, validator2],
            },
            baz: {
              type: DataType.BOOLEAN,
              validate: [validator1, validator2],
            },
          },
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(valueOrder).to.be.eql(['value', 'value', 10, 10, true, true]);
        expect(schemaOrder).to.be.eql([
          schema.properties.foo,
          schema.properties.foo,
          schema.properties.bar,
          schema.properties.bar,
          schema.properties.baz,
          schema.properties.baz,
        ]);
      });

      it('should not pass object properties through a local validator of the object schema', function () {
        const value = {foo: 'value', bar: 10, baz: true};
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.OBJECT,
          properties: {
            foo: {type: DataType.STRING},
            bar: {type: DataType.NUMBER},
            baz: {type: DataType.BOOLEAN},
          },
          validate: validator,
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(valueOrder).to.be.eql([value]);
        expect(schemaOrder).to.be.eql([schema]);
      });

      it('should not pass object properties through local validators of the object schema', function () {
        const value = {foo: 'value', bar: 10, baz: true};
        const valueOrder: unknown[] = [];
        const schemaOrder: unknown[] = [];
        const validator1: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const validator2: CallableValidator = (v, s) => {
          valueOrder.push(v);
          schemaOrder.push(s);
        };
        const schema = {
          type: DataType.OBJECT,
          properties: {
            foo: {type: DataType.STRING},
            bar: {type: DataType.NUMBER},
            baz: {type: DataType.BOOLEAN},
          },
          validate: [validator1, validator2],
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(valueOrder).to.be.eql([value, value]);
        expect(schemaOrder).to.be.eql([schema, schema]);
      });
    });

    describe('undefined value', function () {
      it('passes a given value through global validators in their order with certain arguments', function () {
        const value = undefined;
        const schema = {type: DataType.ANY};
        const order: number[] = [];
        const validator1: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(1);
        };
        const validator2: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(2);
        };
        const s = new DataValidator();
        s.addValidator(validator1);
        s.addValidator(validator2);
        s.validate(value, schema);
        expect(order).to.be.eql([1, 2]);
      });

      it('does nothing if no validators found', function () {
        const value = undefined;
        const schema = {type: DataType.ANY};
        const s = new DataValidator();
        s.removeAllValidators();
        s.validate(value, schema);
      });

      it('passes a given value through local validators in their order with certain arguments', function () {
        const value = undefined;
        const order: number[] = [];
        const validator1: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(1);
        };
        const validator2: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(2);
        };
        const schema = {
          type: DataType.ANY,
          validate: [validator1, validator2],
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(order).to.be.eql([1, 2]);
      });

      it('passes a given value through a single local validator with certain arguments', function () {
        const value = undefined;
        let invoked = 0;
        const validator: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          invoked++;
        };
        const schema = {
          type: DataType.ANY,
          validate: validator,
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(invoked).to.be.eq(1);
      });

      it('passes a given value through global validators in priority over local validators', function () {
        const value = undefined;
        const order: string[] = [];
        const globalValidator: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push('global');
        };
        const localValidator: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push('local');
        };
        const schema = {
          type: DataType.ANY,
          validate: localValidator,
        };
        const s = new DataValidator();
        s.addValidator(globalValidator);
        s.validate(value, schema);
        expect(order).to.be.eql(['global', 'local']);
      });
    });

    describe('null value', function () {
      it('passes a given value through global validators in their order with certain arguments', function () {
        const value = null;
        const schema = {type: DataType.ANY};
        const order: number[] = [];
        const validator1: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(1);
        };
        const validator2: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(2);
        };
        const s = new DataValidator();
        s.addValidator(validator1);
        s.addValidator(validator2);
        s.validate(value, schema);
        expect(order).to.be.eql([1, 2]);
      });

      it('does nothing if no validators found', function () {
        const value = null;
        const schema = {type: DataType.ANY};
        const s = new DataValidator();
        s.removeAllValidators();
        s.validate(value, schema);
      });

      it('passes a given value through local validators in their order with certain arguments', function () {
        const value = null;
        const order: number[] = [];
        const validator1: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(1);
        };
        const validator2: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push(2);
        };
        const schema = {
          type: DataType.ANY,
          validate: [validator1, validator2],
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(order).to.be.eql([1, 2]);
      });

      it('passes a given value through a single local validator with certain arguments', function () {
        const value = null;
        let invoked = 0;
        const validator: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          invoked++;
        };
        const schema = {
          type: DataType.ANY,
          validate: validator,
        };
        const s = new DataValidator();
        s.validate(value, schema);
        expect(invoked).to.be.eq(1);
      });

      it('passes a given value through global validators in priority over local validators', function () {
        const value = null;
        const order: string[] = [];
        const globalValidator: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push('global');
        };
        const localValidator: CallableValidator = (v, s) => {
          expect(value).to.be.eq(v);
          expect(schema).to.be.eq(s);
          order.push('local');
        };
        const schema = {
          type: DataType.ANY,
          validate: localValidator,
        };
        const s = new DataValidator();
        s.addValidator(globalValidator);
        s.validate(value, schema);
        expect(order).to.be.eql(['global', 'local']);
      });
    });

    describe('with sourcePath', function () {
      describe('string value', function () {
        it('passes a given value through global validators in their order with certain arguments', function () {
          const value = 'myValue';
          const schema = {type: DataType.STRING};
          const sourcePath = 'source';
          const order: number[] = [];
          const validator1: CallableValidator = (v, s, sp) => {
            expect(value).to.be.eq(v);
            expect(schema).to.be.eq(s);
            expect(sourcePath).to.be.eq(sp);
            order.push(1);
          };
          const validator2: CallableValidator = (v, s, sp) => {
            expect(value).to.be.eq(v);
            expect(schema).to.be.eq(s);
            expect(sourcePath).to.be.eq(sp);
            order.push(2);
          };
          const s = new DataValidator();
          s.addValidator(validator1);
          s.addValidator(validator2);
          s.validate(value, schema, sourcePath);
          expect(order).to.be.eql([1, 2]);
        });

        it('does nothing if no validators found', function () {
          const value = 'myValue';
          const schema = {type: DataType.STRING};
          const sourcePath = 'source';
          const s = new DataValidator();
          s.removeAllValidators();
          s.validate(value, schema, sourcePath);
        });

        it('passes a given value through local validators in their order with certain arguments', function () {
          const value = 'myValue';
          const sourcePath = 'source';
          const order: number[] = [];
          const validator1: CallableValidator = (v, s, sp) => {
            expect(value).to.be.eq(v);
            expect(schema).to.be.eq(s);
            expect(sourcePath).to.be.eq(sp);
            order.push(1);
          };
          const validator2: CallableValidator = (v, s, sp) => {
            expect(value).to.be.eq(v);
            expect(schema).to.be.eq(s);
            expect(sourcePath).to.be.eq(sp);
            order.push(2);
          };
          const schema = {
            type: DataType.STRING,
            validate: [validator1, validator2],
          };
          const s = new DataValidator();
          s.validate(value, schema, sourcePath);
          expect(order).to.be.eql([1, 2]);
        });

        it('passes a given value through a single local validator with certain arguments', function () {
          const value = 'myValue';
          const sourcePath = 'source';
          let invoked = 0;
          const validator: CallableValidator = (v, s, sp) => {
            expect(value).to.be.eq(v);
            expect(schema).to.be.eq(s);
            expect(sourcePath).to.be.eq(sp);
            invoked++;
          };
          const schema = {
            type: DataType.STRING,
            validate: validator,
          };
          const s = new DataValidator();
          s.validate(value, schema, sourcePath);
          expect(invoked).to.be.eq(1);
        });

        it('passes a given value through global validators in priority over local validators', function () {
          const value = 'myValue';
          const sourcePath = 'source';
          const order: string[] = [];
          const globalValidator: CallableValidator = (v, s, sp) => {
            expect(value).to.be.eq(v);
            expect(schema).to.be.eq(s);
            expect(sourcePath).to.be.eq(sp);
            order.push('global');
          };
          const localValidator: CallableValidator = (v, s, sp) => {
            expect(value).to.be.eq(v);
            expect(schema).to.be.eq(s);
            expect(sourcePath).to.be.eq(sp);
            order.push('local');
          };
          const schema = {
            type: DataType.STRING,
            validate: localValidator,
          };
          const s = new DataValidator();
          s.addValidator(globalValidator);
          s.validate(value, schema, sourcePath);
          expect(order).to.be.eql(['global', 'local']);
        });
      });

      describe('array value', function () {
        it('passes array items through a global validator when items schema is specified', function () {
          const value = ['foo', 'bar', 'baz'];
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.ARRAY,
            items: {type: DataType.STRING},
          };
          const s = new DataValidator();
          s.addValidator(validator);
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql([value, 'foo', 'bar', 'baz']);
          expect(schemaOrder).to.be.eql([
            schema,
            schema.items,
            schema.items,
            schema.items,
          ]);
          expect(sourcePathOrder).to.be.eql([
            sourcePath,
            `${sourcePath}[0]`,
            `${sourcePath}[1]`,
            `${sourcePath}[2]`,
          ]);
        });

        it('passes array items through global validators when items schema is specified', function () {
          const value = ['foo', 'bar', 'baz'];
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator1: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const validator2: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.ARRAY,
            items: {type: DataType.STRING},
          };
          const s = new DataValidator();
          s.addValidator(validator1);
          s.addValidator(validator2);
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql([
            value,
            value,
            'foo',
            'foo',
            'bar',
            'bar',
            'baz',
            'baz',
          ]);
          expect(schemaOrder).to.be.eql([
            schema,
            schema,
            schema.items,
            schema.items,
            schema.items,
            schema.items,
            schema.items,
            schema.items,
          ]);
          expect(sourcePathOrder).to.be.eql([
            sourcePath,
            sourcePath,
            `${sourcePath}[0]`,
            `${sourcePath}[0]`,
            `${sourcePath}[1]`,
            `${sourcePath}[1]`,
            `${sourcePath}[2]`,
            `${sourcePath}[2]`,
          ]);
        });

        it('passes array items through a local validator from items schema', function () {
          const value = ['foo', 'bar', 'baz'];
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.ARRAY,
            items: {
              type: DataType.STRING,
              validate: validator,
            },
          };
          const s = new DataValidator();
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql(['foo', 'bar', 'baz']);
          expect(schemaOrder).to.be.eql([
            schema.items,
            schema.items,
            schema.items,
          ]);
          expect(sourcePathOrder).to.be.eql([
            `${sourcePath}[0]`,
            `${sourcePath}[1]`,
            `${sourcePath}[2]`,
          ]);
        });

        it('passes array items through local validators from items schema', function () {
          const value = ['foo', 'bar', 'baz'];
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator1: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const validator2: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.ARRAY,
            items: {
              type: DataType.STRING,
              validate: [validator1, validator2],
            },
          };
          const s = new DataValidator();
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql([
            'foo',
            'foo',
            'bar',
            'bar',
            'baz',
            'baz',
          ]);
          expect(schemaOrder).to.be.eql([
            schema.items,
            schema.items,
            schema.items,
            schema.items,
            schema.items,
            schema.items,
          ]);
          expect(sourcePathOrder).to.be.eql([
            `${sourcePath}[0]`,
            `${sourcePath}[0]`,
            `${sourcePath}[1]`,
            `${sourcePath}[1]`,
            `${sourcePath}[2]`,
            `${sourcePath}[2]`,
          ]);
        });

        it('should not pass array items through a local validator of the array schema', function () {
          const value = ['foo', 'bar', 'baz'];
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.ARRAY,
            items: {type: DataType.STRING},
            validate: validator,
          };
          const s = new DataValidator();
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql([value]);
          expect(schemaOrder).to.be.eql([schema]);
          expect(sourcePathOrder).to.be.eql([sourcePath]);
        });

        it('should not pass array items through local validators of the array schema', function () {
          const value = ['foo', 'bar', 'baz'];
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator1: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const validator2: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.ARRAY,
            items: {type: DataType.STRING},
            validate: [validator1, validator2],
          };
          const s = new DataValidator();
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql([value, value]);
          expect(schemaOrder).to.be.eql([schema, schema]);
          expect(sourcePathOrder).to.be.eql([sourcePath, sourcePath]);
        });
      });

      describe('object value', function () {
        it('passes object properties through a global validator when properties schema is specified', function () {
          const value = {foo: 'value', bar: 10, baz: true};
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.OBJECT,
            properties: {
              foo: {type: DataType.STRING},
              bar: {type: DataType.NUMBER},
              baz: {type: DataType.BOOLEAN},
            },
          };
          const s = new DataValidator();
          s.addValidator(validator);
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql([value, 'value', 10, true]);
          expect(schemaOrder).to.be.eql([
            schema,
            schema.properties.foo,
            schema.properties.bar,
            schema.properties.baz,
          ]);
          expect(sourcePathOrder).to.be.eql([
            sourcePath,
            `${sourcePath}.foo`,
            `${sourcePath}.bar`,
            `${sourcePath}.baz`,
          ]);
        });

        it('passes object properties through global validators when properties schema is specified', function () {
          const value = {foo: 'value', bar: 10, baz: true};
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator1: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const validator2: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.OBJECT,
            properties: {
              foo: {type: DataType.STRING},
              bar: {type: DataType.NUMBER},
              baz: {type: DataType.BOOLEAN},
            },
          };
          const s = new DataValidator();
          s.addValidator(validator1);
          s.addValidator(validator2);
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql([
            value,
            value,
            'value',
            'value',
            10,
            10,
            true,
            true,
          ]);
          expect(schemaOrder).to.be.eql([
            schema,
            schema,
            schema.properties.foo,
            schema.properties.foo,
            schema.properties.bar,
            schema.properties.bar,
            schema.properties.baz,
            schema.properties.baz,
          ]);
          expect(sourcePathOrder).to.be.eql([
            sourcePath,
            sourcePath,
            `${sourcePath}.foo`,
            `${sourcePath}.foo`,
            `${sourcePath}.bar`,
            `${sourcePath}.bar`,
            `${sourcePath}.baz`,
            `${sourcePath}.baz`,
          ]);
        });

        it('passes object properties through a local validators from property schema', function () {
          const value = {foo: 'value', bar: 10, baz: true};
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.OBJECT,
            properties: {
              foo: {
                type: DataType.STRING,
                validate: validator,
              },
              bar: {
                type: DataType.NUMBER,
                validate: validator,
              },
              baz: {
                type: DataType.BOOLEAN,
                validate: validator,
              },
            },
          };
          const s = new DataValidator();
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql(['value', 10, true]);
          expect(schemaOrder).to.be.eql([
            schema.properties.foo,
            schema.properties.bar,
            schema.properties.baz,
          ]);
          expect(sourcePathOrder).to.be.eql([
            `${sourcePath}.foo`,
            `${sourcePath}.bar`,
            `${sourcePath}.baz`,
          ]);
        });

        it('passes object properties through local validators from property schema', function () {
          const value = {foo: 'value', bar: 10, baz: true};
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator1: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const validator2: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.OBJECT,
            properties: {
              foo: {
                type: DataType.STRING,
                validate: [validator1, validator2],
              },
              bar: {
                type: DataType.NUMBER,
                validate: [validator1, validator2],
              },
              baz: {
                type: DataType.BOOLEAN,
                validate: [validator1, validator2],
              },
            },
          };
          const s = new DataValidator();
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql(['value', 'value', 10, 10, true, true]);
          expect(schemaOrder).to.be.eql([
            schema.properties.foo,
            schema.properties.foo,
            schema.properties.bar,
            schema.properties.bar,
            schema.properties.baz,
            schema.properties.baz,
          ]);
          expect(sourcePathOrder).to.be.eql([
            `${sourcePath}.foo`,
            `${sourcePath}.foo`,
            `${sourcePath}.bar`,
            `${sourcePath}.bar`,
            `${sourcePath}.baz`,
            `${sourcePath}.baz`,
          ]);
        });

        it('should not pass object properties through a local validator of the object schema', function () {
          const value = {foo: 'value', bar: 10, baz: true};
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.OBJECT,
            properties: {
              foo: {type: DataType.STRING},
              bar: {type: DataType.NUMBER},
              baz: {type: DataType.BOOLEAN},
            },
            validate: validator,
          };
          const s = new DataValidator();
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql([value]);
          expect(schemaOrder).to.be.eql([schema]);
          expect(sourcePathOrder).to.be.eql([sourcePath]);
        });

        it('should not pass object properties through local validators of the object schema', function () {
          const value = {foo: 'value', bar: 10, baz: true};
          const sourcePath = 'source';
          const valueOrder: unknown[] = [];
          const schemaOrder: unknown[] = [];
          const sourcePathOrder: unknown[] = [];
          const validator1: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const validator2: CallableValidator = (v, s, sp) => {
            valueOrder.push(v);
            schemaOrder.push(s);
            sourcePathOrder.push(sp);
          };
          const schema = {
            type: DataType.OBJECT,
            properties: {
              foo: {type: DataType.STRING},
              bar: {type: DataType.NUMBER},
              baz: {type: DataType.BOOLEAN},
            },
            validate: [validator1, validator2],
          };
          const s = new DataValidator();
          s.validate(value, schema, sourcePath);
          expect(valueOrder).to.be.eql([value, value]);
          expect(schemaOrder).to.be.eql([schema, schema]);
          expect(sourcePathOrder).to.be.eql([sourcePath, sourcePath]);
        });
      });
    });
  });
});

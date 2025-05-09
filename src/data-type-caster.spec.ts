import {expect} from 'chai';
import {DataType} from './data-schema.js';
import {TypeCastError} from './errors/index.js';
import {DataTypeCaster} from './data-type-caster.js';
import {typeCastToArray} from './type-casters/index.js';
import {typeCastToString} from './type-casters/index.js';
import {typeCastToNumber} from './type-casters/index.js';
import {typeCastToBoolean} from './type-casters/index.js';
import {typeCastToPlainObject} from './type-casters/index.js';

describe('DataTypeCaster', function () {
  it('has default type casters', function () {
    const s = new DataTypeCaster();
    expect(s.getTypeCaster(DataType.STRING)).to.be.eq(typeCastToString);
    expect(s.getTypeCaster(DataType.NUMBER)).to.be.eq(typeCastToNumber);
    expect(s.getTypeCaster(DataType.BOOLEAN)).to.be.eq(typeCastToBoolean);
    expect(s.getTypeCaster(DataType.ARRAY)).to.be.eq(typeCastToArray);
    expect(s.getTypeCaster(DataType.OBJECT)).to.be.eq(typeCastToPlainObject);
  });

  describe('setTypeCaster', function () {
    it('sets type caster for a given type', function () {
      const s = new DataTypeCaster();
      const caster = () => undefined;
      s.setTypeCaster(DataType.STRING, caster);
      const res = s.getTypeCaster(DataType.STRING);
      expect(res).to.be.eq(caster);
    });
  });

  describe('getTypeCaster', function () {
    it('returns type caster by a given type', function () {
      const s = new DataTypeCaster();
      const caster = () => undefined;
      s.setTypeCaster(DataType.STRING, caster);
      const res = s.getTypeCaster(DataType.STRING);
      expect(res).to.be.eq(caster);
    });
  });

  describe('cast', function () {
    it('skips casting when target type is Any', function () {
      const s = new DataTypeCaster();
      const res = s.cast('value', {type: DataType.ANY});
      expect(res).to.be.eq('value');
    });

    describe('to string', function () {
      it('throws TypeCastError for null', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast(null, {type: DataType.STRING});
        expect(throwable).to.throw(TypeCastError);
      });

      it('throws TypeCastError for undefined', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast(undefined, {type: DataType.STRING});
        expect(throwable).to.throw(TypeCastError);
      });

      it('skips casting for string', function () {
        const s = new DataTypeCaster();
        const res = s.cast('value', {type: DataType.STRING});
        expect(res).to.be.eq('value');
      });

      it('casts number to string', function () {
        const s = new DataTypeCaster();
        const res = s.cast(10, {type: DataType.STRING});
        expect(res).to.be.eq('10');
      });

      it('throws TypeCastError for boolean', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast(true, {type: DataType.STRING});
        expect(throwable).to.throw(TypeCastError);
      });

      it('throws TypeCastError for array', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast([1, 2, 3], {type: DataType.STRING});
        expect(throwable).to.throw(TypeCastError);
      });

      it('throws TypeCastError for object', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast({foo: 'bar'}, {type: DataType.STRING});
        expect(throwable).to.throw(TypeCastError);
      });
    });

    describe('to array', function () {
      it('throws TypeCastError for null', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast(null, {type: DataType.ARRAY});
        expect(throwable).to.throw(TypeCastError);
      });

      it('throws TypeCastError for undefined', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast(undefined, {type: DataType.ARRAY});
        expect(throwable).to.throw(TypeCastError);
      });

      describe('string value', function () {
        it('throws TypeCastError for non-JSON string', function () {
          const s = new DataTypeCaster();
          const throwable = () => s.cast('value', {type: DataType.ARRAY});
          expect(throwable).to.throw(TypeCastError);
        });

        it('casts JSON array to array', function () {
          const s = new DataTypeCaster();
          const res = s.cast('[1, 2, 3]', {type: DataType.ARRAY});
          expect(res).to.be.eql([1, 2, 3]);
        });

        it('throws TypeCastError for JSON object', function () {
          const s = new DataTypeCaster();
          const throwable = () =>
            s.cast('{"foo": "bar"}', {type: DataType.ARRAY});
          expect(throwable).to.throw(TypeCastError);
        });
      });

      it('throws TypeCastError for number', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast(10, {type: DataType.ARRAY});
        expect(throwable).to.throw(TypeCastError);
      });

      it('throws TypeCastError for boolean', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast(true, {type: DataType.ARRAY});
        expect(throwable).to.throw(TypeCastError);
      });

      describe('array value', function () {
        it('skips casting if no items schema specified', function () {
          const s = new DataTypeCaster();
          const res = s.cast([1, 2, 3], {type: DataType.ARRAY});
          expect(res).to.be.eql([1, 2, 3]);
        });

        it('casts array items recursively', function () {
          const s = new DataTypeCaster();
          const res = s.cast(['10', '20', '30'], {
            type: DataType.ARRAY,
            items: {type: DataType.NUMBER},
          });
          expect(res).to.be.eql([10, 20, 30]);
        });

        it('throws TypeCastError on items casting fail', function () {
          const s = new DataTypeCaster();
          const throwable = () =>
            s.cast([10, '20', 'lorem'], {
              type: DataType.ARRAY,
              items: {type: DataType.NUMBER},
            });
          expect(throwable).to.throw(TypeCastError);
        });
      });

      it('throws TypeCastError for object', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast({foo: 'bar'}, {type: DataType.ARRAY});
        expect(throwable).to.throw(TypeCastError);
      });
    });

    describe('to object', function () {
      it('throws TypeCastError for null', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast(null, {type: DataType.OBJECT});
        expect(throwable).to.throw(TypeCastError);
      });

      it('throws TypeCastError for undefined', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast(undefined, {type: DataType.OBJECT});
        expect(throwable).to.throw(TypeCastError);
      });

      describe('string value', function () {
        it('throws TypeCastError for non-JSON string', function () {
          const s = new DataTypeCaster();
          const throwable = () => s.cast('value', {type: DataType.OBJECT});
          expect(throwable).to.throw(TypeCastError);
        });

        it('throws TypeCastError for JSON array', function () {
          const s = new DataTypeCaster();
          const throwable = () => s.cast('[1, 2, 3]', {type: DataType.OBJECT});
          expect(throwable).to.throw(TypeCastError);
        });

        it('casts JSON object to object', function () {
          const s = new DataTypeCaster();
          const res = s.cast('{"foo": "bar"}', {type: DataType.OBJECT});
          expect(res).to.be.eql({foo: 'bar'});
        });
      });

      it('throws TypeCastError for number', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast(10, {type: DataType.OBJECT});
        expect(throwable).to.throw(TypeCastError);
      });

      it('throws TypeCastError for boolean', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast(true, {type: DataType.OBJECT});
        expect(throwable).to.throw(TypeCastError);
      });

      it('throws TypeCastError for array', function () {
        const s = new DataTypeCaster();
        const throwable = () => s.cast([1, 2, 3], {type: DataType.OBJECT});
        expect(throwable).to.throw(TypeCastError);
      });

      describe('object value', function () {
        it('skips casting if no properties schema specified', function () {
          const s = new DataTypeCaster();
          const res = s.cast({foo: 'bar'}, {type: DataType.OBJECT});
          expect(res).to.be.eql({foo: 'bar'});
        });

        it('casts object properties recursively', function () {
          const s = new DataTypeCaster();
          const value = {
            foo: '10',
            bar: '20',
            baz: '30',
            qwe: {
              asd: '40',
              zxc: '50',
              rty: '60',
            },
          };
          const res = s.cast(value, {
            type: DataType.OBJECT,
            properties: {
              foo: {type: DataType.NUMBER},
              bar: {type: DataType.NUMBER},
              baz: {type: DataType.NUMBER},
              qwe: {
                type: DataType.OBJECT,
                properties: {
                  asd: {type: DataType.NUMBER},
                  zxc: {type: DataType.NUMBER},
                  rty: {type: DataType.NUMBER},
                },
              },
            },
          });
          expect(res).to.be.eql({
            foo: 10,
            bar: 20,
            baz: 30,
            qwe: {
              asd: 40,
              zxc: 50,
              rty: 60,
            },
          });
        });

        it('throws TypeCastError on properties casting fail', function () {
          const s = new DataTypeCaster();
          const value = {foo: 10, bar: '20', baz: 'lorem'};
          const throwable = () =>
            s.cast(value, {
              type: DataType.OBJECT,
              properties: {
                foo: {type: DataType.NUMBER},
                bar: {type: DataType.NUMBER},
                baz: {type: DataType.NUMBER},
              },
            });
          expect(throwable).to.throw(TypeCastError);
        });
      });
    });

    describe('noTypeCastError', function () {
      it('skips casting when target type is Any', function () {
        const s = new DataTypeCaster();
        const res = s.cast(
          'value',
          {type: DataType.ANY},
          {noTypeCastError: true},
        );
        expect(res).to.be.eq('value');
      });

      describe('to string', function () {
        it('skips casting for null', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            null,
            {type: DataType.STRING},
            {noTypeCastError: true},
          );
          expect(res).to.be.null;
        });

        it('skips casting for undefined', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            undefined,
            {type: DataType.STRING},
            {noTypeCastError: true},
          );
          expect(res).to.be.undefined;
        });

        it('skips casting for string', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            'value',
            {type: DataType.STRING},
            {noTypeCastError: true},
          );
          expect(res).to.be.eq('value');
        });

        it('casts number to string', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            10,
            {type: DataType.STRING},
            {noTypeCastError: true},
          );
          expect(res).to.be.eq('10');
        });

        it('skips casting for boolean', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            true,
            {type: DataType.STRING},
            {noTypeCastError: true},
          );
          expect(res).to.be.eq(true);
        });

        it('skips casting for array', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            [1, 2, 3],
            {type: DataType.STRING},
            {noTypeCastError: true},
          );
          expect(res).to.be.eql([1, 2, 3]);
        });

        it('skips casting for object', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            {foo: 'bar'},
            {type: DataType.STRING},
            {noTypeCastError: true},
          );
          expect(res).to.be.eql({foo: 'bar'});
        });
      });

      describe('to array', function () {
        it('skips casting for null', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            null,
            {type: DataType.ARRAY},
            {noTypeCastError: true},
          );
          expect(res).to.be.null;
        });

        it('skips casting for undefined', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            undefined,
            {type: DataType.ARRAY},
            {noTypeCastError: true},
          );
          expect(res).to.be.undefined;
        });

        describe('string value', function () {
          it('skips casting for non-JSON string', function () {
            const s = new DataTypeCaster();
            const res = s.cast(
              'value',
              {type: DataType.ARRAY},
              {noTypeCastError: true},
            );
            expect(res).to.be.eq('value');
          });

          it('casts JSON array to array', function () {
            const s = new DataTypeCaster();
            const res = s.cast(
              '[1, 2, 3]',
              {type: DataType.ARRAY},
              {noTypeCastError: true},
            );
            expect(res).to.be.eql([1, 2, 3]);
          });

          it('skips casting for JSON object', function () {
            const s = new DataTypeCaster();
            const res = s.cast(
              '{"foo": "bar"}',
              {type: DataType.ARRAY},
              {noTypeCastError: true},
            );
            expect(res).to.be.eql('{"foo": "bar"}');
          });
        });

        it('skips casting for number', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            10,
            {type: DataType.ARRAY},
            {noTypeCastError: true},
          );
          expect(res).to.be.eq(10);
        });

        it('skips casting for boolean', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            true,
            {type: DataType.ARRAY},
            {noTypeCastError: true},
          );
          expect(res).to.be.eq(true);
        });

        describe('array value', function () {
          it('skips casting if no items schema specified', function () {
            const s = new DataTypeCaster();
            const res = s.cast(
              [1, 2, 3],
              {type: DataType.ARRAY},
              {noTypeCastError: true},
            );
            expect(res).to.be.eql([1, 2, 3]);
          });

          it('casts array items recursively', function () {
            const s = new DataTypeCaster();
            const value = [10, '20', 'lorem'];
            const schema = {
              type: DataType.ARRAY,
              items: {type: DataType.NUMBER},
            };
            const options = {noTypeCastError: true};
            const res = s.cast(value, schema, options);
            expect(res).to.be.eql([10, 20, 'lorem']);
          });
        });

        it('skips casting for object', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            {foo: 'bar'},
            {type: DataType.ARRAY},
            {noTypeCastError: true},
          );
          expect(res).to.be.eql({foo: 'bar'});
        });
      });

      describe('to object', function () {
        it('skips casting for null', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            null,
            {type: DataType.OBJECT},
            {noTypeCastError: true},
          );
          expect(res).to.be.null;
        });

        it('skips casting for undefined', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            undefined,
            {type: DataType.OBJECT},
            {noTypeCastError: true},
          );
          expect(res).to.be.undefined;
        });

        describe('string value', function () {
          it('skips casting for non-JSON string', function () {
            const s = new DataTypeCaster();
            const res = s.cast(
              'value',
              {type: DataType.OBJECT},
              {noTypeCastError: true},
            );
            expect(res).to.be.eq('value');
          });

          it('skips casting for JSON array', function () {
            const s = new DataTypeCaster();
            const res = s.cast(
              '[1, 2, 3]',
              {type: DataType.OBJECT},
              {noTypeCastError: true},
            );
            expect(res).to.be.eql('[1, 2, 3]');
          });

          it('casts JSON object to object', function () {
            const s = new DataTypeCaster();
            const res = s.cast(
              '{"foo": "bar"}',
              {type: DataType.OBJECT},
              {noTypeCastError: true},
            );
            expect(res).to.be.eql({foo: 'bar'});
          });
        });

        it('skips casting for number', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            10,
            {type: DataType.OBJECT},
            {noTypeCastError: true},
          );
          expect(res).to.be.eq(10);
        });

        it('skips casting for boolean', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            true,
            {type: DataType.OBJECT},
            {noTypeCastError: true},
          );
          expect(res).to.be.eq(true);
        });

        it('skips casting for array', function () {
          const s = new DataTypeCaster();
          const res = s.cast(
            [1, 2, 3],
            {type: DataType.OBJECT},
            {noTypeCastError: true},
          );
          expect(res).to.be.eql([1, 2, 3]);
        });

        describe('object value', function () {
          it('skips casting for object', function () {
            const s = new DataTypeCaster();
            const res = s.cast(
              {foo: 'bar'},
              {type: DataType.OBJECT},
              {noTypeCastError: true},
            );
            expect(res).to.be.eql({foo: 'bar'});
          });

          it('casts object properties recursively', function () {
            const s = new DataTypeCaster();
            const value = {
              foo: 10,
              bar: '20',
              baz: 'lorem',
              qwe: {
                asd: 30,
                zxc: '40',
                rty: 'lorem',
              },
            };
            const schema = {
              type: DataType.OBJECT,
              properties: {
                foo: {type: DataType.NUMBER},
                bar: {type: DataType.NUMBER},
                baz: {type: DataType.NUMBER},
                qwe: {
                  type: DataType.OBJECT,
                  properties: {
                    asd: {type: DataType.NUMBER},
                    zxc: {type: DataType.NUMBER},
                    rty: {type: DataType.NUMBER},
                  },
                },
              },
            };
            const options = {noTypeCastError: true};
            const res = s.cast(value, schema, options);
            expect(res).to.be.eql({
              foo: 10,
              bar: 20,
              baz: 'lorem',
              qwe: {
                asd: 30,
                zxc: 40,
                rty: 'lorem',
              },
            });
          });
        });
      });
    });
  });
});

import {expect} from 'chai';
import {DataType} from './data-schema.js';
import {Service} from '@e22m4u/js-service';
import {DataSchema} from './data-schema.js';
import {EmptyValuesService} from '@e22m4u/js-empty-values';
import {DefaultValuesApplier} from './default-values-applier.js';

describe('DefaultValuesApplier', function () {
  it('extends Service class', function () {
    const res = new DefaultValuesApplier();
    expect(res).to.be.instanceOf(Service);
  });

  describe('applyDefaultValuesIfNeeded', function () {
    it('does nothing if no default value in the given schema', function () {
      const s = new DefaultValuesApplier();
      s.getService(EmptyValuesService).setEmptyValuesOf(DataType.STRING, [
        'foo',
      ]);
      const ds: DataSchema = {type: DataType.STRING};
      const res = s.applyDefaultValuesIfNeeded('foo', ds);
      expect(res).to.be.eq('foo');
    });

    it('uses empty values from EmptyValuesService', function () {
      const s = new DefaultValuesApplier();
      s.getService(EmptyValuesService).setEmptyValuesOf(DataType.STRING, [
        'foo',
      ]);
      const ds: DataSchema = {
        type: DataType.STRING,
        default: 'myDefaultString',
      };
      const res1 = s.applyDefaultValuesIfNeeded('foo', ds);
      const res2 = s.applyDefaultValuesIfNeeded('bar', ds);
      expect(res1).to.be.eq('myDefaultString');
      expect(res2).to.be.eq('bar');
    });

    it('extracts default value from factory and returns as result if the given value is empty', function () {
      const s = new DefaultValuesApplier();
      s.getService(EmptyValuesService).setEmptyValuesOf(DataType.STRING, [
        'foo',
      ]);
      const ds: DataSchema = {
        type: DataType.STRING,
        default: () => 'bar',
      };
      const res1 = s.applyDefaultValuesIfNeeded('foo', ds);
      const res2 = s.applyDefaultValuesIfNeeded('baz', ds);
      expect(res1).to.be.eq('bar');
      expect(res2).to.be.eq('baz');
    });

    it('clones deeply a default value that extracted from factory', function () {
      const s = new DefaultValuesApplier();
      s.getService(EmptyValuesService).setEmptyValuesOf(DataType.ANY, [null]);
      const defaultValue1 = [1, 2, 3];
      const defaultValue2 = {foo: 'bar'};
      const ds1: DataSchema = {
        type: DataType.ANY,
        default: () => defaultValue1,
      };
      const ds2: DataSchema = {
        type: DataType.ANY,
        default: () => defaultValue2,
      };
      const res1 = s.applyDefaultValuesIfNeeded(null, ds1);
      const res2 = s.applyDefaultValuesIfNeeded(null, ds2);
      expect(res1).to.be.not.eq(defaultValue1);
      expect(res2).to.be.not.eq(defaultValue2);
      expect(res1).to.be.eql(defaultValue1);
      expect(res2).to.be.eql(defaultValue2);
    });

    describe('arrays', function () {
      it('sets default values to array items if empty', function () {
        const s = new DefaultValuesApplier();
        s.getService(EmptyValuesService).setEmptyValuesOf(DataType.STRING, [
          'foo',
        ]);
        const ds: DataSchema = {
          type: DataType.ARRAY,
          items: {
            type: DataType.STRING,
            default: 'myDefaultString',
          },
        };
        const res1 = s.applyDefaultValuesIfNeeded(['foo', 'foo', 'bar'], ds);
        const res2 = s.applyDefaultValuesIfNeeded(['bar', 'baz', 'qux'], ds);
        expect(res1).to.be.eql(['myDefaultString', 'myDefaultString', 'bar']);
        expect(res2).to.be.eql(['bar', 'baz', 'qux']);
      });

      it('extracts default value from factory and sets to each empty item', function () {
        const s = new DefaultValuesApplier();
        s.getService(EmptyValuesService).setEmptyValuesOf(DataType.STRING, [
          'foo',
        ]);
        const ds: DataSchema = {
          type: DataType.ARRAY,
          items: {
            type: DataType.STRING,
            default: () => 'myDefaultString',
          },
        };
        const res1 = s.applyDefaultValuesIfNeeded(['foo', 'foo', 'bar'], ds);
        const res2 = s.applyDefaultValuesIfNeeded(['bar', 'baz', 'qux'], ds);
        expect(res1).to.be.eql(['myDefaultString', 'myDefaultString', 'bar']);
        expect(res2).to.be.eql(['bar', 'baz', 'qux']);
      });
    });

    describe('objects', function () {
      it('sets default values to object properties if empty', function () {
        const s = new DefaultValuesApplier();
        s.getService(EmptyValuesService).setEmptyValuesOf(DataType.STRING, [
          'foo',
          undefined,
        ]);
        const ds: DataSchema = {
          type: DataType.OBJECT,
          properties: {
            p1: {
              type: DataType.STRING,
              default: 'myDefaultString',
            },
            p2: {
              type: DataType.STRING,
              default: 'myDefaultString',
            },
          },
        };
        const res1 = s.applyDefaultValuesIfNeeded({p1: 'foo', p2: 'bar'}, ds);
        const res2 = s.applyDefaultValuesIfNeeded({}, ds);
        expect(res1).to.be.eql({p1: 'myDefaultString', p2: 'bar'});
        expect(res2).to.be.eql({p1: 'myDefaultString', p2: 'myDefaultString'});
      });

      it('sets default values to object properties even the object came from a default value', function () {
        const s = new DefaultValuesApplier();
        s.getService(EmptyValuesService).setEmptyValuesOf(DataType.STRING, [
          'foo',
          undefined,
        ]);
        // в данной схеме значением по умолчанию является
        // объект, содержащий свойства указанные в схеме
        const ds1: DataSchema = {
          type: DataType.OBJECT,
          properties: {
            p1: {
              type: DataType.STRING,
              default: 'myDefaultString',
            },
            p2: {
              type: DataType.STRING,
              default: 'myDefaultString',
            },
            p3: {
              type: DataType.STRING,
              default: 'myDefaultString',
            },
          },
          default: {
            p1: 'foo',
            p2: 'bar',
          },
        };
        // проверка способности метода устанавливать
        // значения в свойствах стандартного объекта
        const res1 = s.applyDefaultValuesIfNeeded(undefined, ds1);
        expect(res1).to.be.eql({
          p1: 'myDefaultString',
          p2: 'bar',
          p3: 'myDefaultString',
        });
      });

      it('extracts default values from factory and sets to empty properties', function () {
        const s = new DefaultValuesApplier();
        s.getService(EmptyValuesService).setEmptyValuesOf(DataType.STRING, [
          'foo',
          undefined,
        ]);
        const ds: DataSchema = {
          type: DataType.OBJECT,
          properties: {
            p1: {
              type: DataType.STRING,
              default: () => 'myDefaultString',
            },
            p2: {
              type: DataType.STRING,
              default: () => 'myDefaultString',
            },
          },
        };
        const res1 = s.applyDefaultValuesIfNeeded({p1: 'foo', p2: 'bar'}, ds);
        const res2 = s.applyDefaultValuesIfNeeded({}, ds);
        expect(res1).to.be.eql({p1: 'myDefaultString', p2: 'bar'});
        expect(res2).to.be.eql({p1: 'myDefaultString', p2: 'myDefaultString'});
      });
    });
  });
});

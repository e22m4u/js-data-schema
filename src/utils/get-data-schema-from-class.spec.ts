import {expect} from 'chai';
import {ClassToPlain} from '../types.js';
import {DataType} from '../data-schema.js';
import {dataSchema} from '../decorators/index.js';
import {getDataSchemaFromClass} from './get-data-schema-from-class.js';

describe('getDataSchemaFromClass', function () {
  it('throws an error if no schema defined', function () {
    class MyClass {}
    const throwable = () => getDataSchemaFromClass(MyClass);
    expect(throwable).to.throw('Class MyClass does not have data schema.');
  });

  it('does not throw an error if the option "doNotThrowIfNoMetadata" is true', function () {
    class MyClass {}
    const res = getDataSchemaFromClass(MyClass, true);
    expect(res).to.be.eql({type: DataType.OBJECT});
  });

  it('returns data schema by class metadata', function () {
    const objectSchema = {
      type: DataType.OBJECT,
      required: true,
      properties: {
        foo: {type: DataType.STRING},
        bar: {type: DataType.NUMBER},
      },
    };
    @dataSchema(objectSchema)
    class MyClass {}
    const res = getDataSchemaFromClass(MyClass);
    expect(res).to.be.eql(objectSchema);
  });

  it('returns data schema by properties metadata', function () {
    class MyClass {
      @dataSchema({
        type: DataType.STRING,
        required: true,
      })
      foo?: string;

      @dataSchema({
        type: DataType.NUMBER,
        required: true,
      })
      bar?: number;
    }
    const res = getDataSchemaFromClass(MyClass);
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {
          type: DataType.STRING,
          required: true,
        },
        bar: {
          type: DataType.NUMBER,
          required: true,
        },
      },
    });
  });

  it('merges class and properties metadata', function () {
    const objectSchema = {
      type: DataType.OBJECT,
      required: true,
      properties: {
        foo: {
          type: DataType.STRING,
          required: true,
        },
        bar: {
          type: DataType.NUMBER,
          required: true,
        },
      },
    };
    @dataSchema(objectSchema)
    class MyClass {
      @dataSchema({
        type: DataType.STRING,
        required: true,
      })
      baz?: string;

      @dataSchema({
        type: DataType.NUMBER,
        required: true,
      })
      qux?: number;
    }
    const res = getDataSchemaFromClass(MyClass);
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      required: true,
      properties: {
        foo: {
          type: DataType.STRING,
          required: true,
        },
        bar: {
          type: DataType.NUMBER,
          required: true,
        },
        baz: {
          type: DataType.STRING,
          required: true,
        },
        qux: {
          type: DataType.NUMBER,
          required: true,
        },
      },
    });
  });

  describe('nested data schema by a class factory', function () {
    it('resolves nested schema in object schema', function () {
      @dataSchema({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
          bar: {
            type: DataType.NUMBER,
            required: true,
          },
        },
      })
      class MyClass1 {}
      @dataSchema({
        type: DataType.OBJECT,
        properties: () => MyClass1,
      })
      class MyClass2 {}
      const res = getDataSchemaFromClass(MyClass2);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
          bar: {
            type: DataType.NUMBER,
            required: true,
          },
        },
      });
    });

    it('merges nested schema with properties schema', function () {
      @dataSchema({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
          bar: {
            type: DataType.NUMBER,
            required: true,
          },
        },
      })
      class MyClass1 {}
      @dataSchema({
        type: DataType.OBJECT,
        properties: () => MyClass1,
      })
      class MyClass2 {
        @dataSchema({
          type: DataType.STRING,
          required: true,
        })
        baz?: string;

        @dataSchema({
          type: DataType.NUMBER,
          required: true,
        })
        qux?: number;
      }
      const res = getDataSchemaFromClass(MyClass2);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
          bar: {
            type: DataType.NUMBER,
            required: true,
          },
          baz: {
            type: DataType.STRING,
            required: true,
          },
          qux: {
            type: DataType.NUMBER,
            required: true,
          },
        },
      });
    });

    it('resolves nested schema in properties schema', function () {
      @dataSchema({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
          bar: {
            type: DataType.NUMBER,
            required: true,
          },
        },
      })
      class MyClass1 {}
      @dataSchema({
        type: DataType.OBJECT,
        properties: {
          baz: {
            type: DataType.STRING,
            required: true,
          },
          qux: {
            type: DataType.NUMBER,
            required: true,
          },
        },
      })
      class MyClass2 {}
      class MyClass3 {
        @dataSchema({
          type: DataType.OBJECT,
          properties: () => MyClass1,
          required: true,
        })
        myProp1?: ClassToPlain<MyClass1>;

        @dataSchema({
          type: DataType.OBJECT,
          properties: () => MyClass2,
          required: true,
        })
        myProp2?: ClassToPlain<MyClass2>;
      }
      const res = getDataSchemaFromClass(MyClass3);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          myProp1: {
            type: DataType.OBJECT,
            properties: {
              foo: {
                type: DataType.STRING,
                required: true,
              },
              bar: {
                type: DataType.NUMBER,
                required: true,
              },
            },
            required: true,
          },
          myProp2: {
            type: DataType.OBJECT,
            properties: {
              baz: {
                type: DataType.STRING,
                required: true,
              },
              qux: {
                type: DataType.NUMBER,
                required: true,
              },
            },
            required: true,
          },
        },
      });
    });
  });
});

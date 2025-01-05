/* eslint @typescript-eslint/no-unused-vars: 0 */
import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {DataType} from '../data-schema.js';
import {dsAny} from './data-schema-decorators.js';
import {dsArray} from './data-schema-decorators.js';
import {dsNumber} from './data-schema-decorators.js';
import {dsObject} from './data-schema-decorators.js';
import {dsString} from './data-schema-decorators.js';
import {dsBoolean} from './data-schema-decorators.js';
import {dsProperty} from './data-schema-decorators.js';
import {dataSchema} from './data-schema-decorators.js';
import {DataSchemaReflector} from './data-schema-reflector.js';
import {DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE} from './data-schema-decorators.js';
import {DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE} from './data-schema-decorators.js';

describe('decorators', function () {
  describe('dataSchema', function () {
    it('sets class metadata', function () {
      const md = {type: DataType.OBJECT};
      @dataSchema(md)
      class MyTarget {}
      const res = DataSchemaReflector.getClassMetadata(MyTarget);
      expect(res).to.be.eql(md);
    });

    it('sets instance property metadata', function () {
      const md1 = {type: DataType.STRING};
      const md2 = {type: DataType.NUMBER};
      class MyTarget {
        @dataSchema(md1)
        myProp1?: string;
        @dataSchema(md2)
        myProp2?: number;
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res).to.have.lengthOf(2);
      expect(res!.get('myProp1')).to.be.eql(md1);
      expect(res!.get('myProp2')).to.be.eql(md2);
    });

    it('throws an error if target is a static method', function () {
      const throwable = () => {
        class MyTarget {
          @dataSchema({type: DataType.ANY})
          static myMethod() {}
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dataSchema'),
      );
    });

    it('throws an error if target is an instance method', function () {
      const throwable = () => {
        class MyTarget {
          @dataSchema({type: DataType.ANY})
          myMethod() {}
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dataSchema'),
      );
    });

    it('throws an error if target is a static property', function () {
      const throwable = () => {
        class MyTarget {
          @dataSchema({type: DataType.ANY})
          static myProp?: string;
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dataSchema'),
      );
    });
  });

  describe('dsProperty', function () {
    it('sets instance property metadata', function () {
      const md1 = {type: DataType.STRING};
      const md2 = {type: DataType.NUMBER};
      class MyTarget {
        @dsProperty(md1)
        myProp1?: string;
        @dsProperty(md2)
        myProp2?: number;
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res).to.have.lengthOf(2);
      expect(res!.get('myProp1')).to.be.eql(md1);
      expect(res!.get('myProp2')).to.be.eql(md2);
    });

    it('throws an error if target is an instance method', function () {
      const throwable = () => {
        class MyTarget {
          @dsProperty({type: DataType.ANY})
          myMethod() {}
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsProperty'),
      );
    });
  });

  describe('dsAny', function () {
    it('sets instance property metadata with Any type', function () {
      class MyTarget {
        @dsAny()
        myProp1?: unknown;
        @dsAny()
        myProp2?: unknown;
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res).to.have.lengthOf(2);
      expect(res!.get('myProp1')).to.be.eql({type: DataType.ANY});
      expect(res!.get('myProp2')).to.be.eql({type: DataType.ANY});
    });

    it('merges given options with metadata', function () {
      class MyTarget {
        @dsAny({required: true})
        myProp?: unknown;
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res!.get('myProp')).to.be.eql({
        type: DataType.ANY,
        required: true,
      });
    });

    it('throws an error if target is an instance method', function () {
      const throwable = () => {
        class MyTarget {
          @dsAny()
          myMethod() {}
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsAny'),
      );
    });
  });

  describe('dsString', function () {
    it('sets instance property metadata with String type', function () {
      class MyTarget {
        @dsString()
        myProp1?: string;
        @dsString()
        myProp2?: string;
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res).to.have.lengthOf(2);
      expect(res!.get('myProp1')).to.be.eql({type: DataType.STRING});
      expect(res!.get('myProp2')).to.be.eql({type: DataType.STRING});
    });

    it('merges given options with metadata', function () {
      class MyTarget {
        @dsString({required: true})
        myProp?: string;
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res!.get('myProp')).to.be.eql({
        type: DataType.STRING,
        required: true,
      });
    });

    it('throws an error if target is an instance method', function () {
      const throwable = () => {
        class MyTarget {
          @dsString()
          myMethod() {}
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsString'),
      );
    });
  });

  describe('dsNumber', function () {
    it('sets instance property metadata with String type', function () {
      class MyTarget {
        @dsNumber()
        myProp1?: number;
        @dsNumber()
        myProp2?: number;
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res).to.have.lengthOf(2);
      expect(res!.get('myProp1')).to.be.eql({type: DataType.NUMBER});
      expect(res!.get('myProp2')).to.be.eql({type: DataType.NUMBER});
    });

    it('merges given options with metadata', function () {
      class MyTarget {
        @dsNumber({required: true})
        myProp?: number;
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res!.get('myProp')).to.be.eql({
        type: DataType.NUMBER,
        required: true,
      });
    });

    it('throws an error if target is an instance method', function () {
      const throwable = () => {
        class MyTarget {
          @dsNumber()
          myMethod() {}
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsNumber'),
      );
    });
  });

  describe('dsBoolean', function () {
    it('sets instance property metadata with String type', function () {
      class MyTarget {
        @dsBoolean()
        myProp1?: boolean;
        @dsBoolean()
        myProp2?: boolean;
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res).to.have.lengthOf(2);
      expect(res!.get('myProp1')).to.be.eql({type: DataType.BOOLEAN});
      expect(res!.get('myProp2')).to.be.eql({type: DataType.BOOLEAN});
    });

    it('merges given options with metadata', function () {
      class MyTarget {
        @dsBoolean({required: true})
        myProp?: boolean;
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res!.get('myProp')).to.be.eql({
        type: DataType.BOOLEAN,
        required: true,
      });
    });

    it('throws an error if target is an instance method', function () {
      const throwable = () => {
        class MyTarget {
          @dsBoolean()
          myMethod() {}
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsBoolean'),
      );
    });
  });

  describe('dsArray', function () {
    it('sets instance property metadata with Array type', function () {
      class MyTarget {
        @dsArray()
        myProp1?: unknown[];
        @dsArray()
        myProp2?: unknown[];
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res).to.have.lengthOf(2);
      expect(res!.get('myProp1')).to.be.eql({type: DataType.ARRAY});
      expect(res!.get('myProp2')).to.be.eql({type: DataType.ARRAY});
    });

    it('merges given options with metadata', function () {
      class MyTarget {
        @dsArray({required: true})
        myProp?: unknown[];
      }
      const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
      expect(res).to.be.instanceof(Map);
      expect(res!.get('myProp')).to.be.eql({
        type: DataType.ARRAY,
        required: true,
      });
    });

    it('throws an error if target is an instance method', function () {
      const throwable = () => {
        class MyTarget {
          @dsArray()
          myMethod() {}
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsArray'),
      );
    });

    describe('if the first parameter is a string', function () {
      it('uses the given type as items type', function () {
        class MyTarget {
          @dsArray(DataType.STRING)
          myProp?: string[];
        }
        const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
        expect(res).to.be.instanceof(Map);
        expect(res!.get('myProp')).to.be.eql({
          type: DataType.ARRAY,
          items: {type: DataType.STRING},
        });
      });

      it('uses the second parameter as array schema', function () {
        class MyTarget {
          @dsArray(DataType.STRING, {required: true})
          myProp?: string[];
        }
        const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
        expect(res).to.be.instanceof(Map);
        expect(res!.get('myProp')).to.be.eql({
          type: DataType.ARRAY,
          items: {type: DataType.STRING},
          required: true,
        });
      });
    });

    describe('if the first parameter has the type option', function () {
      it('uses the first parameter as items schema', function () {
        class MyTarget {
          @dsArray({type: DataType.STRING})
          myProp?: string[];
        }
        const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
        expect(res).to.be.instanceof(Map);
        expect(res!.get('myProp')).to.be.eql({
          type: DataType.ARRAY,
          items: {type: DataType.STRING},
        });
      });

      it('uses the second parameter as array schema', function () {
        class MyTarget {
          @dsArray({type: DataType.STRING}, {required: true})
          myProp?: string[];
        }
        const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
        expect(res).to.be.instanceof(Map);
        expect(res!.get('myProp')).to.be.eql({
          type: DataType.ARRAY,
          items: {type: DataType.STRING},
          required: true,
        });
      });
    });

    describe('if the first parameter is a schema object without the type option', function () {
      it('uses the first parameter as array schema', function () {
        class MyTarget {
          @dsArray({required: true})
          myProp?: unknown[];
        }
        const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
        expect(res).to.be.instanceof(Map);
        expect(res!.get('myProp')).to.be.eql({
          type: DataType.ARRAY,
          required: true,
        });
      });
    });
  });

  describe('dsObject', function () {
    it('throws an error if target is a static method', function () {
      const throwable = () => {
        class MyTarget {
          @dsObject()
          static myMethod() {}
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsObject'),
      );
    });

    it('throws an error if target is an instance method', function () {
      const throwable = () => {
        class MyTarget {
          @dsObject()
          myMethod() {}
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsObject'),
      );
    });

    it('throws an error if target is a static property', function () {
      const throwable = () => {
        class MyTarget {
          @dsObject()
          static myProp?: string;
        }
      };
      expect(throwable).to.throw(
        format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsObject'),
      );
    });

    describe('if target is a class', function () {
      it('sets class metadata', function () {
        @dsObject()
        class MyTarget {}
        const res = DataSchemaReflector.getClassMetadata(MyTarget);
        expect(res).to.be.eql({type: DataType.OBJECT});
      });

      describe('if the first parameter is a schema object', function () {
        it('merges given options with metadata', function () {
          @dsObject({required: true})
          class MyTarget {}
          const res = DataSchemaReflector.getClassMetadata(MyTarget);
          expect(res).to.be.eql({
            type: DataType.OBJECT,
            required: true,
          });
        });

        it('allows to set a class factory to the properties option', function () {
          class MyClass {}
          const factory = () => MyClass;
          @dsObject({properties: factory})
          class MyTarget {}
          const res = DataSchemaReflector.getClassMetadata(MyTarget);
          expect(res).to.be.eql({
            type: DataType.OBJECT,
            properties: factory,
          });
        });
      });

      describe('if the first parameter is a class factory', function () {
        it('sets the given factory to the properties option', function () {
          class MyClass {}
          const factory = () => MyClass;
          @dsObject(factory)
          class MyTarget {}
          const res = DataSchemaReflector.getClassMetadata(MyTarget);
          expect(res).to.be.eql({
            type: DataType.OBJECT,
            properties: factory,
          });
        });

        it('uses the second parameter as object schema', function () {
          class MyClass {}
          const factory = () => MyClass;
          @dsObject(factory, {required: true})
          class MyTarget {}
          const res = DataSchemaReflector.getClassMetadata(MyTarget);
          expect(res).to.be.eql({
            type: DataType.OBJECT,
            properties: factory,
            required: true,
          });
        });
      });
    });

    describe('if target is an instance property', function () {
      it('sets instance property metadata', function () {
        class MyTarget {
          @dsObject()
          myProp1?: object;
          @dsObject()
          myProp2?: object;
        }
        const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
        expect(res).to.be.instanceof(Map);
        expect(res).to.have.lengthOf(2);
        expect(res!.get('myProp1')).to.be.eql({type: DataType.OBJECT});
        expect(res!.get('myProp2')).to.be.eql({type: DataType.OBJECT});
      });

      describe('if the first parameter is a schema object', function () {
        it('merges given options with metadata', function () {
          class MyTarget {
            @dsObject({required: true})
            myProp?: object;
          }
          const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
          expect(res).to.be.instanceof(Map);
          expect(res!.get('myProp')).to.be.eql({
            type: DataType.OBJECT,
            required: true,
          });
        });

        it('allows to set a class factory to the properties option', function () {
          class MyClass {}
          const factory = () => MyClass;
          class MyTarget {
            @dsObject({properties: factory})
            myProp?: object;
          }
          const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
          expect(res).to.be.instanceof(Map);
          expect(res!.get('myProp')).to.be.eql({
            type: DataType.OBJECT,
            properties: factory,
          });
        });
      });

      describe('if the first parameter is a class factory', function () {
        it('sets the given factory to the properties option', function () {
          class MyClass {}
          const factory = () => MyClass;
          class MyTarget {
            @dsObject(factory)
            myProp?: object;
          }
          const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
          expect(res).to.be.instanceof(Map);
          expect(res!.get('myProp')).to.be.eql({
            type: DataType.OBJECT,
            properties: factory,
          });
        });

        it('uses the second parameter as object schema', function () {
          class MyClass {}
          const factory = () => MyClass;
          class MyTarget {
            @dsObject(factory, {required: true})
            myProp?: object;
          }
          const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
          expect(res).to.be.instanceof(Map);
          expect(res!.get('myProp')).to.be.eql({
            type: DataType.OBJECT,
            properties: factory,
            required: true,
          });
        });
      });
    });
  });
});

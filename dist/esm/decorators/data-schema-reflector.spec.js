import { expect } from 'chai';
import { DataType } from '../data-schema.js';
import { Reflector } from '@e22m4u/ts-reflector';
import { DataSchemaReflector } from './data-schema-reflector.js';
import { DATA_SCHEMA_CLASS_METADATA_KEY } from './data-schema-metadata.js';
import { DATA_SCHEMA_PROPERTIES_METADATA_KEY } from './data-schema-metadata.js';
describe('DataSchemaReflector', function () {
    describe('setMetadata', function () {
        it('sets metadata of class', function () {
            class MyTarget {
            }
            const md = { type: DataType.OBJECT };
            DataSchemaReflector.setMetadata(md, MyTarget);
            const res = Reflector.getOwnMetadata(DATA_SCHEMA_CLASS_METADATA_KEY, MyTarget);
            expect(res).to.be.eql(md);
        });
        it('adds metadata of instance property', function () {
            class MyTarget {
            }
            const md1 = { type: DataType.STRING };
            const md2 = { type: DataType.NUMBER };
            DataSchemaReflector.setMetadata(md1, MyTarget, 'myProp1');
            DataSchemaReflector.setMetadata(md2, MyTarget, 'myProp2');
            const res = Reflector.getOwnMetadata(DATA_SCHEMA_PROPERTIES_METADATA_KEY, MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res).to.have.lengthOf(2);
            expect(res.get('myProp1')).to.be.eq(md1);
            expect(res.get('myProp2')).to.be.eq(md2);
        });
        it('overrides metadata of instance property', function () {
            class MyTarget {
            }
            const md1 = { type: DataType.STRING };
            const md2 = { type: DataType.NUMBER };
            DataSchemaReflector.setMetadata(md1, MyTarget, 'myProp');
            const res1 = Reflector.getOwnMetadata(DATA_SCHEMA_PROPERTIES_METADATA_KEY, MyTarget);
            expect(res1).to.be.instanceof(Map);
            expect(res1).to.have.lengthOf(1);
            expect(res1).to.have.key('myProp');
            expect(res1.get('myProp')).to.be.eq(md1);
            DataSchemaReflector.setMetadata(md2, MyTarget, 'myProp');
            const res2 = Reflector.getOwnMetadata(DATA_SCHEMA_PROPERTIES_METADATA_KEY, MyTarget);
            expect(res2).to.be.instanceof(Map);
            expect(res2).to.have.lengthOf(1);
            expect(res2.get('myProp')).to.be.eq(md2);
        });
    });
    describe('getClassMetadata', function () {
        it('returns undefined if no metadata', function () {
            class MyTarget {
            }
            const res = DataSchemaReflector.getClassMetadata(MyTarget);
            expect(res).to.be.undefined;
        });
        it('returns metadata from target', function () {
            class MyTarget {
            }
            const md = { type: DataType.OBJECT };
            Reflector.defineMetadata(DATA_SCHEMA_CLASS_METADATA_KEY, md, MyTarget);
            const res = DataSchemaReflector.getClassMetadata(MyTarget);
            expect(res).to.be.eq(md);
        });
    });
    describe('getPropertiesMetadata', function () {
        it('returns an empty map if no metadata', function () {
            class MyTarget {
            }
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res).to.be.empty;
        });
        it('returns map of instance properties', function () {
            class MyTarget {
            }
            const md1 = { type: DataType.STRING };
            const md2 = { type: DataType.NUMBER };
            const mdMap = new Map([
                ['myProp1', md1],
                ['myProp2', md2],
            ]);
            Reflector.defineMetadata(DATA_SCHEMA_PROPERTIES_METADATA_KEY, mdMap, MyTarget);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res).to.have.lengthOf(2);
            expect(res.get('myProp1')).to.be.eq(md1);
            expect(res.get('myProp2')).to.be.eq(md2);
        });
    });
});

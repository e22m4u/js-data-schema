var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/* eslint @typescript-eslint/no-unused-vars: 0 */
import { expect } from 'chai';
import { format } from '@e22m4u/js-format';
import { DataType } from '../data-schema.js';
import { dsAny } from './data-schema-decorators.js';
import { dsArray } from './data-schema-decorators.js';
import { dsNumber } from './data-schema-decorators.js';
import { dsObject } from './data-schema-decorators.js';
import { dsString } from './data-schema-decorators.js';
import { dsBoolean } from './data-schema-decorators.js';
import { dsProperty } from './data-schema-decorators.js';
import { dataSchema } from './data-schema-decorators.js';
import { DataSchemaReflector } from './data-schema-reflector.js';
import { DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE } from './data-schema-decorators.js';
import { DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE } from './data-schema-decorators.js';
describe('decorators', function () {
    describe('dataSchema', function () {
        it('sets class metadata', function () {
            const md = { type: DataType.OBJECT };
            let MyTarget = class MyTarget {
            };
            MyTarget = __decorate([
                dataSchema(md)
            ], MyTarget);
            const res = DataSchemaReflector.getClassMetadata(MyTarget);
            expect(res).to.be.eql(md);
        });
        it('sets instance property metadata', function () {
            const md1 = { type: DataType.STRING };
            const md2 = { type: DataType.NUMBER };
            class MyTarget {
                myProp1;
                myProp2;
            }
            __decorate([
                dataSchema(md1),
                __metadata("design:type", String)
            ], MyTarget.prototype, "myProp1", void 0);
            __decorate([
                dataSchema(md2),
                __metadata("design:type", Number)
            ], MyTarget.prototype, "myProp2", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res).to.have.lengthOf(2);
            expect(res.get('myProp1')).to.be.eql(md1);
            expect(res.get('myProp2')).to.be.eql(md2);
        });
        it('throws an error if target is a static method', function () {
            const throwable = () => {
                class MyTarget {
                    static myMethod() { }
                }
                __decorate([
                    dataSchema({ type: DataType.ANY }),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], MyTarget, "myMethod", null);
            };
            expect(throwable).to.throw(format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dataSchema'));
        });
        it('throws an error if target is an instance method', function () {
            const throwable = () => {
                class MyTarget {
                    myMethod() { }
                }
                __decorate([
                    dataSchema({ type: DataType.ANY }),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], MyTarget.prototype, "myMethod", null);
            };
            expect(throwable).to.throw(format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dataSchema'));
        });
        it('throws an error if target is a static property', function () {
            const throwable = () => {
                class MyTarget {
                    static myProp;
                }
                __decorate([
                    dataSchema({ type: DataType.ANY }),
                    __metadata("design:type", String)
                ], MyTarget, "myProp", void 0);
            };
            expect(throwable).to.throw(format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dataSchema'));
        });
        it('allows to set a class factory to the properties option', function () {
            class MyClass {
            }
            const classFactory = () => MyClass;
            class MyTarget {
                myProp;
            }
            __decorate([
                dataSchema({
                    type: DataType.OBJECT,
                    properties: classFactory,
                }),
                __metadata("design:type", Array)
            ], MyTarget.prototype, "myProp", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res.get('myProp')).to.be.eql({
                type: DataType.OBJECT,
                properties: classFactory,
            });
        });
        it('allows to set a class factory to the items option', function () {
            class MyClass {
            }
            const classFactory = () => MyClass;
            class MyTarget {
                myProp;
            }
            __decorate([
                dataSchema({
                    type: DataType.ARRAY,
                    items: classFactory,
                }),
                __metadata("design:type", Array)
            ], MyTarget.prototype, "myProp", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res.get('myProp')).to.be.eql({
                type: DataType.ARRAY,
                items: classFactory,
            });
        });
    });
    describe('dsProperty', function () {
        it('sets instance property metadata', function () {
            const md1 = { type: DataType.STRING };
            const md2 = { type: DataType.NUMBER };
            class MyTarget {
                myProp1;
                myProp2;
            }
            __decorate([
                dsProperty(md1),
                __metadata("design:type", String)
            ], MyTarget.prototype, "myProp1", void 0);
            __decorate([
                dsProperty(md2),
                __metadata("design:type", Number)
            ], MyTarget.prototype, "myProp2", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res).to.have.lengthOf(2);
            expect(res.get('myProp1')).to.be.eql(md1);
            expect(res.get('myProp2')).to.be.eql(md2);
        });
        it('throws an error if target is an instance method', function () {
            const throwable = () => {
                class MyTarget {
                    myMethod() { }
                }
                __decorate([
                    dsProperty({ type: DataType.ANY }),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], MyTarget.prototype, "myMethod", null);
            };
            expect(throwable).to.throw(format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsProperty'));
        });
    });
    describe('dsAny', function () {
        it('sets instance property metadata with Any type', function () {
            class MyTarget {
                myProp1;
                myProp2;
            }
            __decorate([
                dsAny(),
                __metadata("design:type", Object)
            ], MyTarget.prototype, "myProp1", void 0);
            __decorate([
                dsAny(),
                __metadata("design:type", Object)
            ], MyTarget.prototype, "myProp2", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res).to.have.lengthOf(2);
            expect(res.get('myProp1')).to.be.eql({ type: DataType.ANY });
            expect(res.get('myProp2')).to.be.eql({ type: DataType.ANY });
        });
        it('merges given options with metadata', function () {
            class MyTarget {
                myProp;
            }
            __decorate([
                dsAny({ required: true }),
                __metadata("design:type", Object)
            ], MyTarget.prototype, "myProp", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res.get('myProp')).to.be.eql({
                type: DataType.ANY,
                required: true,
            });
        });
        it('throws an error if target is an instance method', function () {
            const throwable = () => {
                class MyTarget {
                    myMethod() { }
                }
                __decorate([
                    dsAny(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], MyTarget.prototype, "myMethod", null);
            };
            expect(throwable).to.throw(format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsAny'));
        });
    });
    describe('dsString', function () {
        it('sets instance property metadata with String type', function () {
            class MyTarget {
                myProp1;
                myProp2;
            }
            __decorate([
                dsString(),
                __metadata("design:type", String)
            ], MyTarget.prototype, "myProp1", void 0);
            __decorate([
                dsString(),
                __metadata("design:type", String)
            ], MyTarget.prototype, "myProp2", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res).to.have.lengthOf(2);
            expect(res.get('myProp1')).to.be.eql({ type: DataType.STRING });
            expect(res.get('myProp2')).to.be.eql({ type: DataType.STRING });
        });
        it('merges given options with metadata', function () {
            class MyTarget {
                myProp;
            }
            __decorate([
                dsString({ required: true }),
                __metadata("design:type", String)
            ], MyTarget.prototype, "myProp", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res.get('myProp')).to.be.eql({
                type: DataType.STRING,
                required: true,
            });
        });
        it('throws an error if target is an instance method', function () {
            const throwable = () => {
                class MyTarget {
                    myMethod() { }
                }
                __decorate([
                    dsString(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], MyTarget.prototype, "myMethod", null);
            };
            expect(throwable).to.throw(format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsString'));
        });
    });
    describe('dsNumber', function () {
        it('sets instance property metadata with String type', function () {
            class MyTarget {
                myProp1;
                myProp2;
            }
            __decorate([
                dsNumber(),
                __metadata("design:type", Number)
            ], MyTarget.prototype, "myProp1", void 0);
            __decorate([
                dsNumber(),
                __metadata("design:type", Number)
            ], MyTarget.prototype, "myProp2", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res).to.have.lengthOf(2);
            expect(res.get('myProp1')).to.be.eql({ type: DataType.NUMBER });
            expect(res.get('myProp2')).to.be.eql({ type: DataType.NUMBER });
        });
        it('merges given options with metadata', function () {
            class MyTarget {
                myProp;
            }
            __decorate([
                dsNumber({ required: true }),
                __metadata("design:type", Number)
            ], MyTarget.prototype, "myProp", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res.get('myProp')).to.be.eql({
                type: DataType.NUMBER,
                required: true,
            });
        });
        it('throws an error if target is an instance method', function () {
            const throwable = () => {
                class MyTarget {
                    myMethod() { }
                }
                __decorate([
                    dsNumber(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], MyTarget.prototype, "myMethod", null);
            };
            expect(throwable).to.throw(format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsNumber'));
        });
    });
    describe('dsBoolean', function () {
        it('sets instance property metadata with String type', function () {
            class MyTarget {
                myProp1;
                myProp2;
            }
            __decorate([
                dsBoolean(),
                __metadata("design:type", Boolean)
            ], MyTarget.prototype, "myProp1", void 0);
            __decorate([
                dsBoolean(),
                __metadata("design:type", Boolean)
            ], MyTarget.prototype, "myProp2", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res).to.have.lengthOf(2);
            expect(res.get('myProp1')).to.be.eql({ type: DataType.BOOLEAN });
            expect(res.get('myProp2')).to.be.eql({ type: DataType.BOOLEAN });
        });
        it('merges given options with metadata', function () {
            class MyTarget {
                myProp;
            }
            __decorate([
                dsBoolean({ required: true }),
                __metadata("design:type", Boolean)
            ], MyTarget.prototype, "myProp", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res.get('myProp')).to.be.eql({
                type: DataType.BOOLEAN,
                required: true,
            });
        });
        it('throws an error if target is an instance method', function () {
            const throwable = () => {
                class MyTarget {
                    myMethod() { }
                }
                __decorate([
                    dsBoolean(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], MyTarget.prototype, "myMethod", null);
            };
            expect(throwable).to.throw(format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsBoolean'));
        });
    });
    describe('dsArray', function () {
        it('sets instance property metadata with Array type', function () {
            class MyTarget {
                myProp1;
                myProp2;
            }
            __decorate([
                dsArray(),
                __metadata("design:type", Array)
            ], MyTarget.prototype, "myProp1", void 0);
            __decorate([
                dsArray(),
                __metadata("design:type", Array)
            ], MyTarget.prototype, "myProp2", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res).to.have.lengthOf(2);
            expect(res.get('myProp1')).to.be.eql({ type: DataType.ARRAY });
            expect(res.get('myProp2')).to.be.eql({ type: DataType.ARRAY });
        });
        it('merges given options with metadata', function () {
            class MyTarget {
                myProp;
            }
            __decorate([
                dsArray({ required: true }),
                __metadata("design:type", Array)
            ], MyTarget.prototype, "myProp", void 0);
            const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
            expect(res).to.be.instanceof(Map);
            expect(res.get('myProp')).to.be.eql({
                type: DataType.ARRAY,
                required: true,
            });
        });
        it('throws an error if target is an instance method', function () {
            const throwable = () => {
                class MyTarget {
                    myMethod() { }
                }
                __decorate([
                    dsArray(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], MyTarget.prototype, "myMethod", null);
            };
            expect(throwable).to.throw(format(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsArray'));
        });
        describe('if the first parameter is a string', function () {
            it('uses the given type as items type', function () {
                class MyTarget {
                    myProp;
                }
                __decorate([
                    dsArray(DataType.STRING),
                    __metadata("design:type", Array)
                ], MyTarget.prototype, "myProp", void 0);
                const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                expect(res).to.be.instanceof(Map);
                expect(res.get('myProp')).to.be.eql({
                    type: DataType.ARRAY,
                    items: { type: DataType.STRING },
                });
            });
            it('uses the second parameter as array schema', function () {
                class MyTarget {
                    myProp;
                }
                __decorate([
                    dsArray(DataType.STRING, { required: true }),
                    __metadata("design:type", Array)
                ], MyTarget.prototype, "myProp", void 0);
                const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                expect(res).to.be.instanceof(Map);
                expect(res.get('myProp')).to.be.eql({
                    type: DataType.ARRAY,
                    items: { type: DataType.STRING },
                    required: true,
                });
            });
        });
        describe('if the first parameter is a class factory', function () {
            it('uses the first parameter as items schema', function () {
                class MyClass {
                }
                const classFactory = () => MyClass;
                class MyTarget {
                    myProp;
                }
                __decorate([
                    dsArray(classFactory),
                    __metadata("design:type", Array)
                ], MyTarget.prototype, "myProp", void 0);
                const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                expect(res).to.be.instanceof(Map);
                expect(res.get('myProp')).to.be.eql({
                    type: DataType.ARRAY,
                    items: classFactory,
                });
            });
            it('uses the second parameter as array schema', function () {
                class MyClass {
                }
                const classFactory = () => MyClass;
                class MyTarget {
                    myProp;
                }
                __decorate([
                    dsArray(classFactory, { required: true }),
                    __metadata("design:type", Array)
                ], MyTarget.prototype, "myProp", void 0);
                const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                expect(res).to.be.instanceof(Map);
                expect(res.get('myProp')).to.be.eql({
                    type: DataType.ARRAY,
                    items: classFactory,
                    required: true,
                });
            });
        });
        describe('if the first parameter is a schema object with the type option', function () {
            it('uses the first parameter as items schema', function () {
                class MyTarget {
                    myProp;
                }
                __decorate([
                    dsArray({ type: DataType.STRING }),
                    __metadata("design:type", Array)
                ], MyTarget.prototype, "myProp", void 0);
                const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                expect(res).to.be.instanceof(Map);
                expect(res.get('myProp')).to.be.eql({
                    type: DataType.ARRAY,
                    items: { type: DataType.STRING },
                });
            });
            it('uses the second parameter as array schema', function () {
                class MyTarget {
                    myProp;
                }
                __decorate([
                    dsArray({ type: DataType.STRING }, { required: true }),
                    __metadata("design:type", Array)
                ], MyTarget.prototype, "myProp", void 0);
                const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                expect(res).to.be.instanceof(Map);
                expect(res.get('myProp')).to.be.eql({
                    type: DataType.ARRAY,
                    items: { type: DataType.STRING },
                    required: true,
                });
            });
            describe('for object items', function () {
                it('allows to set a class factory to the properties option of items', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsArray({
                            type: DataType.OBJECT,
                            properties: classFactory,
                        }),
                        __metadata("design:type", Array)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.ARRAY,
                        items: {
                            type: DataType.OBJECT,
                            properties: classFactory,
                        },
                    });
                });
                it('allows to set a class factory to property schema', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsArray({
                            type: DataType.OBJECT,
                            properties: {
                                foo: classFactory,
                                bar: classFactory,
                            },
                        }),
                        __metadata("design:type", Array)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.ARRAY,
                        items: {
                            type: DataType.OBJECT,
                            properties: {
                                foo: classFactory,
                                bar: classFactory,
                            },
                        },
                    });
                });
                it('allows to set a class factory to the properties option of property', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsArray({
                            type: DataType.OBJECT,
                            properties: {
                                foo: {
                                    type: DataType.OBJECT,
                                    properties: classFactory,
                                },
                                bar: {
                                    type: DataType.OBJECT,
                                    properties: classFactory,
                                },
                            },
                        }),
                        __metadata("design:type", Array)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.ARRAY,
                        items: {
                            type: DataType.OBJECT,
                            properties: {
                                foo: {
                                    type: DataType.OBJECT,
                                    properties: classFactory,
                                },
                                bar: {
                                    type: DataType.OBJECT,
                                    properties: classFactory,
                                },
                            },
                        },
                    });
                });
            });
            describe('for array items', function () {
                it('allows to set a class factory to the items option of items', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsArray({
                            type: DataType.ARRAY,
                            items: classFactory,
                        }),
                        __metadata("design:type", Array)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.ARRAY,
                        items: {
                            type: DataType.ARRAY,
                            items: classFactory,
                        },
                    });
                });
            });
        });
        describe('if the first parameter is a schema object without the type option', function () {
            it('uses the first parameter as array schema', function () {
                class MyTarget {
                    myProp;
                }
                __decorate([
                    dsArray({ required: true }),
                    __metadata("design:type", Array)
                ], MyTarget.prototype, "myProp", void 0);
                const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                expect(res).to.be.instanceof(Map);
                expect(res.get('myProp')).to.be.eql({
                    type: DataType.ARRAY,
                    required: true,
                });
            });
            describe('for object items', function () {
                it('allows to set a class factory to the properties option of items', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsArray({
                            items: {
                                type: DataType.OBJECT,
                                properties: classFactory,
                            },
                        }),
                        __metadata("design:type", Array)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.ARRAY,
                        items: {
                            type: DataType.OBJECT,
                            properties: classFactory,
                        },
                    });
                });
                it('allows to set a class factory to property schema', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsArray({
                            items: {
                                type: DataType.OBJECT,
                                properties: {
                                    foo: classFactory,
                                    bar: classFactory,
                                },
                            },
                        }),
                        __metadata("design:type", Array)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.ARRAY,
                        items: {
                            type: DataType.OBJECT,
                            properties: {
                                foo: classFactory,
                                bar: classFactory,
                            },
                        },
                    });
                });
                it('allows to set a class factory to the properties option of property', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsArray({
                            items: {
                                type: DataType.OBJECT,
                                properties: {
                                    foo: {
                                        type: DataType.OBJECT,
                                        properties: classFactory,
                                    },
                                    bar: {
                                        type: DataType.OBJECT,
                                        properties: classFactory,
                                    },
                                },
                            },
                        }),
                        __metadata("design:type", Array)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.ARRAY,
                        items: {
                            type: DataType.OBJECT,
                            properties: {
                                foo: {
                                    type: DataType.OBJECT,
                                    properties: classFactory,
                                },
                                bar: {
                                    type: DataType.OBJECT,
                                    properties: classFactory,
                                },
                            },
                        },
                    });
                });
            });
            describe('for array items', function () {
                it('allows to set a class factory to the items option of items', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsArray({
                            items: {
                                type: DataType.ARRAY,
                                items: classFactory,
                            },
                        }),
                        __metadata("design:type", Array)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.ARRAY,
                        items: {
                            type: DataType.ARRAY,
                            items: classFactory,
                        },
                    });
                });
            });
        });
    });
    describe('dsObject', function () {
        it('throws an error if target is a static method', function () {
            const throwable = () => {
                class MyTarget {
                    static myMethod() { }
                }
                __decorate([
                    dsObject(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], MyTarget, "myMethod", null);
            };
            expect(throwable).to.throw(format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsObject'));
        });
        it('throws an error if target is an instance method', function () {
            const throwable = () => {
                class MyTarget {
                    myMethod() { }
                }
                __decorate([
                    dsObject(),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], MyTarget.prototype, "myMethod", null);
            };
            expect(throwable).to.throw(format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsObject'));
        });
        it('throws an error if target is a static property', function () {
            const throwable = () => {
                class MyTarget {
                    static myProp;
                }
                __decorate([
                    dsObject(),
                    __metadata("design:type", String)
                ], MyTarget, "myProp", void 0);
            };
            expect(throwable).to.throw(format(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, 'dsObject'));
        });
        describe('if the target is a class', function () {
            it('sets class metadata', function () {
                let MyTarget = class MyTarget {
                };
                MyTarget = __decorate([
                    dsObject()
                ], MyTarget);
                const res = DataSchemaReflector.getClassMetadata(MyTarget);
                expect(res).to.be.eql({ type: DataType.OBJECT });
            });
            describe('if the first parameter is a schema object', function () {
                it('merges given options with metadata', function () {
                    let MyTarget = class MyTarget {
                    };
                    MyTarget = __decorate([
                        dsObject({ required: true })
                    ], MyTarget);
                    const res = DataSchemaReflector.getClassMetadata(MyTarget);
                    expect(res).to.be.eql({
                        type: DataType.OBJECT,
                        required: true,
                    });
                });
                it('allows to set a class factory to the properties option', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    let MyTarget = class MyTarget {
                    };
                    MyTarget = __decorate([
                        dsObject({ properties: classFactory })
                    ], MyTarget);
                    const res = DataSchemaReflector.getClassMetadata(MyTarget);
                    expect(res).to.be.eql({
                        type: DataType.OBJECT,
                        properties: classFactory,
                    });
                });
                it('allows to set a class factory to property schema', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    let MyTarget = class MyTarget {
                    };
                    MyTarget = __decorate([
                        dsObject({
                            properties: {
                                foo: classFactory,
                                bar: classFactory,
                            },
                        })
                    ], MyTarget);
                    const res = DataSchemaReflector.getClassMetadata(MyTarget);
                    expect(res).to.be.eql({
                        type: DataType.OBJECT,
                        properties: {
                            foo: classFactory,
                            bar: classFactory,
                        },
                    });
                });
                it('allows to set a class factory to the properties option of property', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    let MyTarget = class MyTarget {
                    };
                    MyTarget = __decorate([
                        dsObject({
                            properties: {
                                foo: {
                                    type: DataType.OBJECT,
                                    properties: classFactory,
                                },
                                bar: {
                                    type: DataType.OBJECT,
                                    properties: classFactory,
                                },
                            },
                        })
                    ], MyTarget);
                    const res = DataSchemaReflector.getClassMetadata(MyTarget);
                    expect(res).to.be.eql({
                        type: DataType.OBJECT,
                        properties: {
                            foo: {
                                type: DataType.OBJECT,
                                properties: classFactory,
                            },
                            bar: {
                                type: DataType.OBJECT,
                                properties: classFactory,
                            },
                        },
                    });
                });
            });
            describe('if the first parameter is a class factory', function () {
                it('sets the given factory to the properties option', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    let MyTarget = class MyTarget {
                    };
                    MyTarget = __decorate([
                        dsObject(classFactory)
                    ], MyTarget);
                    const res = DataSchemaReflector.getClassMetadata(MyTarget);
                    expect(res).to.be.eql({
                        type: DataType.OBJECT,
                        properties: classFactory,
                    });
                });
                it('uses the second parameter as object schema', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    let MyTarget = class MyTarget {
                    };
                    MyTarget = __decorate([
                        dsObject(classFactory, { required: true })
                    ], MyTarget);
                    const res = DataSchemaReflector.getClassMetadata(MyTarget);
                    expect(res).to.be.eql({
                        type: DataType.OBJECT,
                        properties: classFactory,
                        required: true,
                    });
                });
            });
        });
        describe('if the target is an instance property', function () {
            it('sets instance property metadata', function () {
                class MyTarget {
                    myProp1;
                    myProp2;
                }
                __decorate([
                    dsObject(),
                    __metadata("design:type", Object)
                ], MyTarget.prototype, "myProp1", void 0);
                __decorate([
                    dsObject(),
                    __metadata("design:type", Object)
                ], MyTarget.prototype, "myProp2", void 0);
                const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                expect(res).to.be.instanceof(Map);
                expect(res).to.have.lengthOf(2);
                expect(res.get('myProp1')).to.be.eql({ type: DataType.OBJECT });
                expect(res.get('myProp2')).to.be.eql({ type: DataType.OBJECT });
            });
            describe('if the first parameter is a schema object', function () {
                it('merges given options with metadata', function () {
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsObject({ required: true }),
                        __metadata("design:type", Object)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.OBJECT,
                        required: true,
                    });
                });
                it('allows to set a class factory to the properties option', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsObject({ properties: classFactory }),
                        __metadata("design:type", Object)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.OBJECT,
                        properties: classFactory,
                    });
                });
                it('allows to set a class factory to property schema', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsObject({
                            properties: {
                                foo: classFactory,
                                bar: classFactory,
                            },
                        }),
                        __metadata("design:type", Object)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.OBJECT,
                        properties: {
                            foo: classFactory,
                            bar: classFactory,
                        },
                    });
                });
                it('allows to set a class factory to the properties option of property', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsObject({
                            properties: {
                                foo: {
                                    type: DataType.OBJECT,
                                    properties: classFactory,
                                },
                                bar: {
                                    type: DataType.OBJECT,
                                    properties: classFactory,
                                },
                            },
                        }),
                        __metadata("design:type", Object)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.OBJECT,
                        properties: {
                            foo: {
                                type: DataType.OBJECT,
                                properties: classFactory,
                            },
                            bar: {
                                type: DataType.OBJECT,
                                properties: classFactory,
                            },
                        },
                    });
                });
            });
            describe('if the first parameter is a class factory', function () {
                it('sets the given factory to the properties option', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsObject(classFactory),
                        __metadata("design:type", Object)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.OBJECT,
                        properties: classFactory,
                    });
                });
                it('uses the second parameter as object schema', function () {
                    class MyClass {
                    }
                    const classFactory = () => MyClass;
                    class MyTarget {
                        myProp;
                    }
                    __decorate([
                        dsObject(classFactory, { required: true }),
                        __metadata("design:type", Object)
                    ], MyTarget.prototype, "myProp", void 0);
                    const res = DataSchemaReflector.getPropertiesMetadata(MyTarget);
                    expect(res).to.be.instanceof(Map);
                    expect(res.get('myProp')).to.be.eql({
                        type: DataType.OBJECT,
                        properties: classFactory,
                        required: true,
                    });
                });
            });
        });
    });
});

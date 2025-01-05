var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { expect } from 'chai';
import { DataType } from '../data-schema.js';
import { dataSchema } from '../decorators/index.js';
import { getDataSchemaFromClass } from './get-data-schema-from-class.js';
describe('getDataSchemaFromClass', function () {
    it('throws an error if no schema defined', function () {
        class MyClass {
        }
        const throwable = () => getDataSchemaFromClass(MyClass);
        expect(throwable).to.throw('Class MyClass does not have data schema.');
    });
    it('does not throw an error if the option "doNotThrowIfNoMetadata" is true', function () {
        class MyClass {
        }
        const res = getDataSchemaFromClass(MyClass, true);
        expect(res).to.be.eql({ type: DataType.OBJECT });
    });
    it('returns data schema by class metadata', function () {
        const objectSchema = {
            type: DataType.OBJECT,
            required: true,
            properties: {
                foo: { type: DataType.STRING },
                bar: { type: DataType.NUMBER },
            },
        };
        let MyClass = class MyClass {
        };
        MyClass = __decorate([
            dataSchema(objectSchema)
        ], MyClass);
        const res = getDataSchemaFromClass(MyClass);
        expect(res).to.be.eql(objectSchema);
    });
    it('returns data schema by properties metadata', function () {
        class MyClass {
            foo;
            bar;
        }
        __decorate([
            dataSchema({
                type: DataType.STRING,
                required: true,
            }),
            __metadata("design:type", String)
        ], MyClass.prototype, "foo", void 0);
        __decorate([
            dataSchema({
                type: DataType.NUMBER,
                required: true,
            }),
            __metadata("design:type", Number)
        ], MyClass.prototype, "bar", void 0);
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
        let MyClass = class MyClass {
            baz;
            qux;
        };
        __decorate([
            dataSchema({
                type: DataType.STRING,
                required: true,
            }),
            __metadata("design:type", String)
        ], MyClass.prototype, "baz", void 0);
        __decorate([
            dataSchema({
                type: DataType.NUMBER,
                required: true,
            }),
            __metadata("design:type", Number)
        ], MyClass.prototype, "qux", void 0);
        MyClass = __decorate([
            dataSchema(objectSchema)
        ], MyClass);
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
        describe('for object property', function () {
            it('merges nested class metadata with properties metadata', function () {
                let MyClass1 = class MyClass1 {
                };
                MyClass1 = __decorate([
                    dataSchema({
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
                ], MyClass1);
                let MyClass2 = class MyClass2 {
                    baz;
                    qux;
                };
                __decorate([
                    dataSchema({
                        type: DataType.STRING,
                        required: true,
                    }),
                    __metadata("design:type", String)
                ], MyClass2.prototype, "baz", void 0);
                __decorate([
                    dataSchema({
                        type: DataType.NUMBER,
                        required: true,
                    }),
                    __metadata("design:type", Number)
                ], MyClass2.prototype, "qux", void 0);
                MyClass2 = __decorate([
                    dataSchema({
                        type: DataType.OBJECT,
                        properties: () => MyClass1,
                    })
                ], MyClass2);
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
            describe('if the target is a class', function () {
                it('resolves class factory in the properties option', function () {
                    let MyClass1 = class MyClass1 {
                    };
                    MyClass1 = __decorate([
                        dataSchema({
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
                    ], MyClass1);
                    let MyClass2 = class MyClass2 {
                    };
                    MyClass2 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            properties: () => MyClass1,
                        })
                    ], MyClass2);
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
                it('resolves class factory in property schema', function () {
                    let MyClass1 = class MyClass1 {
                    };
                    MyClass1 = __decorate([
                        dataSchema({
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
                        })
                    ], MyClass1);
                    let MyClass2 = class MyClass2 {
                    };
                    MyClass2 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            required: true,
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
                    ], MyClass2);
                    let MyClass3 = class MyClass3 {
                    };
                    MyClass3 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            properties: {
                                myProp1: () => MyClass1,
                                myProp2: () => MyClass2,
                            },
                        })
                    ], MyClass3);
                    const res = getDataSchemaFromClass(MyClass3);
                    expect(res).to.be.eql({
                        type: DataType.OBJECT,
                        properties: {
                            myProp1: {
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
                            },
                            myProp2: {
                                type: DataType.OBJECT,
                                required: true,
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
                            },
                        },
                    });
                });
                it('resolves class factory in the properties option of property', function () {
                    let MyClass1 = class MyClass1 {
                    };
                    MyClass1 = __decorate([
                        dataSchema({
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
                    ], MyClass1);
                    let MyClass2 = class MyClass2 {
                    };
                    MyClass2 = __decorate([
                        dataSchema({
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
                    ], MyClass2);
                    let MyClass3 = class MyClass3 {
                    };
                    MyClass3 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            properties: {
                                myProp1: {
                                    type: DataType.OBJECT,
                                    properties: () => MyClass1,
                                    required: true,
                                },
                                myProp2: {
                                    type: DataType.OBJECT,
                                    properties: () => MyClass2,
                                    required: true,
                                },
                            },
                        })
                    ], MyClass3);
                    const res = getDataSchemaFromClass(MyClass3);
                    expect(res).to.be.eql({
                        type: DataType.OBJECT,
                        properties: {
                            myProp1: {
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
                            },
                            myProp2: {
                                type: DataType.OBJECT,
                                required: true,
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
                            },
                        },
                    });
                });
            });
            describe('if the target is an instance property', function () {
                it('resolves class factory in the properties option', function () {
                    let MyClass1 = class MyClass1 {
                    };
                    MyClass1 = __decorate([
                        dataSchema({
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
                    ], MyClass1);
                    let MyClass2 = class MyClass2 {
                    };
                    MyClass2 = __decorate([
                        dataSchema({
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
                    ], MyClass2);
                    class MyClass3 {
                        myProp1;
                        myProp2;
                    }
                    __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            properties: () => MyClass1,
                            required: true,
                        }),
                        __metadata("design:type", Object)
                    ], MyClass3.prototype, "myProp1", void 0);
                    __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            properties: () => MyClass2,
                            required: true,
                        }),
                        __metadata("design:type", Object)
                    ], MyClass3.prototype, "myProp2", void 0);
                    const res = getDataSchemaFromClass(MyClass3);
                    expect(res).to.be.eql({
                        type: DataType.OBJECT,
                        properties: {
                            myProp1: {
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
                            },
                            myProp2: {
                                type: DataType.OBJECT,
                                required: true,
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
                            },
                        },
                    });
                });
                it('resolves class factory in property schema', function () {
                    let MyClass1 = class MyClass1 {
                    };
                    MyClass1 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            required: true,
                            properties: {
                                qwe: {
                                    type: DataType.STRING,
                                    required: true,
                                },
                                asd: {
                                    type: DataType.NUMBER,
                                    required: true,
                                },
                            },
                        })
                    ], MyClass1);
                    let MyClass2 = class MyClass2 {
                    };
                    MyClass2 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            required: true,
                            properties: {
                                zxc: {
                                    type: DataType.STRING,
                                    required: true,
                                },
                                rty: {
                                    type: DataType.NUMBER,
                                    required: true,
                                },
                            },
                        })
                    ], MyClass2);
                    let MyClass3 = class MyClass3 {
                    };
                    MyClass3 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            required: true,
                            properties: {
                                fgh: {
                                    type: DataType.STRING,
                                    required: true,
                                },
                                vbn: {
                                    type: DataType.NUMBER,
                                    required: true,
                                },
                            },
                        })
                    ], MyClass3);
                    let MyClass4 = class MyClass4 {
                    };
                    MyClass4 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            required: true,
                            properties: {
                                uio: {
                                    type: DataType.STRING,
                                    required: true,
                                },
                                jkl: {
                                    type: DataType.NUMBER,
                                    required: true,
                                },
                            },
                        })
                    ], MyClass4);
                    class MyClass5 {
                        myProp1;
                        myProp2;
                    }
                    __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            required: true,
                            properties: {
                                myProp3: () => MyClass1,
                                myProp4: () => MyClass2,
                            },
                        }),
                        __metadata("design:type", Object)
                    ], MyClass5.prototype, "myProp1", void 0);
                    __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            required: true,
                            properties: {
                                myProp5: () => MyClass3,
                                myProp6: () => MyClass4,
                            },
                        }),
                        __metadata("design:type", Object)
                    ], MyClass5.prototype, "myProp2", void 0);
                    const res = getDataSchemaFromClass(MyClass5);
                    expect(res).to.be.eql({
                        type: DataType.OBJECT,
                        properties: {
                            myProp1: {
                                type: DataType.OBJECT,
                                required: true,
                                properties: {
                                    myProp3: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            qwe: {
                                                type: DataType.STRING,
                                                required: true,
                                            },
                                            asd: {
                                                type: DataType.NUMBER,
                                                required: true,
                                            },
                                        },
                                    },
                                    myProp4: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            zxc: {
                                                type: DataType.STRING,
                                                required: true,
                                            },
                                            rty: {
                                                type: DataType.NUMBER,
                                                required: true,
                                            },
                                        },
                                    },
                                },
                            },
                            myProp2: {
                                type: DataType.OBJECT,
                                required: true,
                                properties: {
                                    myProp5: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            fgh: {
                                                type: DataType.STRING,
                                                required: true,
                                            },
                                            vbn: {
                                                type: DataType.NUMBER,
                                                required: true,
                                            },
                                        },
                                    },
                                    myProp6: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            uio: {
                                                type: DataType.STRING,
                                                required: true,
                                            },
                                            jkl: {
                                                type: DataType.NUMBER,
                                                required: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                });
                it('resolves class factory in the properties option in property', function () {
                    let MyClass1 = class MyClass1 {
                    };
                    MyClass1 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            properties: {
                                qwe: {
                                    type: DataType.STRING,
                                    required: true,
                                },
                                asd: {
                                    type: DataType.NUMBER,
                                    required: true,
                                },
                            },
                        })
                    ], MyClass1);
                    let MyClass2 = class MyClass2 {
                    };
                    MyClass2 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            properties: {
                                zxc: {
                                    type: DataType.STRING,
                                    required: true,
                                },
                                rty: {
                                    type: DataType.NUMBER,
                                    required: true,
                                },
                            },
                        })
                    ], MyClass2);
                    let MyClass3 = class MyClass3 {
                    };
                    MyClass3 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            properties: {
                                fgh: {
                                    type: DataType.STRING,
                                    required: true,
                                },
                                vbn: {
                                    type: DataType.NUMBER,
                                    required: true,
                                },
                            },
                        })
                    ], MyClass3);
                    let MyClass4 = class MyClass4 {
                    };
                    MyClass4 = __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            properties: {
                                uio: {
                                    type: DataType.STRING,
                                    required: true,
                                },
                                jkl: {
                                    type: DataType.NUMBER,
                                    required: true,
                                },
                            },
                        })
                    ], MyClass4);
                    class MyClass5 {
                        myProp1;
                        myProp2;
                    }
                    __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            required: true,
                            properties: {
                                myProp3: {
                                    type: DataType.OBJECT,
                                    properties: () => MyClass1,
                                    required: true,
                                },
                                myProp4: {
                                    type: DataType.OBJECT,
                                    properties: () => MyClass2,
                                    required: true,
                                },
                            },
                        }),
                        __metadata("design:type", Object)
                    ], MyClass5.prototype, "myProp1", void 0);
                    __decorate([
                        dataSchema({
                            type: DataType.OBJECT,
                            required: true,
                            properties: {
                                myProp5: {
                                    type: DataType.OBJECT,
                                    properties: () => MyClass3,
                                    required: true,
                                },
                                myProp6: {
                                    type: DataType.OBJECT,
                                    properties: () => MyClass4,
                                    required: true,
                                },
                            },
                        }),
                        __metadata("design:type", Object)
                    ], MyClass5.prototype, "myProp2", void 0);
                    const res = getDataSchemaFromClass(MyClass5);
                    expect(res).to.be.eql({
                        type: DataType.OBJECT,
                        properties: {
                            myProp1: {
                                type: DataType.OBJECT,
                                required: true,
                                properties: {
                                    myProp3: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            qwe: {
                                                type: DataType.STRING,
                                                required: true,
                                            },
                                            asd: {
                                                type: DataType.NUMBER,
                                                required: true,
                                            },
                                        },
                                    },
                                    myProp4: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            zxc: {
                                                type: DataType.STRING,
                                                required: true,
                                            },
                                            rty: {
                                                type: DataType.NUMBER,
                                                required: true,
                                            },
                                        },
                                    },
                                },
                            },
                            myProp2: {
                                type: DataType.OBJECT,
                                required: true,
                                properties: {
                                    myProp5: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            fgh: {
                                                type: DataType.STRING,
                                                required: true,
                                            },
                                            vbn: {
                                                type: DataType.NUMBER,
                                                required: true,
                                            },
                                        },
                                    },
                                    myProp6: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            uio: {
                                                type: DataType.STRING,
                                                required: true,
                                            },
                                            jkl: {
                                                type: DataType.NUMBER,
                                                required: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                });
            });
        });
        describe('for array property', function () {
            describe('if the target is a class', function () {
                describe('for object items', function () {
                    it('resolves class factory in the properties option of items', function () {
                        let MyClass1 = class MyClass1 {
                        };
                        MyClass1 = __decorate([
                            dataSchema({
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
                        ], MyClass1);
                        let MyClass2 = class MyClass2 {
                        };
                        MyClass2 = __decorate([
                            dataSchema({
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
                        ], MyClass2);
                        let MyClass3 = class MyClass3 {
                        };
                        MyClass3 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    myProp1: {
                                        type: DataType.ARRAY,
                                        required: true,
                                        items: {
                                            type: DataType.OBJECT,
                                            properties: () => MyClass1,
                                            required: true,
                                        },
                                    },
                                    myProp2: {
                                        type: DataType.ARRAY,
                                        required: true,
                                        items: {
                                            type: DataType.OBJECT,
                                            properties: () => MyClass2,
                                            required: true,
                                        },
                                    },
                                },
                            })
                        ], MyClass3);
                        const res = getDataSchemaFromClass(MyClass3);
                        expect(res).to.be.eql({
                            type: DataType.OBJECT,
                            properties: {
                                myProp1: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
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
                                    },
                                },
                                myProp2: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.OBJECT,
                                        required: true,
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
                                    },
                                },
                            },
                        });
                    });
                    it('resolves class factory in items schema', function () {
                        let MyClass1 = class MyClass1 {
                        };
                        MyClass1 = __decorate([
                            dataSchema({
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
                            })
                        ], MyClass1);
                        let MyClass2 = class MyClass2 {
                        };
                        MyClass2 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                required: true,
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
                        ], MyClass2);
                        let MyClass3 = class MyClass3 {
                        };
                        MyClass3 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    myProp1: {
                                        type: DataType.ARRAY,
                                        items: () => MyClass1,
                                        required: true,
                                    },
                                    myProp2: {
                                        type: DataType.ARRAY,
                                        items: () => MyClass2,
                                        required: true,
                                    },
                                },
                            })
                        ], MyClass3);
                        const res = getDataSchemaFromClass(MyClass3);
                        expect(res).to.be.eql({
                            type: DataType.OBJECT,
                            properties: {
                                myProp1: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
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
                                    },
                                },
                                myProp2: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.OBJECT,
                                        required: true,
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
                                    },
                                },
                            },
                        });
                    });
                    it('resolves class factory in the properties option of property', function () {
                        let MyClass1 = class MyClass1 {
                        };
                        MyClass1 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    qwe: {
                                        type: DataType.STRING,
                                        required: true,
                                    },
                                    asd: {
                                        type: DataType.NUMBER,
                                        required: true,
                                    },
                                },
                            })
                        ], MyClass1);
                        let MyClass2 = class MyClass2 {
                        };
                        MyClass2 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    zxc: {
                                        type: DataType.STRING,
                                        required: true,
                                    },
                                    rty: {
                                        type: DataType.NUMBER,
                                        required: true,
                                    },
                                },
                            })
                        ], MyClass2);
                        let MyClass3 = class MyClass3 {
                        };
                        MyClass3 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    fgh: {
                                        type: DataType.STRING,
                                        required: true,
                                    },
                                    vbn: {
                                        type: DataType.NUMBER,
                                        required: true,
                                    },
                                },
                            })
                        ], MyClass3);
                        let MyClass4 = class MyClass4 {
                        };
                        MyClass4 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    uio: {
                                        type: DataType.STRING,
                                        required: true,
                                    },
                                    jkl: {
                                        type: DataType.NUMBER,
                                        required: true,
                                    },
                                },
                            })
                        ], MyClass4);
                        let MyClass5 = class MyClass5 {
                        };
                        MyClass5 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    myProp1: {
                                        type: DataType.ARRAY,
                                        required: true,
                                        items: {
                                            type: DataType.OBJECT,
                                            required: true,
                                            properties: {
                                                myProp3: {
                                                    type: DataType.OBJECT,
                                                    required: true,
                                                    properties: () => MyClass1,
                                                },
                                                myProp4: {
                                                    type: DataType.OBJECT,
                                                    required: true,
                                                    properties: () => MyClass2,
                                                },
                                            },
                                        },
                                    },
                                    myProp2: {
                                        type: DataType.ARRAY,
                                        required: true,
                                        items: {
                                            type: DataType.OBJECT,
                                            required: true,
                                            properties: {
                                                myProp5: {
                                                    type: DataType.OBJECT,
                                                    required: true,
                                                    properties: () => MyClass3,
                                                },
                                                myProp6: {
                                                    type: DataType.OBJECT,
                                                    required: true,
                                                    properties: () => MyClass4,
                                                },
                                            },
                                        },
                                    },
                                },
                            })
                        ], MyClass5);
                        const res = getDataSchemaFromClass(MyClass5);
                        expect(res).to.be.eql({
                            type: DataType.OBJECT,
                            properties: {
                                myProp1: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            myProp3: {
                                                type: DataType.OBJECT,
                                                required: true,
                                                properties: {
                                                    qwe: {
                                                        type: DataType.STRING,
                                                        required: true,
                                                    },
                                                    asd: {
                                                        type: DataType.NUMBER,
                                                        required: true,
                                                    },
                                                },
                                            },
                                            myProp4: {
                                                type: DataType.OBJECT,
                                                required: true,
                                                properties: {
                                                    zxc: {
                                                        type: DataType.STRING,
                                                        required: true,
                                                    },
                                                    rty: {
                                                        type: DataType.NUMBER,
                                                        required: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                myProp2: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            myProp5: {
                                                type: DataType.OBJECT,
                                                required: true,
                                                properties: {
                                                    fgh: {
                                                        type: DataType.STRING,
                                                        required: true,
                                                    },
                                                    vbn: {
                                                        type: DataType.NUMBER,
                                                        required: true,
                                                    },
                                                },
                                            },
                                            myProp6: {
                                                type: DataType.OBJECT,
                                                required: true,
                                                properties: {
                                                    uio: {
                                                        type: DataType.STRING,
                                                        required: true,
                                                    },
                                                    jkl: {
                                                        type: DataType.NUMBER,
                                                        required: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        });
                    });
                });
                describe('for array items', function () {
                    it('resolves class factory in the items option of items', function () {
                        let MyClass1 = class MyClass1 {
                        };
                        MyClass1 = __decorate([
                            dataSchema({
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
                        ], MyClass1);
                        let MyClass2 = class MyClass2 {
                        };
                        MyClass2 = __decorate([
                            dataSchema({
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
                        ], MyClass2);
                        let MyClass3 = class MyClass3 {
                        };
                        MyClass3 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    myProp1: {
                                        type: DataType.ARRAY,
                                        required: true,
                                        items: {
                                            type: DataType.ARRAY,
                                            items: () => MyClass1,
                                            required: true,
                                        },
                                    },
                                    myProp2: {
                                        type: DataType.ARRAY,
                                        required: true,
                                        items: {
                                            type: DataType.ARRAY,
                                            items: () => MyClass2,
                                            required: true,
                                        },
                                    },
                                },
                            })
                        ], MyClass3);
                        const res = getDataSchemaFromClass(MyClass3);
                        expect(res).to.be.eql({
                            type: DataType.OBJECT,
                            properties: {
                                myProp1: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.ARRAY,
                                        required: true,
                                        items: {
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
                                        },
                                    },
                                },
                                myProp2: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.ARRAY,
                                        required: true,
                                        items: {
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
                                        },
                                    },
                                },
                            },
                        });
                    });
                });
            });
            describe('if the target is an instance property', function () {
                describe('for object items', function () {
                    it('resolves class factory in the properties option of items', function () {
                        let MyClass1 = class MyClass1 {
                        };
                        MyClass1 = __decorate([
                            dataSchema({
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
                        ], MyClass1);
                        let MyClass2 = class MyClass2 {
                        };
                        MyClass2 = __decorate([
                            dataSchema({
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
                        ], MyClass2);
                        class MyClass3 {
                            myProp1;
                            myProp2;
                        }
                        __decorate([
                            dataSchema({
                                type: DataType.ARRAY,
                                required: true,
                                items: {
                                    type: DataType.OBJECT,
                                    properties: () => MyClass1,
                                    required: true,
                                },
                            }),
                            __metadata("design:type", Array)
                        ], MyClass3.prototype, "myProp1", void 0);
                        __decorate([
                            dataSchema({
                                type: DataType.ARRAY,
                                required: true,
                                items: {
                                    type: DataType.OBJECT,
                                    properties: () => MyClass2,
                                    required: true,
                                },
                            }),
                            __metadata("design:type", Array)
                        ], MyClass3.prototype, "myProp2", void 0);
                        const res = getDataSchemaFromClass(MyClass3);
                        expect(res).to.be.eql({
                            type: DataType.OBJECT,
                            properties: {
                                myProp1: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
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
                                    },
                                },
                                myProp2: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.OBJECT,
                                        required: true,
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
                                    },
                                },
                            },
                        });
                    });
                    it('resolves class factory in items schema', function () {
                        let MyClass1 = class MyClass1 {
                        };
                        MyClass1 = __decorate([
                            dataSchema({
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
                            })
                        ], MyClass1);
                        let MyClass2 = class MyClass2 {
                        };
                        MyClass2 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                required: true,
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
                        ], MyClass2);
                        class MyClass3 {
                            myProp1;
                            myProp2;
                        }
                        __decorate([
                            dataSchema({
                                type: DataType.ARRAY,
                                items: () => MyClass1,
                                required: true,
                            }),
                            __metadata("design:type", Array)
                        ], MyClass3.prototype, "myProp1", void 0);
                        __decorate([
                            dataSchema({
                                type: DataType.ARRAY,
                                items: () => MyClass2,
                                required: true,
                            }),
                            __metadata("design:type", Array)
                        ], MyClass3.prototype, "myProp2", void 0);
                        const res = getDataSchemaFromClass(MyClass3);
                        expect(res).to.be.eql({
                            type: DataType.OBJECT,
                            properties: {
                                myProp1: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
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
                                    },
                                },
                                myProp2: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.OBJECT,
                                        required: true,
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
                                    },
                                },
                            },
                        });
                    });
                    it('resolves class factory in the properties option of property', function () {
                        let MyClass1 = class MyClass1 {
                        };
                        MyClass1 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    qwe: {
                                        type: DataType.STRING,
                                        required: true,
                                    },
                                    asd: {
                                        type: DataType.NUMBER,
                                        required: true,
                                    },
                                },
                            })
                        ], MyClass1);
                        let MyClass2 = class MyClass2 {
                        };
                        MyClass2 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    zxc: {
                                        type: DataType.STRING,
                                        required: true,
                                    },
                                    rty: {
                                        type: DataType.NUMBER,
                                        required: true,
                                    },
                                },
                            })
                        ], MyClass2);
                        let MyClass3 = class MyClass3 {
                        };
                        MyClass3 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    fgh: {
                                        type: DataType.STRING,
                                        required: true,
                                    },
                                    vbn: {
                                        type: DataType.NUMBER,
                                        required: true,
                                    },
                                },
                            })
                        ], MyClass3);
                        let MyClass4 = class MyClass4 {
                        };
                        MyClass4 = __decorate([
                            dataSchema({
                                type: DataType.OBJECT,
                                properties: {
                                    uio: {
                                        type: DataType.STRING,
                                        required: true,
                                    },
                                    jkl: {
                                        type: DataType.NUMBER,
                                        required: true,
                                    },
                                },
                            })
                        ], MyClass4);
                        class MyClass5 {
                            myProp1;
                            myProp2;
                        }
                        __decorate([
                            dataSchema({
                                type: DataType.ARRAY,
                                required: true,
                                items: {
                                    type: DataType.OBJECT,
                                    required: true,
                                    properties: {
                                        myProp3: {
                                            type: DataType.OBJECT,
                                            required: true,
                                            properties: () => MyClass1,
                                        },
                                        myProp4: {
                                            type: DataType.OBJECT,
                                            required: true,
                                            properties: () => MyClass2,
                                        },
                                    },
                                },
                            }),
                            __metadata("design:type", Array)
                        ], MyClass5.prototype, "myProp1", void 0);
                        __decorate([
                            dataSchema({
                                type: DataType.ARRAY,
                                required: true,
                                items: {
                                    type: DataType.OBJECT,
                                    required: true,
                                    properties: {
                                        myProp5: {
                                            type: DataType.OBJECT,
                                            required: true,
                                            properties: () => MyClass3,
                                        },
                                        myProp6: {
                                            type: DataType.OBJECT,
                                            required: true,
                                            properties: () => MyClass4,
                                        },
                                    },
                                },
                            }),
                            __metadata("design:type", Array)
                        ], MyClass5.prototype, "myProp2", void 0);
                        const res = getDataSchemaFromClass(MyClass5);
                        expect(res).to.be.eql({
                            type: DataType.OBJECT,
                            properties: {
                                myProp1: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            myProp3: {
                                                type: DataType.OBJECT,
                                                required: true,
                                                properties: {
                                                    qwe: {
                                                        type: DataType.STRING,
                                                        required: true,
                                                    },
                                                    asd: {
                                                        type: DataType.NUMBER,
                                                        required: true,
                                                    },
                                                },
                                            },
                                            myProp4: {
                                                type: DataType.OBJECT,
                                                required: true,
                                                properties: {
                                                    zxc: {
                                                        type: DataType.STRING,
                                                        required: true,
                                                    },
                                                    rty: {
                                                        type: DataType.NUMBER,
                                                        required: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                myProp2: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.OBJECT,
                                        required: true,
                                        properties: {
                                            myProp5: {
                                                type: DataType.OBJECT,
                                                required: true,
                                                properties: {
                                                    fgh: {
                                                        type: DataType.STRING,
                                                        required: true,
                                                    },
                                                    vbn: {
                                                        type: DataType.NUMBER,
                                                        required: true,
                                                    },
                                                },
                                            },
                                            myProp6: {
                                                type: DataType.OBJECT,
                                                required: true,
                                                properties: {
                                                    uio: {
                                                        type: DataType.STRING,
                                                        required: true,
                                                    },
                                                    jkl: {
                                                        type: DataType.NUMBER,
                                                        required: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        });
                    });
                });
                describe('for array items', function () {
                    it('resolves class factory in the items option of items', function () {
                        let MyClass1 = class MyClass1 {
                        };
                        MyClass1 = __decorate([
                            dataSchema({
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
                        ], MyClass1);
                        let MyClass2 = class MyClass2 {
                        };
                        MyClass2 = __decorate([
                            dataSchema({
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
                        ], MyClass2);
                        class MyClass3 {
                            myProp1;
                            myProp2;
                        }
                        __decorate([
                            dataSchema({
                                type: DataType.ARRAY,
                                required: true,
                                items: {
                                    type: DataType.ARRAY,
                                    items: () => MyClass1,
                                    required: true,
                                },
                            }),
                            __metadata("design:type", Array)
                        ], MyClass3.prototype, "myProp1", void 0);
                        __decorate([
                            dataSchema({
                                type: DataType.ARRAY,
                                required: true,
                                items: {
                                    type: DataType.ARRAY,
                                    items: () => MyClass2,
                                    required: true,
                                },
                            }),
                            __metadata("design:type", Array)
                        ], MyClass3.prototype, "myProp2", void 0);
                        const res = getDataSchemaFromClass(MyClass3);
                        expect(res).to.be.eql({
                            type: DataType.OBJECT,
                            properties: {
                                myProp1: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.ARRAY,
                                        required: true,
                                        items: {
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
                                        },
                                    },
                                },
                                myProp2: {
                                    type: DataType.ARRAY,
                                    required: true,
                                    items: {
                                        type: DataType.ARRAY,
                                        required: true,
                                        items: {
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
                                        },
                                    },
                                },
                            },
                        });
                    });
                });
            });
        });
    });
});

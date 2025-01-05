import {expect} from 'chai';
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
    describe('for object property', function () {
      it('merges nested class metadata with properties metadata', function () {
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

      describe('if the target is a class', function () {
        it('resolves class factory in the properties option', function () {
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

        it('resolves class factory in property schema', function () {
          @dataSchema({
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
          class MyClass1 {}
          @dataSchema({
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
          class MyClass2 {}
          @dataSchema({
            type: DataType.OBJECT,
            properties: {
              myProp1: () => MyClass1,
              myProp2: () => MyClass2,
            },
          })
          class MyClass3 {}
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
          @dataSchema({
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
          class MyClass3 {}
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
            myProp1?: object;

            @dataSchema({
              type: DataType.OBJECT,
              properties: () => MyClass2,
              required: true,
            })
            myProp2?: object;
          }
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
          @dataSchema({
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
          class MyClass1 {}
          @dataSchema({
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
          class MyClass2 {}
          @dataSchema({
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
          class MyClass3 {}
          @dataSchema({
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
          class MyClass4 {}
          class MyClass5 {
            @dataSchema({
              type: DataType.OBJECT,
              required: true,
              properties: {
                myProp3: () => MyClass1,
                myProp4: () => MyClass2,
              },
            })
            myProp1?: object;

            @dataSchema({
              type: DataType.OBJECT,
              required: true,
              properties: {
                myProp5: () => MyClass3,
                myProp6: () => MyClass4,
              },
            })
            myProp2?: object;
          }
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
          @dataSchema({
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
          class MyClass1 {}
          @dataSchema({
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
          class MyClass2 {}
          @dataSchema({
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
          class MyClass3 {}
          @dataSchema({
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
          class MyClass4 {}
          class MyClass5 {
            @dataSchema({
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
            })
            myProp1?: object;

            @dataSchema({
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
            })
            myProp2?: object;
          }
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
            @dataSchema({
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
            class MyClass3 {}
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
            @dataSchema({
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
            class MyClass1 {}
            @dataSchema({
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
            class MyClass2 {}
            @dataSchema({
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
            class MyClass3 {}
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
            @dataSchema({
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
            class MyClass1 {}
            @dataSchema({
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
            class MyClass2 {}
            @dataSchema({
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
            class MyClass3 {}
            @dataSchema({
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
            class MyClass4 {}
            @dataSchema({
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
            class MyClass5 {}
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
            @dataSchema({
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
            class MyClass3 {}
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
                type: DataType.ARRAY,
                required: true,
                items: {
                  type: DataType.OBJECT,
                  properties: () => MyClass1,
                  required: true,
                },
              })
              myProp1?: object[];

              @dataSchema({
                type: DataType.ARRAY,
                required: true,
                items: {
                  type: DataType.OBJECT,
                  properties: () => MyClass2,
                  required: true,
                },
              })
              myProp2?: object[];
            }
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
            @dataSchema({
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
            class MyClass1 {}
            @dataSchema({
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
            class MyClass2 {}
            class MyClass3 {
              @dataSchema({
                type: DataType.ARRAY,
                items: () => MyClass1,
                required: true,
              })
              myProp1?: object[];

              @dataSchema({
                type: DataType.ARRAY,
                items: () => MyClass2,
                required: true,
              })
              myProp2?: object[];
            }
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
            @dataSchema({
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
            class MyClass1 {}
            @dataSchema({
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
            class MyClass2 {}
            @dataSchema({
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
            class MyClass3 {}
            @dataSchema({
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
            class MyClass4 {}
            class MyClass5 {
              @dataSchema({
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
              })
              myProp1?: object[][];

              @dataSchema({
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
              })
              myProp2?: object[][];
            }
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
                type: DataType.ARRAY,
                required: true,
                items: {
                  type: DataType.ARRAY,
                  items: () => MyClass1,
                  required: true,
                },
              })
              myProp1?: object[][];

              @dataSchema({
                type: DataType.ARRAY,
                required: true,
                items: {
                  type: DataType.ARRAY,
                  items: () => MyClass2,
                  required: true,
                },
              })
              myProp2?: object[][];
            }
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

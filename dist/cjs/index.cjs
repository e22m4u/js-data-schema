"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/esm/index.js
var index_exports = {};
__export(index_exports, {
  DATA_SCHEMA_CLASS_METADATA_KEY: () => DATA_SCHEMA_CLASS_METADATA_KEY,
  DATA_SCHEMA_PROPERTIES_METADATA_KEY: () => DATA_SCHEMA_PROPERTIES_METADATA_KEY,
  DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE: () => DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE,
  DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE: () => DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE,
  DataSchemaReflector: () => DataSchemaReflector,
  DataType: () => DataType,
  DataTypeCaster: () => DataTypeCaster,
  DataValidator: () => DataValidator,
  DecoratorTargetError: () => DecoratorTargetError,
  REDUNDANT_TYPE_OPTION_ERROR_MESSAGE: () => REDUNDANT_TYPE_OPTION_ERROR_MESSAGE,
  TypeCastError: () => TypeCastError,
  ValidationError: () => ValidationError,
  arrayTypeValidator: () => arrayTypeValidator,
  booleanTypeValidator: () => booleanTypeValidator,
  dataSchema: () => dataSchema,
  dataTypeFrom: () => dataTypeFrom,
  dsAny: () => dsAny,
  dsArray: () => dsArray,
  dsBoolean: () => dsBoolean,
  dsNumber: () => dsNumber,
  dsObject: () => dsObject,
  dsProperty: () => dsProperty,
  dsString: () => dsString,
  isRequiredValidator: () => isRequiredValidator,
  numberTypeValidator: () => numberTypeValidator,
  objectTypeValidator: () => objectTypeValidator,
  stringTypeValidator: () => stringTypeValidator,
  typeCastToArray: () => typeCastToArray,
  typeCastToBoolean: () => typeCastToBoolean,
  typeCastToNumber: () => typeCastToNumber,
  typeCastToPlainObject: () => typeCastToPlainObject,
  typeCastToString: () => typeCastToString
});
module.exports = __toCommonJS(index_exports);

// dist/esm/data-schema.js
var DataType;
(function(DataType2) {
  DataType2["ANY"] = "any";
  DataType2["STRING"] = "string";
  DataType2["NUMBER"] = "number";
  DataType2["BOOLEAN"] = "boolean";
  DataType2["ARRAY"] = "array";
  DataType2["OBJECT"] = "object";
})(DataType || (DataType = {}));
function dataTypeFrom(value) {
  if (value == null)
    return DataType.ANY;
  const baseType = typeof value;
  if (baseType === "string")
    return DataType.STRING;
  if (baseType === "number")
    return DataType.NUMBER;
  if (baseType === "boolean")
    return DataType.BOOLEAN;
  if (Array.isArray(value))
    return DataType.ARRAY;
  if (baseType === "object")
    return DataType.OBJECT;
  return DataType.ANY;
}
__name(dataTypeFrom, "dataTypeFrom");

// dist/esm/errors/type-cast-error.js
var import_js_format3 = require("@e22m4u/js-format");

// dist/esm/utils/to-camel-case.js
function toCamelCase(input) {
  return input.replace(/(^\w|[A-Z]|\b\w)/g, (c) => c.toUpperCase()).replace(/\W+/g, "").replace(/(^\w)/g, (c) => c.toLowerCase());
}
__name(toCamelCase, "toCamelCase");

// dist/esm/utils/to-pascal-case.js
function toPascalCase(input) {
  if (!input)
    return "";
  return input.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([0-9])([a-zA-Z])/g, "$1 $2").replace(/[-_]+|[^\p{L}\p{N}]/gu, " ").toLowerCase().replace(new RegExp("(?:^|\\s)(\\p{L})", "gu"), (_, letter) => letter.toUpperCase()).replace(/\s+/g, "");
}
__name(toPascalCase, "toPascalCase");

// dist/esm/utils/is-plain-object.js
function isPlainObject(input) {
  return !(input === null || typeof input !== "object" || Array.isArray(input) || input.constructor && input.constructor !== Object);
}
__name(isPlainObject, "isPlainObject");

// dist/esm/utils/get-data-schema-from-class.js
var import_js_format2 = require("@e22m4u/js-format");

// dist/esm/decorators/data-schema-metadata.js
var import_ts_reflector = require("@e22m4u/ts-reflector");
var DATA_SCHEMA_CLASS_METADATA_KEY = new import_ts_reflector.MetadataKey("dataSchemaClassMetadataKey");
var DATA_SCHEMA_PROPERTIES_METADATA_KEY = new import_ts_reflector.MetadataKey("dataSchemaPropertiesMetadataKey");

// dist/esm/decorators/data-schema-reflector.js
var import_ts_reflector2 = require("@e22m4u/ts-reflector");
var _DataSchemaReflector = class _DataSchemaReflector {
  /**
   * Set metadata.
   *
   * @param metadata
   * @param target
   * @param propertyKey
   */
  static setMetadata(metadata, target, propertyKey) {
    if (propertyKey == null) {
      import_ts_reflector2.Reflector.defineMetadata(DATA_SCHEMA_CLASS_METADATA_KEY, metadata, target);
    } else {
      const oldMap = import_ts_reflector2.Reflector.getOwnMetadata(DATA_SCHEMA_PROPERTIES_METADATA_KEY, target);
      const newMap = new Map(oldMap);
      newMap.set(propertyKey, metadata);
      import_ts_reflector2.Reflector.defineMetadata(DATA_SCHEMA_PROPERTIES_METADATA_KEY, newMap, target);
    }
  }
  /**
   * Get class metadata.
   *
   * @param target
   */
  static getClassMetadata(target) {
    return import_ts_reflector2.Reflector.getOwnMetadata(DATA_SCHEMA_CLASS_METADATA_KEY, target);
  }
  /**
   * Get properties metadata.
   *
   * @param target
   */
  static getPropertiesMetadata(target) {
    const metadata = import_ts_reflector2.Reflector.getOwnMetadata(DATA_SCHEMA_PROPERTIES_METADATA_KEY, target);
    return metadata != null ? metadata : /* @__PURE__ */ new Map();
  }
};
__name(_DataSchemaReflector, "DataSchemaReflector");
var DataSchemaReflector = _DataSchemaReflector;

// dist/esm/decorators/data-schema-decorators.js
var import_js_format = require("@e22m4u/js-format");
var import_ts_reflector3 = require("@e22m4u/ts-reflector");
var import_ts_reflector4 = require("@e22m4u/ts-reflector");
var DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE = "@%s decorator is only supported on an instance property.";
var DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE = "@%s decorator is only supported on a class or an instance property.";
var REDUNDANT_TYPE_OPTION_ERROR_MESSAGE = 'The option "type" is not supported in the @%s decorator.';
function dataSchema(schema) {
  return function(target, propertyKey, descriptor) {
    const decoratorType = (0, import_ts_reflector4.getDecoratorTargetType)(target, propertyKey, descriptor);
    if (decoratorType !== import_ts_reflector3.DecoratorTargetType.CONSTRUCTOR && decoratorType !== import_ts_reflector3.DecoratorTargetType.INSTANCE_PROPERTY) {
      throw new DecoratorTargetError(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, "dataSchema");
    }
    const targetCtor = typeof target === "object" ? target.constructor : target;
    DataSchemaReflector.setMetadata(schema, targetCtor, propertyKey);
  };
}
__name(dataSchema, "dataSchema");
function dsProperty(schema) {
  return function(target, propertyKey, descriptor) {
    const decoratorType = (0, import_ts_reflector4.getDecoratorTargetType)(target, propertyKey, descriptor);
    if (decoratorType !== import_ts_reflector3.DecoratorTargetType.INSTANCE_PROPERTY)
      throw new DecoratorTargetError(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, "dsProperty");
    DataSchemaReflector.setMetadata(schema, target.constructor, propertyKey);
  };
}
__name(dsProperty, "dsProperty");
function checkDataSchemaDoesNotHaveSpecifiedTypeOption(decoratorName, schema) {
  if (schema && typeof schema === "object" && !Array.isArray(schema) && schema.type) {
    throw new import_js_format.Errorf(REDUNDANT_TYPE_OPTION_ERROR_MESSAGE, decoratorName);
  }
}
__name(checkDataSchemaDoesNotHaveSpecifiedTypeOption, "checkDataSchemaDoesNotHaveSpecifiedTypeOption");
function wrapDataSchemaDecoratorToReplaceErrorMessage(decoratorName, schema) {
  const dec = dataSchema(schema);
  return function(target, propertyKey, descriptor) {
    try {
      return dec(target, propertyKey, descriptor);
    } catch (error) {
      if (error instanceof DecoratorTargetError)
        throw new DecoratorTargetError(DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE, decoratorName);
      throw error;
    }
  };
}
__name(wrapDataSchemaDecoratorToReplaceErrorMessage, "wrapDataSchemaDecoratorToReplaceErrorMessage");
function wrapDataSchemaPropertyDecoratorToReplaceErrorMessage(decoratorName, schema) {
  const dec = dsProperty(schema);
  return function(target, propertyKey, descriptor) {
    try {
      return dec(target, propertyKey, descriptor);
    } catch (error) {
      if (error instanceof DecoratorTargetError)
        throw new DecoratorTargetError(DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE, decoratorName);
      throw error;
    }
  };
}
__name(wrapDataSchemaPropertyDecoratorToReplaceErrorMessage, "wrapDataSchemaPropertyDecoratorToReplaceErrorMessage");
function createDataSchemaPropertyDecoratorWithDataType(decoratorName, dataType) {
  return function(schema) {
    checkDataSchemaDoesNotHaveSpecifiedTypeOption(decoratorName, schema);
    return wrapDataSchemaPropertyDecoratorToReplaceErrorMessage(decoratorName, {
      ...schema,
      type: dataType
    });
  };
}
__name(createDataSchemaPropertyDecoratorWithDataType, "createDataSchemaPropertyDecoratorWithDataType");
var dsAny = createDataSchemaPropertyDecoratorWithDataType("dsAny", DataType.ANY);
var dsString = createDataSchemaPropertyDecoratorWithDataType("dsString", DataType.STRING);
var dsNumber = createDataSchemaPropertyDecoratorWithDataType("dsNumber", DataType.NUMBER);
var dsBoolean = createDataSchemaPropertyDecoratorWithDataType("dsBoolean", DataType.BOOLEAN);
var dsArray = /* @__PURE__ */ __name((schemaOrItemSchema, schema) => {
  let arraySchemaWithoutType;
  if (typeof schemaOrItemSchema === "function") {
    arraySchemaWithoutType = {
      ...schema,
      items: schemaOrItemSchema
    };
  } else if (typeof schemaOrItemSchema === "string") {
    arraySchemaWithoutType = {
      ...schema,
      items: { type: schemaOrItemSchema }
    };
  } else if (schemaOrItemSchema && typeof schemaOrItemSchema === "object" && !Array.isArray(schemaOrItemSchema) && "type" in schemaOrItemSchema && schemaOrItemSchema.type) {
    arraySchemaWithoutType = {
      ...schema,
      items: schemaOrItemSchema
    };
  } else {
    arraySchemaWithoutType = schemaOrItemSchema || schema;
  }
  checkDataSchemaDoesNotHaveSpecifiedTypeOption("dsArray", arraySchemaWithoutType);
  return wrapDataSchemaPropertyDecoratorToReplaceErrorMessage("dsArray", {
    ...arraySchemaWithoutType,
    type: DataType.ARRAY
  });
}, "dsArray");
function dsObject(schemaOrClassFactory, schema) {
  if (typeof schemaOrClassFactory === "function") {
    schema = schema || {};
    schema.properties = schemaOrClassFactory;
  } else if (schemaOrClassFactory && typeof schemaOrClassFactory === "object" && !Array.isArray(schemaOrClassFactory)) {
    schema = schemaOrClassFactory;
  }
  checkDataSchemaDoesNotHaveSpecifiedTypeOption("dsObject", schema);
  return wrapDataSchemaDecoratorToReplaceErrorMessage("dsObject", {
    ...schema,
    type: DataType.OBJECT
  });
}
__name(dsObject, "dsObject");

// dist/esm/errors/type-cast-error.js
var _TypeCastError = class _TypeCastError extends Error {
  value;
  targetType;
  constructor(value, targetType) {
    const sourceType = dataTypeFrom(value);
    const message = (0, import_js_format3.format)("Unable to cast %s to %s.", sourceType ? toPascalCase(sourceType) : sourceType, toPascalCase(targetType));
    super(message);
    this.value = value;
    this.targetType = targetType;
  }
};
__name(_TypeCastError, "TypeCastError");
var TypeCastError = _TypeCastError;

// dist/esm/errors/validation-error.js
var import_js_format4 = require("@e22m4u/js-format");
var _ValidationError = class _ValidationError extends import_js_format4.Errorf {
};
__name(_ValidationError, "ValidationError");
var ValidationError = _ValidationError;

// dist/esm/errors/decorator-target-error.js
var import_js_format5 = require("@e22m4u/js-format");
var _DecoratorTargetError = class _DecoratorTargetError extends import_js_format5.Errorf {
};
__name(_DecoratorTargetError, "DecoratorTargetError");
var DecoratorTargetError = _DecoratorTargetError;

// dist/esm/data-validator.js
var import_js_format6 = require("@e22m4u/js-format");
var import_js_debug2 = require("@e22m4u/js-debug");

// dist/esm/validators/array-type-validator.js
function arrayTypeValidator(value, schema, sourcePath) {
  if (schema.type === DataType.ARRAY && !Array.isArray(value)) {
    if (sourcePath) {
      throw new ValidationError("Value of %v must be an Array, but %v given.", sourcePath, value);
    } else {
      throw new ValidationError("Value must be an Array, but %v given.", value);
    }
  }
}
__name(arrayTypeValidator, "arrayTypeValidator");

// dist/esm/validators/is-required-validator.js
var import_js_empty_values = require("@e22m4u/js-empty-values");
function isRequiredValidator(value, schema, sourcePath, services) {
  if (!schema.required)
    return;
  const emptyValuesService = services.get(import_js_empty_values.EmptyValuesService);
  const isEmpty = emptyValuesService.isEmptyByType(schema.type, value);
  if (!isEmpty)
    return;
  if (sourcePath) {
    throw new ValidationError("Value of %v is required, but %v given.", sourcePath, value);
  } else {
    throw new ValidationError("Value is required, but %v given.", value);
  }
}
__name(isRequiredValidator, "isRequiredValidator");

// dist/esm/validators/number-type-validator.js
function numberTypeValidator(value, schema, sourcePath) {
  if (schema.type === DataType.NUMBER && (typeof value !== "number" || isNaN(value))) {
    if (sourcePath) {
      throw new ValidationError("Value of %v must be a Number, but %v given.", sourcePath, value);
    } else {
      throw new ValidationError("Value must be a Number, but %v given.", value);
    }
  }
}
__name(numberTypeValidator, "numberTypeValidator");

// dist/esm/validators/object-type-validator.js
function objectTypeValidator(value, schema, sourcePath) {
  if (schema.type === DataType.OBJECT && !isPlainObject(value)) {
    if (sourcePath) {
      throw new ValidationError("Value of %v must be a plain Object, but %v given.", sourcePath, value);
    } else {
      throw new ValidationError("Value must be a plain Object, but %v given.", value);
    }
  }
}
__name(objectTypeValidator, "objectTypeValidator");

// dist/esm/validators/string-type-validator.js
function stringTypeValidator(value, schema, sourcePath) {
  if (schema.type === DataType.STRING && typeof value !== "string") {
    if (sourcePath) {
      throw new ValidationError("Value of %v must be a String, but %v given.", sourcePath, value);
    } else {
      throw new ValidationError("Value must be a String, but %v given.", value);
    }
  }
}
__name(stringTypeValidator, "stringTypeValidator");

// dist/esm/validators/boolean-type-validator.js
function booleanTypeValidator(value, schema, sourcePath) {
  if (schema.type === DataType.BOOLEAN && typeof value !== "boolean") {
    if (sourcePath) {
      throw new ValidationError("Value of %v must be a Boolean, but %v given.", sourcePath, value);
    } else {
      throw new ValidationError("Value must be a Boolean, but %v given.", value);
    }
  }
}
__name(booleanTypeValidator, "booleanTypeValidator");

// dist/esm/debuggable-service.js
var import_js_service = require("@e22m4u/js-service");
var import_js_debug = require("@e22m4u/js-debug");
var _DebuggableService = class _DebuggableService extends import_js_service.Service {
  /**
   * Debug.
   */
  debug;
  /**
   * Возвращает функцию-отладчик с сегментом пространства имен
   * указанного в параметре метода.
   *
   * @param method
   * @protected
   */
  getDebuggerFor(method) {
    return this.debug.withHash().withNs(method.name);
  }
  /**
   * Constructor.
   *
   * @param container
   */
  constructor(container) {
    super(container);
    const serviceName = toCamelCase(this.constructor.name);
    this.debug = (0, import_js_debug.createDebugger)("tsDataSchema", serviceName);
    const debug = this.debug.withNs("constructor").withHash();
    debug("Service created.");
  }
};
__name(_DebuggableService, "DebuggableService");
var DebuggableService = _DebuggableService;

// dist/esm/data-validator.js
var _DataValidator = class _DataValidator extends DebuggableService {
  /**
   * Validators.
   *
   * @protected
   */
  validatorMap = /* @__PURE__ */ new Set([
    stringTypeValidator,
    numberTypeValidator,
    booleanTypeValidator,
    arrayTypeValidator,
    objectTypeValidator,
    isRequiredValidator
  ]);
  /**
   * Add validator.
   *
   * @param fn
   */
  addValidator(fn) {
    const debug = this.getDebuggerFor(this.addValidator);
    this.validatorMap.add(fn);
    debug("Validator %v is added.", fn.name);
    return this;
  }
  /**
   * Has validator.
   *
   * @param fn
   */
  hasValidator(fn) {
    return this.validatorMap.has(fn);
  }
  /**
   * Get validators.
   */
  getValidators() {
    return Array.from(this.validatorMap.values());
  }
  /**
   * Remove validator.
   *
   * @param fn
   */
  removeValidator(fn) {
    if (this.validatorMap.has(fn)) {
      const debug = this.getDebuggerFor(this.removeValidator);
      this.validatorMap.delete(fn);
      debug("Validator %v is removed.", fn.name);
      return this;
    }
    throw new import_js_format6.Errorf("Unable to remove non-existent validator %v.", fn.name);
  }
  /**
   * Remove all validators.
   */
  removeAllValidators() {
    this.validatorMap.clear();
    return this;
  }
  /**
   * Validate.
   *
   * @param value
   * @param schema
   * @param sourcePath A path like 'body.user.name' from which the value.
   */
  validate(value, schema, sourcePath) {
    const debug = this.getDebuggerFor(this.validate);
    const debugWo1 = debug.withOffset(1);
    debug("Validating a value against the given schema.");
    debug("Schema:");
    debugWo1((0, import_js_debug2.createColorizedDump)(schema));
    debug("Value:");
    debugWo1((0, import_js_debug2.createColorizedDump)(value));
    if (sourcePath)
      debug("Source path is %v.", sourcePath);
    const validators = this.getValidators();
    if (validators.length) {
      debug("%v global validators found.", validators.length);
      validators.forEach((fn) => fn(value, schema, sourcePath, this.container));
      debug("Global validators are passed.");
    } else {
      debug("No global validators found.");
    }
    let localValidators = [];
    if (Array.isArray(schema.validate)) {
      localValidators = schema.validate;
    } else if (typeof schema.validate === "function") {
      localValidators = [schema.validate];
    }
    if (localValidators.length) {
      debug("%v local validators found.", localValidators.length);
      localValidators.forEach((fn) => fn(value, schema, sourcePath, this.container));
      debug("Local validators are passed.");
    } else {
      debug("No local validators found.");
    }
    if (schema.type === DataType.ARRAY && schema.items && Array.isArray(value)) {
      debug("Validating array items.");
      const valueAsArray = value;
      for (const index in valueAsArray) {
        const elValue = valueAsArray[index];
        const elSchema = schema.items;
        const elSourcePath = sourcePath ? `${sourcePath}[${index}]` : `Array[${index}]`;
        this.validate(elValue, elSchema, elSourcePath);
      }
      debug("Array items validated.");
    }
    if (schema.type === DataType.OBJECT && schema.properties && value !== null && typeof value === "object" && !Array.isArray(value)) {
      debug("Validating object properties.");
      const valueAsObject = value;
      for (const propName in schema.properties) {
        const propSchema = schema.properties[propName];
        const propValue = valueAsObject[propName];
        const propSourcePath = sourcePath ? `${sourcePath}.${propName}` : propName;
        this.validate(propValue, propSchema, propSourcePath);
      }
      debug("Object properties validated.");
    }
    if (sourcePath) {
      debug("Validation of %v is passed.", sourcePath);
    } else {
      debug("Validation passed.");
    }
  }
};
__name(_DataValidator, "DataValidator");
var DataValidator = _DataValidator;

// dist/esm/data-type-caster.js
var import_js_format7 = require("@e22m4u/js-format");
var import_js_debug3 = require("@e22m4u/js-debug");

// dist/esm/type-casters/type-cast-to-array.js
function typeCastToArray(value) {
  if (Array.isArray(value))
    return value;
  if (typeof value === "string") {
    value = value.trim();
    let newValue;
    try {
      newValue = JSON.parse(value);
    } catch {
    }
    if (Array.isArray(newValue))
      return newValue;
  }
  throw new TypeCastError(value, DataType.STRING);
}
__name(typeCastToArray, "typeCastToArray");

// dist/esm/type-casters/type-cast-to-string.js
function typeCastToString(value) {
  if (typeof value === "string")
    return value;
  if (typeof value === "number")
    return String(value);
  throw new TypeCastError(value, DataType.STRING);
}
__name(typeCastToString, "typeCastToString");

// dist/esm/type-casters/type-cast-to-number.js
function typeCastToNumber(value) {
  if (typeof value === "string") {
    if (value.length <= 20) {
      const newValue = Number(value);
      if (!isNaN(newValue))
        return newValue;
    }
  } else if (typeof value === "number") {
    return value;
  } else if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  throw new TypeCastError(value, DataType.NUMBER);
}
__name(typeCastToNumber, "typeCastToNumber");

// dist/esm/type-casters/type-cast-to-boolean.js
function typeCastToBoolean(value) {
  if (typeof value === "string") {
    value = value.trim();
    if (value === "1")
      return true;
    if (value === "0")
      return false;
    if (value === "true")
      return true;
    if (value === "false")
      return false;
  } else if (typeof value === "number") {
    if (value === 1)
      return true;
    if (value === 0)
      return false;
  } else if (typeof value === "boolean") {
    return value;
  }
  throw new TypeCastError(value, DataType.BOOLEAN);
}
__name(typeCastToBoolean, "typeCastToBoolean");

// dist/esm/type-casters/type-cast-to-plain-object.js
function typeCastToPlainObject(value) {
  let newValue = value;
  if (typeof value === "string") {
    value = value.trim();
    try {
      newValue = JSON.parse(value);
    } catch {
    }
  }
  if (newValue != null && typeof newValue === "object" && !Array.isArray(newValue) && newValue.constructor === Object) {
    return newValue;
  }
  throw new TypeCastError(value, DataType.OBJECT);
}
__name(typeCastToPlainObject, "typeCastToPlainObject");

// dist/esm/data-type-caster.js
var _DataTypeCaster = class _DataTypeCaster extends DebuggableService {
  /**
   * Type caster map.
   *
   * @protected
   */
  typeCasterMap = /* @__PURE__ */ new Map([
    [DataType.STRING, typeCastToString],
    [DataType.NUMBER, typeCastToNumber],
    [DataType.BOOLEAN, typeCastToBoolean],
    [DataType.ARRAY, typeCastToArray],
    [DataType.OBJECT, typeCastToPlainObject]
  ]);
  /**
   * Set type caster.
   *
   * @param type
   * @param caster
   */
  setTypeCaster(type, caster) {
    const debug = this.getDebuggerFor(this.setTypeCaster);
    this.typeCasterMap.set(type, caster);
    debug("A type caster %v is set for %s type.", caster.name, type);
    return this;
  }
  /**
   * Get type caster.
   *
   * @param type
   */
  getTypeCaster(type) {
    const typeCaster = this.typeCasterMap.get(type);
    if (typeCaster)
      return typeCaster;
    throw new import_js_format7.Errorf("No type caster found for %s type.", type);
  }
  /**
   * Cast.
   *
   * @param value
   * @param schema
   * @param options
   */
  cast(value, schema, options) {
    var _a;
    const debug = this.getDebuggerFor(this.cast);
    const debugWo1 = debug.withOffset(1);
    debug("Converting value type based on the given schema.");
    debug("Schema:");
    debugWo1((0, import_js_debug3.createColorizedDump)(schema));
    debug("Value:");
    debugWo1((0, import_js_debug3.createColorizedDump)(value));
    const sourcePath = options == null ? void 0 : options.sourcePath;
    if (sourcePath)
      debug("Source path is %v.", sourcePath);
    const noTypeCastError = (_a = options == null ? void 0 : options.noTypeCastError) != null ? _a : false;
    if (noTypeCastError)
      debug("Type cast errors are disabled.");
    if (!schema.type) {
      debug("Data schema does not have the type definition.");
      debug("Type casting is skipped.");
      return value;
    }
    const targetType = schema.type;
    if (value == null) {
      if (noTypeCastError) {
        debug("No type casting required for %v.", value);
        debug("Type casting is skipped.");
        return value;
      } else {
        throw new TypeCastError(value, targetType);
      }
    }
    const sourceType = dataTypeFrom(value);
    debug("Source type is %s.", toPascalCase(sourceType));
    debug("Target type is %s.", toPascalCase(targetType));
    if (targetType === DataType.ANY) {
      debug("No type casting required for Any.");
      debug("Type casting is skipped.");
      return value;
    }
    let newValue = value;
    if (sourceType !== targetType) {
      const caster = this.getTypeCaster(schema.type);
      try {
        newValue = caster(value);
      } catch (error) {
        if (noTypeCastError && error instanceof TypeCastError) {
          debug(error.message);
          debug("Type casting is skipped.");
          return value;
        }
        throw error;
      }
    } else if (sourceType !== DataType.ARRAY && sourceType !== DataType.OBJECT) {
      debug("Source and target types are the same.");
      debug("Type casting skipped.");
      return value;
    }
    if (targetType === DataType.ARRAY) {
      debug("Type casting array items.");
      if (schema.items) {
        if (Array.isArray(newValue)) {
          const valueAsArray = newValue;
          for (const index in valueAsArray) {
            const elValue = valueAsArray[index];
            const elSchema = schema.items;
            const elSourcePath = sourcePath ? `${sourcePath}[${index}]` : `Array[${index}]`;
            valueAsArray[index] = this.cast(elValue, elSchema, {
              sourcePath: elSourcePath,
              noTypeCastError
            });
          }
          debug("Array items type casting completed.");
        } else {
          debug("A cast value is not an Array.");
        }
      } else {
        debug("No items schema specified.");
      }
    }
    if (schema.type === DataType.OBJECT) {
      debug("Type casting object properties.");
      if (schema.properties) {
        if (newValue !== null && typeof newValue === "object" && !Array.isArray(newValue)) {
          const valueAsObject = newValue;
          for (const propName in schema.properties) {
            const propSchema = schema.properties[propName];
            const propValue = valueAsObject[propName];
            const propSourcePath = sourcePath ? `${sourcePath}.${propName}` : propName;
            valueAsObject[propName] = this.cast(propValue, propSchema, {
              sourcePath: propSourcePath,
              noTypeCastError
            });
          }
          debug("Object properties type casting completed.");
        } else {
          debug("A cast value is not an Object.");
        }
      } else {
        debug("No properties schema specified.");
      }
    }
    if (sourceType !== targetType)
      debug("Value cast from %s to %s.", toPascalCase(sourceType), toPascalCase(targetType));
    debug("New value:");
    debugWo1((0, import_js_debug3.createColorizedDump)(newValue));
    return newValue;
  }
};
__name(_DataTypeCaster, "DataTypeCaster");
var DataTypeCaster = _DataTypeCaster;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DATA_SCHEMA_CLASS_METADATA_KEY,
  DATA_SCHEMA_PROPERTIES_METADATA_KEY,
  DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE,
  DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE,
  DataSchemaReflector,
  DataType,
  DataTypeCaster,
  DataValidator,
  DecoratorTargetError,
  REDUNDANT_TYPE_OPTION_ERROR_MESSAGE,
  TypeCastError,
  ValidationError,
  arrayTypeValidator,
  booleanTypeValidator,
  dataSchema,
  dataTypeFrom,
  dsAny,
  dsArray,
  dsBoolean,
  dsNumber,
  dsObject,
  dsProperty,
  dsString,
  isRequiredValidator,
  numberTypeValidator,
  objectTypeValidator,
  stringTypeValidator,
  typeCastToArray,
  typeCastToBoolean,
  typeCastToNumber,
  typeCastToPlainObject,
  typeCastToString
});

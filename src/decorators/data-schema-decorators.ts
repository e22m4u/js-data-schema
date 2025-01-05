import {Flatten} from '../types.js';
import {Prototype} from '../types.js';
import {Constructor} from '../types.js';
import {Errorf} from '@e22m4u/js-format';
import {DataType} from '../data-schema.js';
import {DataSchema} from '../data-schema.js';
import {DecoratorTargetError} from '../errors/index.js';
import {DecoratorTargetType} from '@e22m4u/ts-reflector';
import {getDecoratorTargetType} from '@e22m4u/ts-reflector';
import {DataSchemaMetadata} from './data-schema-metadata.js';
import {DataSchemaReflector} from './data-schema-reflector.js';
import {DataSchemaClassFactory} from './data-schema-metadata.js';

/**
 * Decorators list:
 *
 *   @dataSchema; - applies to class and instance property
 *   @dsProperty; - applies to instance property
 *
 * Decorator aliases:
 *
 *   @dsAny;      - applies to instance property
 *   @dsString;   - applies to instance property
 *   @dsNumber;   - applies to instance property
 *   @dsBoolean;  - applies to instance property
 *   @dsArray;    - applies to instance property
 *   @dsObject;   - applies to class and instance property
 */

/**
 * Decorator property target error message.
 */
export const DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE =
  '@%s decorator is only supported on an instance property.';

/**
 * Decorator class or property target error message.
 */
export const DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE =
  '@%s decorator is only supported on a class or an instance property.';

/**
 * Redundant type option error message.
 */
export const REDUNDANT_TYPE_OPTION_ERROR_MESSAGE =
  'The option "type" is not supported in the @%s decorator.';

/**
 * Data schema decorator.
 * (for class and instance property)
 *
 * @param schema
 */
export function dataSchema<T extends object>(schema: DataSchemaMetadata) {
  return function (
    target: Constructor<T> | Prototype<T>,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    const decoratorType = getDecoratorTargetType(
      target,
      propertyKey,
      descriptor,
    );
    if (
      decoratorType !== DecoratorTargetType.CONSTRUCTOR &&
      decoratorType !== DecoratorTargetType.INSTANCE_PROPERTY
    ) {
      throw new DecoratorTargetError(
        DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE,
        'dataSchema',
      );
    }
    const targetCtor =
      typeof target === 'object'
        ? (target.constructor as Constructor<T>)
        : target;
    DataSchemaReflector.setMetadata(schema, targetCtor, propertyKey);
  };
}

/**
 * Data schema property decorator.
 * (for instance property only)
 *
 * @param schema
 */
export function dsProperty<T extends object>(schema: DataSchemaMetadata) {
  return function (
    target: Prototype<T>,
    propertyKey: string,
    descriptor?: PropertyDescriptor,
  ) {
    const decoratorType = getDecoratorTargetType(
      target,
      propertyKey,
      descriptor,
    );
    if (decoratorType !== DecoratorTargetType.INSTANCE_PROPERTY)
      throw new DecoratorTargetError(
        DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE,
        'dsProperty',
      );
    DataSchemaReflector.setMetadata(
      schema,
      target.constructor as Constructor<T>,
      propertyKey,
    );
  };
}

/**
 * Data schema without type.
 */
export type DataSchemaMetadataWithoutType = Flatten<
  Omit<DataSchemaMetadata, 'type'>
>;

/**
 * Check data schema does not have specified type option.
 *
 * @param decoratorName
 * @param schema
 */
function checkDataSchemaDoesNotHaveSpecifiedTypeOption(
  decoratorName: string,
  schema: DataSchemaMetadataWithoutType | undefined,
) {
  // параметры декораторов с предустановленным типом
  // не должны объявляться с опцией "type", так как
  // тип жестко задан самим декоратором
  if (
    schema &&
    typeof schema === 'object' &&
    !Array.isArray(schema) &&
    (schema as Record<string, unknown>).type
  ) {
    throw new Errorf(REDUNDANT_TYPE_OPTION_ERROR_MESSAGE, decoratorName);
  }
}

/**
 * Wrap data schema decorator to replace error message.
 *
 * @param decoratorName
 * @param schema
 */
function wrapDataSchemaDecoratorToReplaceErrorMessage(
  decoratorName: string,
  schema: DataSchemaMetadata,
) {
  // перехват ошибки вызванной декоратором позволяет
  // заменить название декоратора в сообщении ошибки
  const dec = dataSchema(schema);
  return function <T extends object>(
    target: Constructor<T> | Prototype<T>,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    try {
      return dec(target, propertyKey, descriptor);
    } catch (error) {
      if (error instanceof DecoratorTargetError)
        throw new DecoratorTargetError(
          DECORATOR_CLASS_OR_PROPERTY_TARGET_ERROR_MESSAGE,
          decoratorName,
        );
      throw error;
    }
  };
}

/**
 * Wrap data schema property decorator to replace error message.
 *
 * @param decoratorName
 * @param schema
 */
function wrapDataSchemaPropertyDecoratorToReplaceErrorMessage(
  decoratorName: string,
  schema: DataSchemaMetadata,
) {
  // перехват ошибки вызванной декоратором позволяет
  // заменить название декоратора в сообщении ошибки
  const dec = dsProperty(schema);
  return function <T extends object>(
    target: Prototype<T>,
    propertyKey: string,
    descriptor?: PropertyDescriptor,
  ) {
    try {
      return dec(target, propertyKey, descriptor);
    } catch (error) {
      if (error instanceof DecoratorTargetError)
        throw new DecoratorTargetError(
          DECORATOR_PROPERTY_TARGET_ERROR_MESSAGE,
          decoratorName,
        );
      throw error;
    }
  };
}

/**
 * Create property decorator with data type.
 *
 * @param decoratorName
 * @param dataType
 */
function createDataSchemaPropertyDecoratorWithDataType(
  decoratorName: string,
  dataType: DataType,
) {
  return function (schema?: DataSchemaMetadataWithoutType) {
    // параметры декораторов с предустановленным типом
    // не должны объявляться с опцией "type", так как
    // тип жестко задан самим декоратором
    checkDataSchemaDoesNotHaveSpecifiedTypeOption(decoratorName, schema);
    // вызов декоратора через обертку, которая заменяет
    // имя декоратора в сообщении об ошибке
    return wrapDataSchemaPropertyDecoratorToReplaceErrorMessage(decoratorName, {
      ...schema,
      type: dataType,
    });
  };
}

/**
 * Data schema decorator of Any type.
 * (for instance property only)
 * Examples:
 * ```ts
 *   @dsAny()
 *   @dsAny({required: true})
 * ```
 */
export const dsAny = createDataSchemaPropertyDecoratorWithDataType(
  'dsAny',
  DataType.ANY,
);

/**
 * Data schema decorator of String type.
 * (for instance property only)
 * Examples:
 * ```ts
 *   @dsString()
 *   @dsString({required: true})
 * ```
 */
export const dsString = createDataSchemaPropertyDecoratorWithDataType(
  'dsString',
  DataType.STRING,
);

/**
 * Data schema decorator of Number type.
 * (for instance property only)
 * Examples:
 * ```ts
 *   @dsNumber()
 *   @dsNumber({required: true})
 * ```
 */
export const dsNumber = createDataSchemaPropertyDecoratorWithDataType(
  'dsNumber',
  DataType.NUMBER,
);

/**
 * Data schema decorator of Boolean type.
 * (for instance property only)
 * Examples:
 * ```ts
 *   @dsBoolean()
 *   @dsBoolean({required: true})
 * ```
 */
export const dsBoolean = createDataSchemaPropertyDecoratorWithDataType(
  'dsBoolean',
  DataType.BOOLEAN,
);

/**
 * Data schema decorator of Array type.
 * (for instance property only)
 * Examples:
 * ```ts
 *   @dsArray()
 *   @dsArray({required: true})
 *
 *   @dsArray(DataType.STRING);
 *   @dsArray(DataType.STRING, {required: true});
 *
 *   @dsArray({type: DataType.STRING});
 *   @dsArray({type: DataType.STRING}, {required: true});
 * ```
 *
 * @param schemaOrItemType
 * @param schema
 */
export const dsArray = (
  schemaOrItemType?:
    | DataSchemaMetadataWithoutType
    | DataSchemaMetadata
    | DataType,
  schema?: DataSchemaMetadataWithoutType,
) => {
  let arraySchemaWithoutType: DataSchemaMetadataWithoutType | undefined;
  // если первым аргументом является строка, то значение
  // аргумента используется как тип элементов массива,
  // тогда вторым аргументом считается схема массива
  //
  // пример 1:
  //   @dsArray(DataType.STRING);
  //
  // пример 2:
  //   @dsArray(DataType.STRING, {required: true});
  //
  if (typeof schemaOrItemType === 'string') {
    arraySchemaWithoutType = {
      ...schema,
      items: {type: schemaOrItemType},
    };
  }
  // если первым аргументом является объект содержащий тип,
  // то значение аргумента используется как схема элементов
  // массива, тогда вторым аргументом считается схема массива
  //
  // пример 1:
  //   @dsArray({type: DataType.STRING});
  //
  // пример 2:
  //   @dsArray({type: DataType.STRING}, {required: true});
  //
  else if (
    schemaOrItemType &&
    typeof schemaOrItemType === 'object' &&
    !Array.isArray(schemaOrItemType) &&
    'type' in schemaOrItemType &&
    schemaOrItemType.type
  ) {
    arraySchemaWithoutType = {
      ...schema,
      items: schemaOrItemType as DataSchema,
    };
  }
  // во всех остальных случаях схемой массива
  // считается первый или второй аргумент
  //
  // пример 1:
  //   @dsArray({required: true});
  //
  // пример 2:
  //   @dsArray(undefined, {required: true});
  //
  else {
    arraySchemaWithoutType = schemaOrItemType || schema;
  }
  // параметры декоратора не должны объявляться с опцией
  // "type", так как тип жестко задан самим декоратором
  checkDataSchemaDoesNotHaveSpecifiedTypeOption(
    'dsArray',
    arraySchemaWithoutType,
  );
  // вызов декоратора через обертку, которая заменяет
  // имя декоратора в сообщении об ошибке
  return wrapDataSchemaPropertyDecoratorToReplaceErrorMessage('dsArray', {
    ...arraySchemaWithoutType,
    type: DataType.ARRAY,
  });
};

/**
 * Data schema decorator of Object type.
 * (for class and instance property)
 * Examples:
 * ```ts
 *   @dsObject()
 *   @dsObject({required: true})
 * ```
 *
 * @param schemaOrClassFactory
 * @param schema
 */
export function dsObject(
  schemaOrClassFactory?: DataSchemaMetadataWithoutType | DataSchemaClassFactory,
  schema?: DataSchemaMetadataWithoutType,
) {
  // если первым аргументом является функция, то значение
  // аргумента используется как функция возвращающая
  // класс для извлечения схемы объекта
  if (typeof schemaOrClassFactory === 'function') {
    schema = schema || {};
    schema.properties = schemaOrClassFactory;
  }
  // если первым аргументом является объект, то значение
  // аргумента используется как схема объекта
  else if (
    schemaOrClassFactory &&
    typeof schemaOrClassFactory === 'object' &&
    !Array.isArray(schemaOrClassFactory)
  ) {
    schema = schemaOrClassFactory;
  }
  // параметры декоратора не должны содержать опцию "type",
  // так как тип жестко задан самим декоратором
  checkDataSchemaDoesNotHaveSpecifiedTypeOption('dsObject', schema);
  // вызов декоратора через обертку, которая заменяет
  // имя декоратора в сообщении об ошибке
  return wrapDataSchemaDecoratorToReplaceErrorMessage('dsObject', {
    ...schema,
    type: DataType.OBJECT,
  });
}

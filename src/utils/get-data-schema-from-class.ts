import {isClass} from './is-class.js';
import {Constructor} from '../types.js';
import {Errorf} from '@e22m4u/js-format';
import {DataType} from '../data-schema.js';
import {DataSchema} from '../data-schema.js';
import {DataSchemaProperties} from '../data-schema.js';
import {DataSchemaMetadata} from '../decorators/index.js';
import {DataSchemaReflector} from '../decorators/index.js';
import {DataSchemaClassFactory} from '../decorators/index.js';

/**
 * Get data schema from class.
 *
 * @param ctor
 * @param doNotThrowIfNoMetadata
 */
export function getDataSchemaFromClass<T extends object>(
  ctor: Constructor<T>,
  doNotThrowIfNoMetadata = false,
): DataSchema {
  const metadata = getDataSchemaMetadataFromClassAndProperties(
    ctor,
    doNotThrowIfNoMetadata,
  );
  return convertDataSchemaMetadataOrClassFactoryToDataSchema(
    metadata,
    doNotThrowIfNoMetadata,
  );
}

/**
 * Convert data schema metadata or class factory to data schema.
 *
 * @param input
 * @param doNotThrowIfNoMetadata
 */
function convertDataSchemaMetadataOrClassFactoryToDataSchema(
  input: DataSchemaMetadata | DataSchemaClassFactory,
  doNotThrowIfNoMetadata = false,
): DataSchema {
  if (typeof input === 'function')
    return getDataSchemaFromClass(
      getClassFromFactory(input),
      doNotThrowIfNoMetadata,
    );
  const result: DataSchema = {type: DataType.ANY};
  Object.assign(result, input);
  if (input.type === DataType.OBJECT) {
    // если в качестве схемы свойств определена фабрика,
    // то возвращаемое значение этой фабрики используется
    // как класс для извлечения мета-данных
    if (typeof input.properties === 'function') {
      result.properties = getDataSchemaFromClass(
        getClassFromFactory(input.properties),
        doNotThrowIfNoMetadata,
      ).properties;
    }
    // если схемой свойств является объект, то выполняется
    // обход каждого свойства на случай наличия фабрики
    else if (
      input.properties &&
      typeof input.properties === 'object' &&
      !Array.isArray(input.properties)
    ) {
      const inputProps = input.properties as DataSchemaProperties;
      const propNames = Object.keys(input.properties);
      if (propNames.length) {
        result.properties = {};
        propNames.forEach(propName => {
          const propValue = inputProps[propName];
          if (propValue == null) return;
          result.properties![propName] =
            convertDataSchemaMetadataOrClassFactoryToDataSchema(
              propValue,
              doNotThrowIfNoMetadata,
            );
        });
      }
    }
    // если схема свойств не определена,
    // то поле "properties" удаляется
    // из результирующего объекта
    else if (input.properties == null) {
      delete result.properties;
    }
    // если схемой свойств является значение отличное
    // от фабрики, объекта, null и undefined,
    // то выбрасывается ошибка
    else {
      throw new Errorf(
        'Properties schema allows a class factory ' +
          'or a schema object, but %v given.',
        input.properties,
      );
    }
  } else if (input.type === DataType.ARRAY) {
    // если в качестве схемы элементов массива определена
    // фабрика, то возвращаемое значение этой фабрики
    // используется как класс для извлечения мета-данных
    if (typeof input.items === 'function') {
      result.items = getDataSchemaFromClass(
        getClassFromFactory(input.items),
        doNotThrowIfNoMetadata,
      );
    }
    // если схемой элементов массива является объект,
    // то выполняется рекурсия на случай наличия фабрики
    else if (
      input.items &&
      typeof input.items === 'object' &&
      !Array.isArray(input.items)
    ) {
      result.items = convertDataSchemaMetadataOrClassFactoryToDataSchema(
        input.items,
        doNotThrowIfNoMetadata,
      );
    }
    // если схема элементов массива не определена,
    // то поле "items" удаляется из результирующего
    // объекта
    else if (input.items == null) {
      delete result.items;
    }
    // если схемой элементов массива является значение
    // отличное от фабрики, объекта, null и undefined,
    // то выбрасывается ошибка
    else {
      throw new Errorf(
        'Items schema allows a class factory ' +
          'or a schema object, but %v given.',
        result.items,
      );
    }
  }
  return result;
}

/**
 * Get data schema metadata from class and properties.
 *
 * @param ctor
 * @param doNotThrowIfNoMetadata
 */
function getDataSchemaMetadataFromClassAndProperties<T extends object>(
  ctor: Constructor<T>,
  doNotThrowIfNoMetadata = false,
): DataSchemaMetadata {
  const classMd = DataSchemaReflector.getClassMetadata(ctor);
  const result: DataSchemaMetadata = {type: DataType.OBJECT};
  if (classMd) Object.assign(result, classMd);
  const propsMd = DataSchemaReflector.getPropertiesMetadata(ctor);
  if (!classMd && !propsMd.size) {
    if (!doNotThrowIfNoMetadata)
      throw new Errorf('Class %v does not have data schema.', ctor);
    return result;
  }
  if (!propsMd.size) return result;
  if (typeof result.properties === 'function') {
    result.properties = getDataSchemaFromClass(
      getClassFromFactory(result.properties),
      doNotThrowIfNoMetadata,
    ).properties;
  } else if (!result.properties) {
    result.properties = {};
  }
  for (const [propName, propMd] of propsMd) {
    if (propMd) result.properties![propName] = propMd;
  }
  return result;
}

/**
 * Get class from factory.
 *
 * @param factory
 */
function getClassFromFactory<T extends object>(
  factory: DataSchemaClassFactory,
): Constructor<T> {
  const cls = factory();
  // если результатом фабрики не является
  // класс, то выбрасывается ошибка
  if (!isClass(cls))
    throw new Errorf('Class factory must return a class, but %v given.', cls);
  return cls as Constructor<T>;
}

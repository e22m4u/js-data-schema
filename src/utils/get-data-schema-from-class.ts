import {isClass} from './is-class.js';
import {Constructor} from '../types.js';
import {Errorf} from '@e22m4u/js-format';
import {DataType} from '../data-schema.js';
import {DataSchema} from '../data-schema.js';
import {DataSchemaMetadata} from '../decorators/index.js';
import {DataSchemaReflector} from '../decorators/index.js';

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
  const classMd = DataSchemaReflector.getClassMetadata(ctor);
  const result: DataSchema = {type: DataType.OBJECT};
  if (classMd) {
    Object.assign(result, classMd);
    result.properties = getPropsSchemaFromClassOrFactory(classMd.properties);
  }
  // извлечение мета-данных свойств класса
  const propsMd = DataSchemaReflector.getPropertiesMetadata(ctor);
  // если класс и его свойства не содержат мета-данных,
  // то выбрасывается ошибка или возвращается базовая
  // схема объекта по умолчанию
  if (!classMd && !propsMd.size) {
    if (!doNotThrowIfNoMetadata)
      throw new Errorf('Class %v does not have data schema.', ctor);
    return result;
  }
  // последовательный обход мета-данных
  // каждого свойства
  for (const [propName, propMd] of propsMd) {
    const propSchema: DataSchema = {type: DataType.ANY};
    Object.assign(propSchema, propMd);
    propSchema.properties = getPropsSchemaFromClassOrFactory(propMd.properties);
    if (!propSchema.properties) delete propSchema.properties;
    // запись схемы текущего свойства в результат
    result.properties = result.properties || {};
    result.properties[propName] = propSchema;
  }
  return result;
}

/**
 * Get properties schema from class or factory.
 *
 * @param input
 * @param doNotThrowIfNoMetadata
 */
function getPropsSchemaFromClassOrFactory(
  input: DataSchemaMetadata['properties'],
  doNotThrowIfNoMetadata = false,
): DataSchema['properties'] {
  // если значением является класс,
  // то извлекается схема его свойств
  if (isClass(input)) {
    const dataSchema = getDataSchemaFromClass(input, doNotThrowIfNoMetadata);
    return dataSchema.properties;
  }
  // если значением является фабрика класса,
  // то извлекается класс и схема его свойств
  else if (typeof input === 'function') {
    const nestedClass = input();
    // если результатом фабрики не является
    // класс, то выбрасывается ошибка
    if (!isClass(nestedClass))
      throw new Errorf(
        'Class factory must return a class, but %v given.',
        nestedClass,
      );
    const nestedSchema = getDataSchemaFromClass(
      nestedClass,
      doNotThrowIfNoMetadata,
    );
    return nestedSchema.properties;
  }
  // в противном случае входящее значение
  // возвращается без изменений
  return input;
}

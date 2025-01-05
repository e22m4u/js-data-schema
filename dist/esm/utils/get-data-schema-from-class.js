import { isClass } from './is-class.js';
import { Errorf } from '@e22m4u/js-format';
import { DataType } from '../data-schema.js';
import { DataSchemaReflector } from '../decorators/index.js';
/**
 * Get data schema from class.
 *
 * @param ctor
 * @param doNotThrowIfNoMetadata
 */
export function getDataSchemaFromClass(ctor, doNotThrowIfNoMetadata = false) {
    const classMd = DataSchemaReflector.getClassMetadata(ctor);
    const result = { type: DataType.OBJECT };
    if (classMd) {
        Object.assign(result, classMd);
        // если в качестве схемы свойств определена фабрика,
        // то возвращаемое значение этой фабрики используется
        // как класс для извлечения мета-данных
        if (typeof classMd.properties === 'function') {
            result.properties = getPropsSchemaFromClassFactory(classMd.properties);
        }
        // если схемой свойств является объект,
        // то значение объекта используется
        // как схема свойств без изменений
        else if (classMd.properties &&
            typeof classMd.properties === 'object' &&
            !Array.isArray(classMd.properties)) {
            result.properties = classMd.properties;
        }
        // если схема свойств не определена,
        // то поле "properties" удаляется
        // из результирующего объекта
        else if (classMd.properties == null) {
            delete result.properties;
        }
        // если схемой свойств является значение отличное
        // от фабрики, объекта, null и undefined,
        // то выбрасывается ошибка
        else {
            throw new Errorf('Properties schema allows a class factory ' +
                'or a schema object, but %v given.', classMd.properties);
        }
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
        const propSchema = { type: DataType.ANY };
        Object.assign(propSchema, propMd);
        // если в качестве схемы свойств определена фабрика,
        // то возвращаемое значение этой фабрики используется
        // как класс для извлечения мета-данных
        if (typeof propMd.properties === 'function') {
            propSchema.properties = getPropsSchemaFromClassFactory(propMd.properties);
        }
        // если схемой свойств является объект,
        // то значение объекта используется
        // как схема свойств без изменений
        else if (propMd.properties &&
            typeof propMd.properties === 'object' &&
            !Array.isArray(propMd.properties)) {
            propSchema.properties = propMd.properties;
        }
        // если схема свойств не определена,
        // то поле "properties" удаляется
        // из результирующей схемы
        else if (propMd.properties == null) {
            delete propSchema.properties;
        }
        // если схемой свойств является значение отличное
        // от фабрики, объекта, null и undefined,
        // то выбрасывается ошибка
        else {
            throw new Errorf('Properties schema allows a class factory ' +
                'or a schema object, but %v given.', propMd.properties);
        }
        // запись схемы текущего свойства в результат
        result.properties = result.properties || {};
        result.properties[propName] = propSchema;
    }
    return result;
}
/**
 * Get properties schema from class factory.
 *
 * @param factory
 * @param doNotThrowIfNoMetadata
 */
function getPropsSchemaFromClassFactory(factory, doNotThrowIfNoMetadata = false) {
    const nestedClass = factory();
    // если результатом фабрики не является
    // класс, то выбрасывается ошибка
    if (!isClass(nestedClass))
        throw new Errorf('Class factory must return a class, but %v given.', nestedClass);
    const nestedSchema = getDataSchemaFromClass(nestedClass, doNotThrowIfNoMetadata);
    return nestedSchema.properties;
}

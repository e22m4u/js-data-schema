import { Errorf } from '@e22m4u/js-format';
import { DataType } from './data-schema.js';
import { dataTypeFrom } from './data-schema.js';
import { TypeCastError } from './errors/index.js';
import { typeCastToArray } from './type-casters/index.js';
import { typeCastToNumber } from './type-casters/index.js';
import { typeCastToString } from './type-casters/index.js';
import { DebuggableService } from './debuggable-service.js';
import { typeCastToBoolean } from './type-casters/index.js';
import { typeCastToPlainObject } from './type-casters/index.js';
/**
 * Data type caster.
 */
export class DataTypeCaster extends DebuggableService {
    /**
     * Type caster map.
     *
     * @protected
     */
    typeCasterMap = new Map([
        [DataType.STRING, typeCastToString],
        [DataType.NUMBER, typeCastToNumber],
        [DataType.BOOLEAN, typeCastToBoolean],
        [DataType.ARRAY, typeCastToArray],
        [DataType.OBJECT, typeCastToPlainObject],
    ]);
    /**
     * Set type caster.
     *
     * @param type
     * @param caster
     */
    setTypeCaster(type, caster) {
        this.typeCasterMap.set(type, caster);
        this.debug('A type caster %v is set for %s type.', caster.name, type);
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
        throw new Errorf('No type caster found for %s type.', type);
    }
    /**
     * Cast.
     *
     * @param value
     * @param schema
     * @param options
     */
    cast(value, schema, options) {
        this.debug('Type casting.');
        const sourcePath = options?.sourcePath;
        if (sourcePath)
            this.debug('Source path is %v.', sourcePath);
        const noTypeCastError = options?.noTypeCastError ?? false;
        if (noTypeCastError)
            this.debug('Type cast errors are disabled.');
        // если определение не имеет типа,
        // то пропускаем преобразование
        if (!schema.type) {
            this.debug('Data schema does not have the type definition.');
            this.debug('Type casting is skipped.');
            return value;
        }
        const targetType = schema.type;
        // если значением является null или undefined,
        // то пропускаем преобразование, или выбрасываем
        // ошибку в строгом режиме
        if (value == null) {
            if (noTypeCastError) {
                this.debug('No type casting required for %v.', value);
                this.debug('Type casting is skipped.');
                return value;
            }
            else {
                throw new TypeCastError(value, targetType);
            }
        }
        // если целевой тип является ANY,
        // то пропускаем преобразование
        const sourceType = dataTypeFrom(value);
        this.debug('Source type is %s.', sourceType);
        this.debug('Target type is %s.', targetType);
        if (targetType === DataType.ANY) {
            this.debug('No type casting required for Any.');
            this.debug('Type casting is skipped.');
            return value;
        }
        // если исходный тип не соответствует целевому,
        // то выполняем преобразование значения
        let newValue = value;
        if (sourceType !== targetType) {
            const caster = this.getTypeCaster(schema.type);
            try {
                newValue = caster(value);
            }
            catch (error) {
                if (noTypeCastError && error instanceof TypeCastError) {
                    this.debug(error.message);
                    this.debug('Type casting is skipped.');
                    return value;
                }
                throw error;
            }
        }
        // если исходный тип соответствует целевому,
        // и не является массивом или объектом,
        // то возвращаем значение без изменений
        else if (sourceType !== DataType.ARRAY && sourceType !== DataType.OBJECT) {
            this.debug('Source and target types are the same.');
            this.debug('Type casting is skipped.');
            return value;
        }
        // в случае массива, рекурсивно
        // проходим по каждому элементу
        if (targetType === DataType.ARRAY &&
            schema.items &&
            Array.isArray(newValue)) {
            this.debug('Starting type casting of array items.');
            const valueAsArray = newValue;
            for (const index in valueAsArray) {
                const elValue = valueAsArray[index];
                const elSchema = schema.items;
                const elSourcePath = sourcePath
                    ? `${sourcePath}[${index}]`
                    : `Array[${index}]`;
                valueAsArray[index] = this.cast(elValue, elSchema, {
                    sourcePath: elSourcePath,
                    noTypeCastError,
                });
            }
            this.debug('Type casting of array items is done.');
        }
        // в случае объекта, рекурсивно
        // проходим по каждому свойству
        if (schema.type === DataType.OBJECT &&
            schema.properties &&
            newValue !== null &&
            typeof newValue === 'object' &&
            !Array.isArray(newValue)) {
            this.debug('Starting type casting of object properties.');
            const valueAsObject = newValue;
            for (const propName in schema.properties) {
                const propSchema = schema.properties[propName];
                const propValue = valueAsObject[propName];
                const propSourcePath = sourcePath
                    ? `${sourcePath}.${propName}`
                    : propName;
                valueAsObject[propName] = this.cast(propValue, propSchema, {
                    sourcePath: propSourcePath,
                    noTypeCastError,
                });
            }
            this.debug('Type casting of object properties is done.');
        }
        this.debug('%s has been casted to %s.', sourceType, targetType);
        this.debug('New value is %v.', newValue);
        return newValue;
    }
}

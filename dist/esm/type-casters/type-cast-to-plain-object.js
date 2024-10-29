import { DataType } from '../data-schema.js';
import { TypeCastError } from '../errors/index.js';
/**
 * Type cast to plain object.
 *
 * @param value
 */
export function typeCastToPlainObject(value) {
    let newValue = value;
    // попытка разбора строки как JSON
    if (typeof value === 'string') {
        value = value.trim();
        try {
            newValue = JSON.parse(value);
        }
        catch {
            //
        }
    }
    // если новое значение является прямым
    // наследником класса Object,
    // то возвращаем его
    if (newValue != null &&
        typeof newValue === 'object' &&
        !Array.isArray(newValue) &&
        newValue.constructor === Object) {
        return newValue;
    }
    throw new TypeCastError(value, DataType.OBJECT);
}

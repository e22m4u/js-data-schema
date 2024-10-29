import { DataType } from '../data-schema.js';
import { TypeCastError } from '../errors/index.js';
/**
 * Type cast to array.
 *
 * @param value
 */
export function typeCastToArray(value) {
    if (Array.isArray(value))
        return value;
    if (typeof value === 'string') {
        value = value.trim();
        let newValue;
        try {
            newValue = JSON.parse(value);
        }
        catch {
            //
        }
        if (Array.isArray(newValue))
            return newValue;
    }
    throw new TypeCastError(value, DataType.STRING);
}

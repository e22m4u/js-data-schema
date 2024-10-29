import { DataType } from '../data-schema.js';
import { ValidationError } from '../errors/validation-error.js';
/**
 * Object type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export function objectTypeValidator(value, schema, sourcePath) {
    if (schema.type === DataType.OBJECT &&
        (value === null ||
            typeof value !== 'object' ||
            Array.isArray(value) ||
            value.constructor !== Object)) {
        if (sourcePath) {
            throw new ValidationError('Value of %v must be a plain Object, but %v given.', sourcePath, value);
        }
        else {
            throw new ValidationError('Value must be a plain Object, but %v given.', value);
        }
    }
}

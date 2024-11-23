import { DataType } from '../data-schema.js';
import { isPlainObject } from '../utils/index.js';
import { ValidationError } from '../errors/validation-error.js';
/**
 * Object type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export function objectTypeValidator(value, schema, sourcePath) {
    if (schema.type === DataType.OBJECT && !isPlainObject(value)) {
        if (sourcePath) {
            throw new ValidationError('Value of %v must be a plain Object, but %v given.', sourcePath, value);
        }
        else {
            throw new ValidationError('Value must be a plain Object, but %v given.', value);
        }
    }
}

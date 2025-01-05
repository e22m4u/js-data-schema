import { DataType } from '../data-schema.js';
import { ValidationError } from '../errors/index.js';
/**
 * Boolean type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export function booleanTypeValidator(value, schema, sourcePath) {
    if (schema.type === DataType.BOOLEAN && typeof value !== 'boolean') {
        if (sourcePath) {
            throw new ValidationError('Value of %v must be a Boolean, but %v given.', sourcePath, value);
        }
        else {
            throw new ValidationError('Value must be a Boolean, but %v given.', value);
        }
    }
}

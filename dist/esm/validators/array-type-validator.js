import { DataType } from '../data-schema.js';
import { ValidationError } from '../errors/index.js';
import { EmptyValuesService } from '@e22m4u/js-empty-values';
/**
 * Array type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export function arrayTypeValidator(value, schema, sourcePath, container) {
    if (schema.type === DataType.ARRAY && !Array.isArray(value)) {
        const isEmpty = container
            .get(EmptyValuesService)
            .isEmptyByType(schema.type, value);
        if (isEmpty)
            return;
        if (sourcePath) {
            throw new ValidationError('Value of %v must be an Array, but %v was given.', sourcePath, value);
        }
        else {
            throw new ValidationError('Value must be an Array, but %v was given.', value);
        }
    }
}

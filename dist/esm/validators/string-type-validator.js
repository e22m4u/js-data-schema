import { DataType } from '../data-schema.js';
import { ValidationError } from '../errors/index.js';
import { EmptyValuesService } from '@e22m4u/js-empty-values';
/**
 * String type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export function stringTypeValidator(value, schema, sourcePath, container) {
    if (schema.type === DataType.STRING && typeof value !== 'string') {
        const isEmpty = container
            .get(EmptyValuesService)
            .isEmptyByType(schema.type, value);
        if (isEmpty)
            return;
        if (sourcePath) {
            throw new ValidationError('Value of %v must be a String, but %v was given.', sourcePath, value);
        }
        else {
            throw new ValidationError('Value must be a String, but %v was given.', value);
        }
    }
}

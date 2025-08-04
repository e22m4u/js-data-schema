import { DataType } from '../data-schema.js';
import { isPlainObject } from '../utils/index.js';
import { ValidationError } from '../errors/index.js';
import { EmptyValuesService } from '@e22m4u/js-empty-values';
/**
 * Object type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 * @param container
 */
export function objectTypeValidator(value, schema, sourcePath, container) {
    if (schema.type === DataType.OBJECT && !isPlainObject(value)) {
        const isEmpty = container
            .get(EmptyValuesService)
            .isEmptyByType(schema.type, value);
        if (isEmpty)
            return;
        if (sourcePath) {
            throw new ValidationError('Value of %v must be a plain Object, but %v given.', sourcePath, value);
        }
        else {
            throw new ValidationError('Value must be a plain Object, but %v given.', value);
        }
    }
}

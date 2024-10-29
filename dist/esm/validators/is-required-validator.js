import { ValidationError } from '../errors/validation-error.js';
/**
 * Is required validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export function isRequiredValidator(value, schema, sourcePath) {
    if (schema.required && value == null) {
        if (sourcePath) {
            throw new ValidationError('Value of %v is required, but %v given.', sourcePath, value);
        }
        else {
            throw new ValidationError('Value is required, but %v given.', value);
        }
    }
}

import {DataSchema} from '../data-schema.js';
import {ValidationError} from '../errors/index.js';

/**
 * Is required validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export function isRequiredValidator(
  value: unknown,
  schema: DataSchema,
  sourcePath?: string,
) {
  if (schema.required && value == null) {
    if (sourcePath) {
      throw new ValidationError(
        'Value of %v is required, but %v given.',
        sourcePath,
        value,
      );
    } else {
      throw new ValidationError('Value is required, but %v given.', value);
    }
  }
}

import {DataType} from '../data-schema.js';
import {DataSchema} from '../data-schema.js';
import {ValidationError} from '../errors/validation-error.js';

/**
 * Boolean type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export function booleanTypeValidator(
  value: unknown,
  schema: DataSchema,
  sourcePath?: string,
) {
  if (schema.type === DataType.BOOLEAN && typeof value !== 'boolean') {
    if (sourcePath) {
      throw new ValidationError(
        'Value of %v must be a Boolean, but %v given.',
        sourcePath,
        value,
      );
    } else {
      throw new ValidationError(
        'Value must be a Boolean, but %v given.',
        value,
      );
    }
  }
}

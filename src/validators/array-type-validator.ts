import {DataType} from '../data-schema.js';
import {DataSchema} from '../data-schema.js';
import {ValidationError} from '../errors/index.js';

/**
 * Array type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export function arrayTypeValidator(
  value: unknown,
  schema: DataSchema,
  sourcePath?: string,
) {
  if (schema.type === DataType.ARRAY && !Array.isArray(value)) {
    if (sourcePath) {
      throw new ValidationError(
        'Value of %v must be an Array, but %v given.',
        sourcePath,
        value,
      );
    } else {
      throw new ValidationError('Value must be an Array, but %v given.', value);
    }
  }
}

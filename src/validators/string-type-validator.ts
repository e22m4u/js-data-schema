import {DataType} from '../data-schema.js';
import {DataSchema} from '../data-schema.js';
import {ValidationError} from '../errors/index.js';

/**
 * String type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export function stringTypeValidator(
  value: unknown,
  schema: DataSchema,
  sourcePath?: string,
) {
  if (schema.type === DataType.STRING && typeof value !== 'string') {
    if (sourcePath) {
      throw new ValidationError(
        'Value of %v must be a String, but %v given.',
        sourcePath,
        value,
      );
    } else {
      throw new ValidationError('Value must be a String, but %v given.', value);
    }
  }
}

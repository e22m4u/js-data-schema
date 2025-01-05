import {DataType} from '../data-schema.js';
import {DataSchema} from '../data-schema.js';
import {ValidationError} from '../errors/index.js';

/**
 * Number type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export function numberTypeValidator(
  value: unknown,
  schema: DataSchema,
  sourcePath?: string,
) {
  if (
    schema.type === DataType.NUMBER &&
    (typeof value !== 'number' || isNaN(value))
  ) {
    if (sourcePath) {
      throw new ValidationError(
        'Value of %v must be a Number, but %v given.',
        sourcePath,
        value,
      );
    } else {
      throw new ValidationError('Value must be a Number, but %v given.', value);
    }
  }
}

import {DataType} from '../data-schema.js';
import {TypeCastError} from '../errors/index.js';

/**
 * Type cast to string.
 *
 * @param value
 */
export function typeCastToString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  throw new TypeCastError(value, DataType.STRING);
}

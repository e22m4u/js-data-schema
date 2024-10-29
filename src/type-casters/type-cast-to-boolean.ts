import {DataType} from '../data-schema.js';
import {TypeCastError} from '../errors/index.js';

/**
 * Type cast to boolean.
 *
 * @param value
 */
export function typeCastToBoolean(value: unknown): boolean {
  if (typeof value === 'string') {
    value = value.trim();
    if (value === '1') return true;
    if (value === '0') return false;
    if (value === 'true') return true;
    if (value === 'false') return false;
  } else if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  } else if (typeof value === 'boolean') {
    return value;
  }
  throw new TypeCastError(value, DataType.BOOLEAN);
}

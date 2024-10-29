import {DataType} from '../data-schema.js';
import {TypeCastError} from '../errors/index.js';

/**
 * Type cast to number.
 *
 * @param value
 */
export function typeCastToNumber(value: unknown): number {
  if (typeof value === 'string') {
    if (value.length <= 20) {
      const newValue = Number(value);
      if (!isNaN(newValue)) return newValue;
    }
  } else if (typeof value === 'number') {
    return value;
  } else if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  throw new TypeCastError(value, DataType.NUMBER);
}

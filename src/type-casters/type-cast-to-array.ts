import {DataType} from '../data-schema.js';
import {TypeCastError} from '../errors/index.js';

/**
 * Type cast to array.
 *
 * @param value
 */
export function typeCastToArray<T = unknown>(value: unknown): T[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    value = value.trim();
    let newValue;
    try {
      newValue = JSON.parse(value as string);
    } catch {
      //
    }
    if (Array.isArray(newValue)) return newValue;
  }
  throw new TypeCastError(value, DataType.STRING);
}

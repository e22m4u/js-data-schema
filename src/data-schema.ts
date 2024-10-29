import {CallableValidator} from './data-validator.js';

/**
 * Data type.
 */
export enum DataType {
  ANY = 'Any',
  STRING = 'String',
  NUMBER = 'Number',
  BOOLEAN = 'Boolean',
  ARRAY = 'Array',
  OBJECT = 'Object',
}

/**
 * Data schema.
 */
export type DataSchema = {
  type: DataType;
  items?: DataSchema;
  properties?: {[key: string]: DataSchema};
  required?: boolean;
  validate?: CallableValidator | CallableValidator[];
};

/**
 * Data type from value.
 *
 * @param value
 */
export function dataTypeFrom(
  value: unknown,
): Exclude<DataType, DataType.ANY> | undefined {
  if (value == null) return undefined;
  const baseType = typeof value;
  if (baseType === 'string') return DataType.STRING;
  if (baseType === 'number') return DataType.NUMBER;
  if (baseType === 'boolean') return DataType.BOOLEAN;
  if (Array.isArray(value)) return DataType.ARRAY;
  if (baseType === 'object') return DataType.OBJECT;
  return undefined;
}

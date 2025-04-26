import {CallableValidator} from './data-validator.js';

/**
 * Data type.
 */
export enum DataType {
  ANY = 'any',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
}

/**
 * Data schema.
 */
export type DataSchema = {
  type: DataType;
  items?: DataSchema;
  properties?: DataSchemaProperties;
  required?: boolean;
  validate?: CallableValidator | CallableValidator[];
};

/**
 * Data schema properties.
 */
export type DataSchemaProperties = {
  [key: string]: DataSchema | undefined;
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

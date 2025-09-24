import {CallableValidator} from './data-validator.js';

/**
 * Data type.
 */
export const DataType = {
  ANY: 'any',
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ARRAY: 'array',
  OBJECT: 'object',
} as const;

/**
 * Type of DataType.
 */
export type DataType = (typeof DataType)[keyof typeof DataType];

/**
 * Data schema.
 */
export type DataSchema = {
  type: DataType;
  items?: DataSchema;
  properties?: DataSchemaProperties;
  required?: boolean;
  validate?: CallableValidator | CallableValidator[];
  default?: unknown;
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
export function dataTypeFrom(value: unknown): DataType {
  if (value == null) return DataType.ANY;
  const baseType = typeof value;
  if (baseType === 'string') return DataType.STRING;
  if (baseType === 'number') return DataType.NUMBER;
  if (baseType === 'boolean') return DataType.BOOLEAN;
  if (Array.isArray(value)) return DataType.ARRAY;
  if (baseType === 'object') return DataType.OBJECT;
  return DataType.ANY;
}

import {Constructor} from '../types.js';
import {DataType} from '../data-schema.js';
import {MetadataKey} from '@e22m4u/ts-reflector';
import {CallableValidator} from '../data-validator.js';

/**
 * Data schema metadata.
 */
export type DataSchemaMetadata = {
  type: DataType;
  items?: DataSchemaMetadataItems;
  properties?: DataSchemaMetadataProperties;
  required?: boolean;
  validate?: CallableValidator | CallableValidator[];
};

/**
 * Data schema metadata items.
 */
export type DataSchemaMetadataItems =
  | DataSchemaMetadata
  | DataSchemaClassFactory;

/**
 * Data schema metadata properties.
 */
export type DataSchemaMetadataProperties =
  | {
      [key: string]: DataSchemaMetadata | DataSchemaClassFactory | undefined;
    }
  | DataSchemaClassFactory;

/**
 * Data schema class factory.
 */
export type DataSchemaClassFactory<T extends object = object> =
  () => Constructor<T>;

/**
 * Property metadata map.
 */
export type DataSchemaPropertyMetadataMap = Map<string, DataSchemaMetadata>;

/**
 * Class metadata key.
 */
export const DATA_SCHEMA_CLASS_METADATA_KEY =
  new MetadataKey<DataSchemaMetadata>('dataSchemaClassMetadataKey');

/**
 * Properties metadata key.
 */
export const DATA_SCHEMA_PROPERTIES_METADATA_KEY =
  new MetadataKey<DataSchemaPropertyMetadataMap>(
    'dataSchemaPropertiesMetadataKey',
  );

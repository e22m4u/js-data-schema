import {Flatten} from '../types.js';
import {Constructor} from '../types.js';
import {DataSchema} from '../data-schema.js';
import {MetadataKey} from '@e22m4u/ts-reflector';

/**
 * Data schema metadata.
 */
export type DataSchemaMetadata = Flatten<Omit<DataSchema, 'properties'>> & {
  properties?: DataSchema['properties'] | DataSchemaCtorOrCtorFactory;
};

/**
 * Data schema ctor factory.
 */
export type DataSchemaCtorOrCtorFactory<T extends object = object> =
  | (() => Constructor<T>)
  | Constructor<T>;

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

import { Constructor } from '../types.js';
import { DataSchema } from '../data-schema.js';
/**
 * Get data schema from class.
 *
 * @param ctor
 * @param doNotThrowIfNoMetadata
 */
export declare function getDataSchemaFromClass<T extends object>(ctor: Constructor<T>, doNotThrowIfNoMetadata?: boolean): DataSchema;

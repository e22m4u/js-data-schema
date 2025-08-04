import { DataSchema } from '../data-schema.js';
import { ServiceContainer } from '@e22m4u/js-service';
/**
 * Object type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 * @param container
 */
export declare function objectTypeValidator(value: unknown, schema: DataSchema, sourcePath: string | undefined, container: ServiceContainer): void;

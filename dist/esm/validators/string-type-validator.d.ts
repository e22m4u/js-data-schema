import { DataSchema } from '../data-schema.js';
import { ServiceContainer } from '@e22m4u/js-service';
/**
 * String type validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 */
export declare function stringTypeValidator(value: unknown, schema: DataSchema, sourcePath: string | undefined, container: ServiceContainer): void;

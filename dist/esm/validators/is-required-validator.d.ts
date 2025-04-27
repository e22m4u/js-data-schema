import { DataSchema } from '../data-schema.js';
import { ServiceContainer } from '@e22m4u/js-service';
/**
 * Is required validator.
 *
 * @param value
 * @param schema
 * @param sourcePath
 * @param services
 */
export declare function isRequiredValidator(value: unknown, schema: DataSchema, sourcePath: string | undefined, services: ServiceContainer): void;

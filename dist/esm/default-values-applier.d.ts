import { DataSchema } from './data-schema.js';
import { DebuggableService } from './debuggable-service.js';
/**
 * Default values applier.
 */
export declare class DefaultValuesApplier extends DebuggableService {
    /**
     * Apply default values if needed.
     *
     * @param value
     * @param schema
     * @param sourcePath
     */
    applyDefaultValuesIfNeeded(value: unknown, schema: DataSchema, sourcePath?: string): unknown;
}

import { Constructor } from '../types.js';
import { DataSchemaMetadata } from './data-schema-metadata.js';
import { DataSchemaPropertyMetadataMap } from './data-schema-metadata.js';
/**
 * Data schema reflector.
 */
export declare class DataSchemaReflector {
    /**
     * Set metadata.
     *
     * @param metadata
     * @param target
     * @param propertyKey
     */
    static setMetadata(metadata: DataSchemaMetadata, target: Constructor, propertyKey?: string): void;
    /**
     * Get class metadata.
     *
     * @param target
     */
    static getClassMetadata(target: Constructor): DataSchemaMetadata | undefined;
    /**
     * Get properties metadata.
     *
     * @param target
     */
    static getPropertiesMetadata(target: Constructor): DataSchemaPropertyMetadataMap;
}

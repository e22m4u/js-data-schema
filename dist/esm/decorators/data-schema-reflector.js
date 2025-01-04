import { Reflector } from '@e22m4u/ts-reflector';
import { DATA_SCHEMA_CLASS_METADATA_KEY } from './data-schema-metadata.js';
import { DATA_SCHEMA_PROPERTIES_METADATA_KEY } from './data-schema-metadata.js';
/**
 * Data schema reflector.
 */
export class DataSchemaReflector {
    /**
     * Set metadata.
     *
     * @param metadata
     * @param target
     * @param propertyKey
     */
    static setMetadata(metadata, target, propertyKey) {
        if (propertyKey == null) {
            Reflector.defineMetadata(DATA_SCHEMA_CLASS_METADATA_KEY, metadata, target);
        }
        else {
            const oldMap = Reflector.getOwnMetadata(DATA_SCHEMA_PROPERTIES_METADATA_KEY, target);
            const newMap = new Map(oldMap);
            newMap.set(propertyKey, metadata);
            Reflector.defineMetadata(DATA_SCHEMA_PROPERTIES_METADATA_KEY, newMap, target);
        }
    }
    /**
     * Get class metadata.
     *
     * @param target
     */
    static getClassMetadata(target) {
        return Reflector.getOwnMetadata(DATA_SCHEMA_CLASS_METADATA_KEY, target);
    }
    /**
     * Get properties metadata.
     *
     * @param target
     */
    static getPropertiesMetadata(target) {
        const metadata = Reflector.getOwnMetadata(DATA_SCHEMA_PROPERTIES_METADATA_KEY, target);
        return metadata ?? new Map();
    }
}

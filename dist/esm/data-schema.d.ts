import { CallableValidator } from './data-validator.js';
/**
 * Data type.
 */
export declare const DataType: {
    readonly ANY: "any";
    readonly STRING: "string";
    readonly NUMBER: "number";
    readonly BOOLEAN: "boolean";
    readonly ARRAY: "array";
    readonly OBJECT: "object";
};
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
export declare function dataTypeFrom(value: unknown): DataType;

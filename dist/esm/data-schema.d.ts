import { CallableValidator } from './data-validator.js';
/**
 * Data type.
 */
export declare enum DataType {
    ANY = "Any",
    STRING = "String",
    NUMBER = "Number",
    BOOLEAN = "Boolean",
    ARRAY = "Array",
    OBJECT = "Object"
}
/**
 * Data schema.
 */
export type DataSchema = {
    type: DataType;
    items?: DataSchema;
    properties?: DataSchemaProperties;
    required?: boolean;
    validate?: CallableValidator | CallableValidator[];
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
export declare function dataTypeFrom(value: unknown): Exclude<DataType, DataType.ANY> | undefined;

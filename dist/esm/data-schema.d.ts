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
    properties?: {
        [key: string]: DataSchema;
    };
    required?: boolean;
    validate?: CallableValidator | CallableValidator[];
};
/**
 * Data type from value.
 *
 * @param value
 */
export declare function dataTypeFrom(value: unknown): Exclude<DataType, DataType.ANY> | undefined;

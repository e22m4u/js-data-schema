/**
 * Data type.
 */
export var DataType;
(function (DataType) {
    DataType["ANY"] = "any";
    DataType["STRING"] = "string";
    DataType["NUMBER"] = "number";
    DataType["BOOLEAN"] = "boolean";
    DataType["ARRAY"] = "array";
    DataType["OBJECT"] = "object";
})(DataType || (DataType = {}));
/**
 * Data type from value.
 *
 * @param value
 */
export function dataTypeFrom(value) {
    if (value == null)
        return DataType.ANY;
    const baseType = typeof value;
    if (baseType === 'string')
        return DataType.STRING;
    if (baseType === 'number')
        return DataType.NUMBER;
    if (baseType === 'boolean')
        return DataType.BOOLEAN;
    if (Array.isArray(value))
        return DataType.ARRAY;
    if (baseType === 'object')
        return DataType.OBJECT;
    return DataType.ANY;
}

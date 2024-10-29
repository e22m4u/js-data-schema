/**
 * Data type.
 */
export var DataType;
(function (DataType) {
    DataType["ANY"] = "Any";
    DataType["STRING"] = "String";
    DataType["NUMBER"] = "Number";
    DataType["BOOLEAN"] = "Boolean";
    DataType["ARRAY"] = "Array";
    DataType["OBJECT"] = "Object";
})(DataType || (DataType = {}));
/**
 * Data type from value.
 *
 * @param value
 */
export function dataTypeFrom(value) {
    if (value == null)
        return undefined;
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
    return undefined;
}

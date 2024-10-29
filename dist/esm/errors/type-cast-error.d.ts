import { DataType } from '../data-schema.js';
/**
 * Type cast error.
 */
export declare class TypeCastError extends Error {
    readonly value: unknown;
    readonly targetType: DataType;
    constructor(value: unknown, targetType: DataType);
}

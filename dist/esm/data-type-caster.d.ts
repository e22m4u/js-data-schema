import { DataType } from './data-schema.js';
import { DataSchema } from './data-schema.js';
import { DebuggableService } from './debuggable-service.js';
/**
 * Callable type caster.
 */
export type CallableTypeCaster<T = unknown> = (value: unknown) => T;
/**
 * Cast options.
 *
 * @property sourcePath A path like 'body.user.name' from which the value is obtained.
 * @property noTypeCastError Return a given value instead of throwing the TypeCastError.
 */
type TypeCastOptions = {
    sourcePath?: string;
    noTypeCastError?: boolean;
};
/**
 * Data type caster.
 */
export declare class DataTypeCaster extends DebuggableService {
    /**
     * Type caster map.
     *
     * @protected
     */
    protected readonly typeCasterMap: Map<DataType, CallableTypeCaster<unknown>>;
    /**
     * Set type caster.
     *
     * @param type
     * @param caster
     */
    setTypeCaster(type: DataType, caster: CallableTypeCaster): this;
    /**
     * Get type caster.
     *
     * @param type
     */
    getTypeCaster(type: DataType): CallableTypeCaster;
    /**
     * Cast.
     *
     * @param value
     * @param schema
     * @param options
     */
    cast(value: unknown, schema: DataSchema, options?: TypeCastOptions): unknown;
}
export {};

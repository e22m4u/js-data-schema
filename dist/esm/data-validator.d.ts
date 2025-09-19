import { DataSchema } from './data-schema.js';
import { ServiceContainer } from '@e22m4u/js-service';
import { DebuggableService } from './debuggable-service.js';
/**
 * Callable validator.
 */
export type CallableValidator = (value: unknown, schema: DataSchema, sourcePath: string | undefined, container: ServiceContainer) => unknown;
/**
 * Data validator.
 */
export declare class DataValidator extends DebuggableService {
    /**
     * Validators.
     *
     * @protected
     */
    protected readonly validatorMap: Set<CallableValidator>;
    /**
     * Add validator.
     *
     * @param fn
     */
    addValidator(fn: CallableValidator): this;
    /**
     * Has validator.
     *
     * @param fn
     */
    hasValidator(fn: CallableValidator): boolean;
    /**
     * Get validators.
     */
    getValidators(): CallableValidator[];
    /**
     * Remove validator.
     *
     * @param fn
     */
    removeValidator(fn: CallableValidator): this;
    /**
     * Remove all validators.
     */
    removeAllValidators(): this;
    /**
     * Invoke validator.
     *
     * @param validator
     * @param value
     * @param schema
     * @param sourcePath
     * @param container
     */
    protected invokeValidator(validator: CallableValidator, value: unknown, schema: DataSchema, sourcePath: string | undefined, container: ServiceContainer): void;
    /**
     * Validate.
     *
     * @param value
     * @param schema
     * @param sourcePath A path like 'body.user.name' from which the value.
     */
    validate(value: unknown, schema: DataSchema, sourcePath?: string): void;
}

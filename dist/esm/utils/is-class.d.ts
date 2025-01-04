import { Constructor } from '../types.js';
/**
 * Is class.
 *
 * @param value
 */
export declare function isClass<T extends object>(value: unknown): value is Constructor<T>;

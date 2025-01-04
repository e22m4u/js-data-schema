/**
 * Callable type with the "new" operator
 * that allows class and constructor types.
 */
export interface Constructor<T = unknown> {
    new (...args: any[]): T;
}
/**
 * Plain object.
 */
export type PlainObject = {
    [key: string]: unknown;
};
/**
 * A part of the Flatten type.
 */
export type Identity<T> = T;
/**
 * Makes T more human-readable.
 */
export type Flatten<T> = Identity<{
    [k in keyof T]: T[k];
}>;
/**
 * Object prototype that excludes
 * function and scalar values.
 */
export type Prototype<T = unknown> = T & object & {
    bind?: never;
} & {
    call?: never;
} & {
    prototype?: object;
};
/**
 * Function type.
 */
export type Callable<T = unknown> = (...args: any[]) => T;
/**
 * Class to plain.
 */
export type ClassToPlain<T> = {
    [K in keyof T]: T[K] extends Function ? never : T[K];
} & {};

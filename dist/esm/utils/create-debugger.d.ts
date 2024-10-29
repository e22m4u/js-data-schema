import { format } from '@e22m4u/js-format';
/**
 * Debugger.
 */
export type Debugger = (...args: Parameters<typeof format>) => void;
/**
 * Create debugger.
 *
 * @param name
 */
export declare function createDebugger(name: string): Debugger;

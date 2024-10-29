import DebugFactory from 'debug';
import {format} from '@e22m4u/js-format';

/**
 * Debugger.
 */
export type Debugger = (...args: Parameters<typeof format>) => void;

/**
 * Create debugger.
 *
 * @param name
 */
export function createDebugger(name: string): Debugger {
  const debug = DebugFactory(`tsDataSchema:${name}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (message: string, ...args: any[]) {
    const interpolatedMessage = format(message, ...args);
    return debug(interpolatedMessage);
  };
}

import DebugFactory from 'debug';
import { format } from '@e22m4u/js-format';
/**
 * Create debugger.
 *
 * @param name
 */
export function createDebugger(name) {
    const debug = DebugFactory(`tsDataSchema:${name}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (message, ...args) {
        const interpolatedMessage = format(message, ...args);
        return debug(interpolatedMessage);
    };
}

import { Debugger } from './utils/index.js';
import { Service } from '@e22m4u/js-service';
import { ServiceContainer } from '@e22m4u/js-service';
/**
 * Service.
 */
export declare class DebuggableService extends Service {
    /**
     * Debug.
     */
    debug: Debugger;
    /**
     * Constructor.
     *
     * @param container
     */
    constructor(container?: ServiceContainer);
}

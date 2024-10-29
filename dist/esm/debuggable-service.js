import { Service } from '@e22m4u/js-service';
import { toCamelCase } from './utils/index.js';
import { createDebugger } from './utils/index.js';
/**
 * Service.
 */
export class DebuggableService extends Service {
    /**
     * Debug.
     */
    debug;
    /**
     * Constructor.
     *
     * @param container
     */
    constructor(container) {
        super(container);
        const serviceName = toCamelCase(this.constructor.name);
        this.debug = createDebugger(serviceName);
        this.debug('%v is created.', this.constructor);
    }
}

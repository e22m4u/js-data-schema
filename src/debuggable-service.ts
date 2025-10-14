import {ServiceContainer} from '@e22m4u/js-service';
import {DebuggableService as BaseDebuggableService} from '@e22m4u/js-service';

/**
 * Service.
 */
export class DebuggableService extends BaseDebuggableService {
  /**
   * Constructor.
   *
   * @param container
   */
  constructor(container?: ServiceContainer) {
    super(container, {namespace: 'jsDataSchema', noEnvironmentNamespace: true});
  }
}

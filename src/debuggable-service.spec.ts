import {expect} from 'chai';
import {DebuggableService} from './debuggable-service.js';
import {DebuggableService as BaseDebuggableService} from '@e22m4u/js-service';

describe('DebuggableService', function () {
  it('has the debug method', function () {
    const res = new DebuggableService();
    expect(typeof res.debug).to.be.eq('function');
  });

  describe('constructor', function () {
    it('extends the DebuggableService class', function () {
      const res = new DebuggableService();
      expect(res).to.be.instanceof(BaseDebuggableService);
    });
  });
});

import { expect } from 'chai';
import { normalizeName } from '../lib/theme';

describe('Theme', () => {
  describe('#normalizeName', () => {
    it('should do nothing when the full name is received', () => {
      expect(normalizeName('doca-test-theme')).to.be.a('string');
      expect(normalizeName('doca-test-theme')).to.equal('doca-test-theme');
    });
    it('should do convert name into doca-XXXX-theme pattern', () => {
      expect(normalizeName('test')).to.be.a('string');
      expect(normalizeName('test')).to.equal('doca-test-theme');
    });
  });
});

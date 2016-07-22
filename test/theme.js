var expect = require('chai').expect;
var normalizeName = require('../lib/theme').normalizeName;

describe('Theme', function () {
  describe('#normalizeName', function () {
    it('should do nothing when the full name is received', function () {
      expect(normalizeName('doca-test-theme')).to.be.a('string');
      expect(normalizeName('doca-test-theme')).to.equal('doca-test-theme');
    });
    it('should do convert name into doca-XXXX-theme pattern', function () {
      expect(normalizeName('test')).to.be.a('string');
      expect(normalizeName('test')).to.equal('doca-test-theme');
    });
  });
});

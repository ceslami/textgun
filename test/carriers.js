var _ = require('underscore'),
    assert = require('assert'),
    carriers = require('../lib/carriers');

describe('carriers', function() {

    describe('#getAllDomains', function() {

        it('all entries should contain @name and @domain properties', function() {
            var allDomains = carriers.getAllDomains();
            _.each(allDomains, function(el) {
                assert(el.name !== null);
                assert(el.domain !== null);
            });
        });
    });

    describe('#isValidDomain', function() {

        it('should return false when the domain is unknown', function() {
            var isValid = carriers.isValidDomain('SillyCarrier');
            assert(!isValid);
        });

        it('should return true for a known domain', function() {
            var isValid = carriers.isValidDomain('messaging.sprintpcs.com');
            assert(isValid);
        });
    });
});
var _ = require('underscore'),
    assert = require('assert'),
    carriers = require('../lib/carriers.js');

describe('textmail', function() {

    describe('#getAll', function() {
        it('should have a key for American carriers', function() {
            var allCarriers = carriers.getAll();
            assert(allCarriers.america instanceof Array);
        });

        describe('American carriers', function() {
            it('should have a @name and @domain property', function() {
                var americanCarriers = carriers.getAll().america;
                _.each(americanCarriers, function(el) {
                    assert(el.name !== null);
                    assert(el.domain !== null);
                });
            });
        });
    });

    describe('#getAllDomains', function() {
        it('should be a non-empty array', function() {
            assert(carriers.getAllDomains().length);
        });
    });

    describe('#getDomainByCarrier', function() {
        it('should return a result for Sprint', function() {
            var domain = carriers.getDomainByCarrier('Sprint');
            assert(domain === 'messaging.sprintpcs.com');
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
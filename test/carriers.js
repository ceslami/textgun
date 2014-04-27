var _ = require('underscore'),
    assert = require("assert"),
    carriers = require("../lib/carriers.js");

describe('textmail', function() {

    describe('#getAll', function() {
        it('should have a key for American carriers', function() {
            var allCarriers = carriers.getAll();
            assert(allCarriers.america instanceof Array);
        });

        describe('American carriers', function() {
            it('should have a @name and @domain property', function() {
                var americanCarriers = carriers.getAll().america;
                _.each(americanCarriers, function(el, i) {
                    assert(el.name != null);
                    assert(el.domain != null);
                });
            });
        });
    });
});
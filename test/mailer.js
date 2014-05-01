var assert = require('assert'),
    textmail = require('../lib/api.js');

describe('textmail', function() {
    describe('@transport', function() {
        it('should have a transport protocol configured', function() {
            var text = textmail({
                username: 'admin@example.com',
                password: 'password'
            });
            assert.notEqual(text, null);
        });
    });
});
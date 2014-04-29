var assert = require('assert'),
    textmail = require('../lib/mailer.js');

describe('textmail', function() {

    describe('@isClosed', function() {
        it('should be open immediately after being intialized', function() {
            var text = textmail();
            assert.equal(text.isClosed, false);
        });
    });

    describe('@transport', function() {
        it('should have a transport protocol configured', function() {
            var text = textmail({
                from: {
                    user: 'admin@example.com',
                    pass: 'password'
                }
            });
            assert.notEqual(text.transport, null);
        });
    });
});
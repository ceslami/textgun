var assert = require('assert'),
    textmail = require('../lib/api.js');

describe('textmail', function() {
    describe('', function() {
        it('should have a transport protocol configured', function() {
            var api = textmail({
                username: 'admin@example.com',
                password: 'password'
            });
            assert.notEqual(api, null);
        });
    });

    describe('SMTP sender configuration', function() {
        it('throws an error if no config is passed', function() {
            try {
                textmail();
            } catch(e) {
                assert(e.message === 'Your configuration must ' +
                    'contain an object with `to` and `text` fields.');
            }
        });

        it('throws an error if empty config object is passed', function() {
            try {
                textmail({});
            } catch(e) {
                assert(e.message === 'Your configuration must ' +
                    'contain an object with `to` and `text` fields.');
            }
        });

        it('throws an error if there is no username field', function() {
            try {
                textmail({
                    password: '***'
                });
            } catch(e) {
                assert(e.message === 'SMTP sender options do not include a ' +
                    'username. Typically this is your email address.');
            }
        });
    });
});
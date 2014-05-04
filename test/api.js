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

        it('throws if empty config object is passed', function() {
            try {
                textmail({});
            } catch(e) {
                assert(e.message === 'Your configuration must ' +
                    'contain an object with `to` and `text` fields.');
            }
        });

        it('throws if there is no username field', function() {
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

    describe('Message sending options', function() {
        it('throws when phone number is not 10 digits', function() {
            try {
                textmail({
                    username: 'example',
                    password: '***'
                }).send({
                    to: '2031',
                    text: 'hi',
                    carrierDomain: 'txt.att.net'
                });
            } catch(e) {
                assert(e.message === 'Phone number must be a purely numberic ' +
                '10 character string without letters or special characters.');
            }
        });

        it('throws if the phone number isnt purely alphanumeric', function() {
            try {
                textmail({
                    username: 'example',
                    password: '***'
                }).send({
                    to: '20asd31asd',
                    text: 'hi',
                    carrierDomain: 'txt.att.net'
                });
            } catch(e) {
                assert(e.message === 'Phone number must be a purely numberic ' +
                '10 character string without letters or special characters.');
            }
        });

        it('succeeds if phone number is 10 digits and numeric', function() {
            try {
                textmail({
                    username: 'example',
                    password: '***'
                }).send({
                    to: '1234567890',
                    text: 'hi',
                    carrierDomain: 'txt.att.net'
                });
            } catch(e) {
                assert(false);
            }

            assert(true);
        });
    });
});
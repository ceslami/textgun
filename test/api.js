var assert = require('assert'),
    textgun = require('../lib/api.js');

describe('textgun', function() {

    describe('SMTP sender configuration', function() {

        it('throws an error if no config is passed', function() {
            try {
                textgun();
            } catch(e) {
                assert(e.message === 'Your configuration must ' +
                    'contain an object with `to` and `text` fields.');
            }
        });

        it('throws if empty config object is passed', function() {
            try {
                textgun({});
            } catch(e) {
                assert(e.message === 'Your configuration must ' +
                    'contain an object with `to` and `text` fields.');
            }
        });

        it('throws if there is no email field', function() {
            try {
                textgun({
                    password: 'password'
                });
            } catch(e) {
                assert(e.message === 'SMTP sender options do not include a ' +
                    'email address and a password.');
            }
        });

        it('throws if there is no password field', function() {
            try {
                textgun({
                    email: 'admin@example.com'
                });
            } catch(e) {
                assert(e.message === 'SMTP sender options do not include a ' +
                    'email address and a password.');
            }
        });

        it('does not throw if a email and password are provided', function() {
            try {
                textgun({
                    email: 'admin@example.com',
                    password: 'password'
                });
            } catch(e) {
                assert(false);
            }

            assert(true);
        });
    });

    describe('Message sending options', function() {
        var creds = {
            email: 'example',
            password: '***'
        };

        it('throws when phone number is not 10 digits', function(done) {
            textgun(creds).send({
                to: '2031',
                text: 'hi'
            }).then(function() {
                assert(false);
                done();
            }).fail(function(error) {
                assert(error === 'Phone number must be a purely numeric ' +
                    '10 character string without letters or special characters.');
                done();
            });
        });

        it('throws if the phone number isnt purely alphanumeric', function(done) {
            textgun({
                email: 'example',
                password: '***'
            }).send({
                to: '20asd31asd',
                text: 'hi'
            }).then(function() {
                assert(false);
                done();
            }).fail(function(error) {
                assert(error === 'Phone number must be a purely numeric ' +
                    '10 character string without letters or special characters.');
                done();
            });
        });

        it('fails if there is no phone number', function(done) {
            textgun(creds).send({
                text: 'hi'
            }).then(function() {
                assert(false);
                done();
            }).fail(function(error) {
                assert(error === 'You must provide a recipient phone number (`to`) and a message (`text`): {"text":"hi"}');
                done();
            });
        });

        it('fails if there is no message', function(done) {
            textgun(creds).send({
                to: '1234567890'
            }).then(function() {
                assert(false);
                done();
            }).fail(function(error) {
                assert(error === 'You must provide a recipient phone number (`to`) and a message (`text`): {"to":"1234567890"}');
                done();
            });
        });

        it('fails if the SMTP authentication credentials are bad', function(done) {
            textgun(creds).send({
                to: '2032175191',
                text: 'hi'
            }).then(function() {
                assert(false);
                done();
            }).fail(function(error) {
                assert(error === 'Connection refused. Make sure your SMTP credentials are valid.');
                done();
            });
        });
    });
});
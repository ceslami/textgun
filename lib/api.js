var _ = require('underscore'),
    nodemailer = require('nodemailer'),
    carriers = require('./carriers');

module.exports = function(config) {

    if (!_.isObject(config) || _.isEmpty(config)) {
        throw new Error('Your configuration must contain an ' +
            'object with `to` and `text` fields.');
    }

    if (config.username === undefined || config.password === undefined) {
        throw new Error('SMTP sender options do not include a ' +
            'username. Typically this is your email address.');
    }

    this.send = function(options) {
        validateSendOptions(options);

        _.each(carriers.getAllDomains(), function(carrierDomain) {
            options.to += '@' + carrierDomain;
            sendToDomain(options);
        });
    };

    function validateSendOptions(options) {
        var isValidDomain = carriers.isValidDomain(options.carrierDomain);

        if (options.to.length !== 10 || _.isNaN(options.to)) {
            throw new Error('Phone number must be a purely numberic ' +
                '10 character string without letters or special characters.');
        } else if (!options.to || !options.text) {
            throw new Error('You must provide a recipient phone number ' +
                '(`to`) and a message (`text`): ' + JSON.stringify(options));
        } else if (!options.carrierDomain && options.to.indexOf('@') !== -1) {
            throw new Error('Your sender `to` parameter contains an illegal ' +
                'character. Please validate that it is a 10 digit US ' +
                'phone number.');
        } else if (options.carrierDomain && !isValidDomain) {
            throw new Error('Your carrier domain is not supported.');
        }
    }

    function sendToDomain(options) {
        var transport = nodemailer.createTransport('SMTP', {
            auth: {
                user: config.username,
                pass: config.password
            }
        });

        transport.sendMail(_.defaults(options, {
            from: config.username
        }), function(error, response) {
            console.log(error || response);
            transport.close();
        });
    }

    return this;
};
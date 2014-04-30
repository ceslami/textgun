var _ = require('underscore'),
    nodemailer = require('nodemailer'),
    carriers = require('./carriers');

module.exports = function(config) {

    this.transport = null;

    if (!_.isObject(config) || _.isEmpty(config)) {
        throw new Error('Your configuration must contain an ' +
            'object with `to` and `text` fields.');
    }

    if (config.username === undefined || config.password === undefined) {
        throw new Error('SMTP sender options do not include a ' +
            'username. Typically this is your email address.');
    }

    this.send = function(options) {
        this.validateSendOptions(options);

        if (!options.carrierDomain) {
            this.sendAll(_.pick(options, 'from', 'to', 'text'));
        } else {
            options.to = options.to + '@' + options.carrierDomain;
            this.sendToDomain(_.pick(options, 'from', 'to', 'text'));
        }
    };

    this.open = function() {
        this.transport = nodemailer.createTransport('SMTP', {
            auth: {
                user: config.username,
                pass: config.password
            }
        });
    };

    this.validateSendOptions = function(options) {
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
    };

    this.sendAll = function(options) {
        var domains = carriers.getAllDomains(),
            recipient = options.to;

        _.each(domains, function(carrierDomain) {
            options.to = recipient + '@' + carrierDomain;
            this.sendToDomain(options);
        }.bind(this));
    };

    this.sendToDomain = function(options) {
        options.from = options.from || config.username;
        this.transport.sendMail(options, function(error, response) {
            console.log(error || response);
            this.transport.close();
        }.bind(this));
    };

    // Open the transport protocol by default on instantiation
    this.open();

    return this;
};
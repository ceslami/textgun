var _ = require('underscore'),
    nodemailer = require("nodemailer"),
    carriers = require("./carriers");

module.exports = function(config) {

    config = config || {};
    this.transport = null;
    this.isClosed = false;

    this.open = function() {
        if (config.from !== undefined) {
            if (config.from.user === undefined) {
                throw new Error('SMTP sender options do not include a username. ' +
                    'Typically this is your email address.');
            } else if (config.from.pass === undefined) {
                throw new Error('SMTP send options do not include a password. ' +
                    'Typically this is your email account password.');
            }

            this.transport = nodemailer.createTransport('SMTP', {
                auth: {
                    user: config.from.user,
                    pass: config.from.pass
                }
            });
        } else if (config.sendmail !== undefined) {
            var pathToSendmail = config.sendmail.path || '/usr/sbin/sendmail',
                returnEmail = config.sendmail.returnEmail || 'admin@example.org';

            this.transport = nodemailer.createTransport("sendmail", {
                path: pathToSendmail,
                args: ["-t", "-f", returnEmail]
            });
        } else {
            /**
             * We use the direct transport technique because it is easy to
             * detect sending errors. The ability to detect these errors is necessary
             * determine if the phone number and carrier domain combination
             * is valid.
             */
            this.transport = nodemailer.createTransport();
        }
    };

    this.close = function() {
        if (this.transport) {
            this.transport.close();
        }

        this.isClosed = true;
    };

    this.send = function(options) {
        this.validateSendOptions(options);

        if (this.isClosed) {
            this.open();
        }

        if (!options.carrierDomain) {
            this.sendAll(_.pick(options, 'from', 'to', 'text'));
        } else {
            options.to = options.to + "@" + options.carrierDomain;
            this.sendToDomain(_.pick(mailOptions, 'from', 'to', 'text'));
        }
    };

    this.validateSendOptions = function(options) {
        if (!options.to || !options.text) {
            throw new Error('You must provide a recipient phone number and ' +
                'a message: ' + JSON.stringify(options));
        } else if (!options.carrierDomain && options.to.indexOf('@') !== -1) {
            throw new Error('Your sender `to` parameter contains an illegal ' +
                'character. Please validate that it is a 10 digit phone number.');
        } else if (options.carrierDomain && carriers.isValidDomain(options.carrierDomain)) {
            throw new Error("Your carrier domain is not supported.");
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
        options.from = options.from || config.from.user || "Admin <admin@example.org>";
        this.transport.sendMail(options, function(error, response) {
            if (error) {
                console.log(error);
            }

            this.close();
        }.bind(this));
    };

    // Open the transport protocol by default on instantiation
    this.open();

    return this;
};
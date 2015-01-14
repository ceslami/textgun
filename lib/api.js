var _ = require('underscore'),
    nodemailer = require('nodemailer'),
    carriers = require('./carriers'),
    Q = require('q');

var isNumber = /^\d+$/;

module.exports = function(config) {

    if (!_.isObject(config) || _.isEmpty(config)) {
        throw new Error('Your configuration must contain an object with `to` and `text` fields.');
    }

    if (!config.email || !config.password) {
        throw new Error('SMTP sender options do not include a email address and a password.');
    }

    this.send = function(options) {
        var def = Q.defer(),
            sent = [];

        var validation = validateMessage(options);

        if (!validation) {
            _.each(carriers.getAllDomains(), function(carrierDomain) {
                var message = sendToDomain(_.extend({}, options, {
                    to: options.to + '@' + carrierDomain
                }));

                sent.push(message);
            });

            Q.allSettled(sent).then(function(results) {
                var allRefused = _.every(results, function(el) {
                    return el.reason.code === 'ECONNREFUSED';
                });

                if (allRefused) {
                    def.reject('Connection refused. Make sure your SMTP credentials are valid.');
                    return;
                }

                def.resolve();
            });
        } else {
            def.reject(validation);
        }

        return def.promise;
    };

    function validateMessage(options) {
        var isValidDomain = carriers.isValidDomain(options.carrierDomain);

        if (!options.to || !options.text) {
            return 'You must provide a recipient phone number ' +
                '(`to`) and a message (`text`): ' + JSON.stringify(options);
        } else if (options.to.length !== 10 || !isNumber.test(options.to)) {
            return 'Phone number must be a purely numeric ' +
                '10 character string without letters or special characters.';
        }

        return false;
    }

    function sendToDomain(options) {
        var def = Q.defer(),
            transport = nodemailer.createTransport('SMTP', {
                auth: {
                    user: config.email,
                    pass: config.password
                }
            });

        transport.sendMail(_.extend({}, options, {
            from: config.email || options.from
        }), function(error, response) {
            transport.close();

            if (error) {
                def.reject(error);
            } else {
                def.resolve(response);
            }
        });

        return def.promise;
    }

    return this;
};
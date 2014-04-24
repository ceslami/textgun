var nodemailer = require("nodemailer");

exports.textmail = function(options) {

    this.transport = null;
    this.isClosed = false;

    this.open = function() {
        if (options.from !== undefined) {
            if (options.from.user === undefined) {
                throw new Error('SMTP sender options do not include a username. ' +
                    'Typically this is your email address.');
            } else if (options.from.pass === undefined) {
                throw new Error('SMTP send options do not include a password. ' +
                    'Typically this is your email account password.');
            }

            this.transport = nodemailer.createTransport('SMTP', {
                auth: {
                    user: options.from.user,
                    pass: options.from.pass
                }
            });
        } else if (options.sendmail !== undefined) {
            var pathToSendmail = options.sendmail.path || '/usr/sbin/sendmail',
                returnEmail = options.sendmail.returnEmail || 'admin@example.org';

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
            // this.transport = nodemailer.createTransport();
            this.transport = nodemailer.createTransport();
        }
    }

    this.close = function() {
        if (!this.transport) {
            throw new Error('A transport protocol is not currently configured.');
        }

        this.transport.close();
        this.isClosed = true;
    };

    this.send = function(options) {

        if (!options.recipient || !options.message || !options.carrierDomain) {
            throw new Error('You must provide a recipient phone number, a message, ' +
                'and a carrier domain.');
        }

        if (this.isClosed) {
            this.open();
        }

        var options = {
            from: "Admin <admin@example.org>",
            to: options.recipient + "@" + options.carrierDomain,
            text: options.message
        };

        this.transport.sendMail(options, function(error, response) {
            if (error) {
                console.log(error);
                return;
            }

            if (response.messageId) {
                console.log("Message sent with id: " + response.messageId);
            } else {
                console.log("Message send, but no messageId was provided");
            }
        });
    };

    // Open the transport protocol by default on instantiation
    this.open();

    return this;
};
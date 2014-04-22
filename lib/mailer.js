var nodemailer = require("nodemailer");

exports.textmail = function(options) {

    var transport;

    if (options.from !== undefined) {
        if (options.from.user === undefined) {
            throw new Error('SMTP sender options do not include a username. ' +
                'Typically this is your email address.');
        } else if (options.from.pass === undefined) {
            throw new Error('SMTP send options do not include a password. ' +
                'Typically this is your email account password.');
        }

        transport = nodemailer.createTransport('SMTP', {
            auth: {
                user: options.from.user,
                pass: options.from.pass
            }
        });
    } else if (options.sendmail !== undefined) {
        var pathToSendmail = options.sendmail.path || '/usr/sbin/sendmail',
            returnEmail = options.sendmail.returnEmail || 'admin@example.org';

        transport = nodemailer.createTransport("sendmail", {
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
        transport = nodemailer.createTransport("direct", {
            debug: true
        });
    }

    this.send = function(recipient, message) {
        var options = {
            from: "Admin <admin@example.org>",
            to: recipient + "@txt.att.net",
            text: message
        };

        transport.sendMail(options, function(error, response) {
            if (error) {
                console.log(error);
                return;
            }

            if (response.messageId) {
                console.log("Message sent with id: " + response.messageId);
            } else {
                console.log("Message send, but no messageId was provided");
            }

            transport.close();
        });
    };

    return this;
};
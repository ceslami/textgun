var nodemailer = require("nodemailer");

exports.send = function(recipient, message) {
    /**
     * We use the direct transport technique because it is easy to
     * detect sending errors. The ability to detect these errors is necessary
     * determine if the phone number and carrier domain combination
     * is valid.
     */
    var transport = nodemailer.createTransport("direct", { debug: false });

    var options = {
        from: "Cyrus Eslami <ceslami@gmail.com>",
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
}
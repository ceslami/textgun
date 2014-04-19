var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport("sendmail", {
    path: "/usr/sbin/sendmail",
    args: ["-t", "-f", "ceslami@gmail.com"]
});

var mailOptions = {
    from: "Cyrus Eslami <ceslami@gmail.com>", // sender address
    to: "2032175191@txt.att.net", // list of receivers
    subject: "Alert", // Subject line
    text: "1"
}

transport.sendMail(mailOptions, function(error, response) {
    console.log(response);
    if (error) {
        console.log(error);
    }

    if (response.messageId) {
        console.log("Message sent with id: " + response.messageId);
    } else {
        console.log("Message send, but no messageId was provided");
    }

    transport.close();
});
var mailer = require('./mailer');

exports.send = function(number, message) {
    mailer.send(number, message);
};
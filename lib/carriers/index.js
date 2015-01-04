var _ = require('underscore'),
    americanCarriers = require('./america.js').carriers;

exports.getAllDomains = function() {
    return _.reduce(americanCarriers, function(memo, el) {
        memo.push(el.domain);
        return memo;
    }, []);
};

exports.isValidDomain = function(domain) {
    var allDomains = exports.getAllDomains();
    return _.contains(allDomains, domain);
};
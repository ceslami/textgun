var _ = require('underscore'),
    americanCarriers = require("./carriers/america.js");

exports.getCarriers = function() {
    return {
        america: americanCarriers
    };
};

exports.getAllDomains = function() {
    return _.reduce(americanCarriers, function(memo, el) {
        memo.push(el.domain);
        return memo;
    }, []);
};

exports.getDomainByCarrier = function(carrierName) {
    return _.findWhere(americanCarriers, {
        name: carrierName
    });
};

exports.isValidDomain = function(domain) {
    return _.any(exports.getCarriers(), function(carrier) {
        return carrier.domain === domain;
    });
};
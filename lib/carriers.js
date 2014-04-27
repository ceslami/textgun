var _ = require('underscore'),
    americanCarriers = require("./carriers/america.js").carriers;

exports.getAll = function() {
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
    }).domain;
};

exports.isValidDomain = function(domain) {
    return _.any(exports.getAllDomains(), function(el) {
        return el === domain;
    });
};
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
    }, []);
};

exports.getDomainByCarrier = function(carrierName) {
    return _.findWhere(americanCarriers, {
        name: carrierName
    });
};
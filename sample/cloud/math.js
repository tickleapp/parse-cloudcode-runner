/*jshint node: true */
'use strict';

module.exports.add = function(a, b) {
    return a+b;
};

module.exports.name = require('cloud/utils.js').name;

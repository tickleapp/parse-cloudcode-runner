/*jshint node: true */
/*globals require: true, Parse: false */
'use strict';

if (typeof Parse === 'undefined') {
    /* Replace to
     * ```
     * var parseCloudCodeRunner = require('parse-cloudcode-runner');
     * ```
     * while using in your real code.
     */
    require = require('./../../index').require;
}

module.exports.add = function(a, b) {
    return a+b;
};

module.exports.name = require('cloud/utils.js').name;

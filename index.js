'use strict';

var Parse_ParseCloud = require('parse-cloud').Parse;
var Parse = require('parse/node');
module.exports.Parse = Parse;

// Borrow Parse.Cloud.httpRequest from parse-cloud
Parse.Cloud.httpRequest = Parse_ParseCloud.Cloud.httpRequest;

// Function registration
Parse.Cloud._registeredFunctions = {};
Parse.Cloud.define = function(name, functionBody) {
    this._registeredFunctions[name] = functionBody;
};

// Runner
Parse.Cloud.debugRun = function(name, params) {
    var cloud_function = this._registeredFunctions[name];
    if (typeof cloud_function === 'undefined') {
        throw 'Cannot find cloud function named "' + name + '".';
    }
    var request = new Parse.Cloud.FunctionRequest(params);
    var response = new Parse.Cloud.FunctionResponse();
    cloud_function(request, response);
    return response.promise;
};

// Classes Patches
Parse.Cloud.FunctionRequest = function(params) {
    params = params || {};
    this.installationId = '';
    this.master = false;
    this.params = params;
    this.user = null;
    this.body = JSON.stringify(params);
};
Parse.Cloud.FunctionResponse = function() {
    this.promise = new Parse.Promise();
    this.error = function(message) {
        this.promise.reject({code: 141, error: message});
    };
    this.success = function(response) {
        this.promise.resolve({result: response});
    };
};

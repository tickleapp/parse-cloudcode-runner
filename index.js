'use strict';

var Parse_ParseCloud = require('parse-cloud').Parse;
var Parse = require('parse/node');
var Path = require('path');
var _ = require('lodash');
module.exports.Parse = Parse;

// Patch `require` for CloudCode
Parse._requireBasePath = undefined;
Parse.setRequireBasePath = function(requireBasePath) {
    this._requireBasePath = requireBasePath;
};
module.exports.require = function(id) {
    if (_.startsWith(id, 'cloud/')) {
        id = Path.join(Parse._requireBasePath, id);
    }
    return require(id);
};

// Borrow Parse.Cloud.httpRequest from parse-cloud
Parse.Cloud.httpRequest = Parse_ParseCloud.Cloud.httpRequest;

// Function registration
Parse.Cloud._registeredFunctions = {};
Parse.Cloud.define = function(name, functionBody) {
    this._registeredFunctions[name] = functionBody;
};

// Job registration
Parse.Cloud._registeredJobs = {};
Parse.Cloud.job = function(name, functionBody) {
    this._registeredJobs[name] = functionBody;
};

// Runner
Parse.Cloud.debugRun = function(name, params, functionType) {
    functionType = functionType || 'function';

    // Find function pool
    var functionPool = undefined;
    var functionArguments = undefined;
    var promise = undefined;
    if (functionType === 'function') {
        functionPool = this._registeredFunctions;
        var response = new Parse.Cloud.FunctionResponse();
        functionArguments = [new Parse.Cloud.FunctionRequest(params), response];
        promise = response.promise;
    } else if (functionType === 'job') {
        functionPool = this._registeredJobs;
        var status = new Parse.Cloud.JobStatus();
        functionArguments = [new Parse.Cloud.JobRequest(params), status];
        promise = status.promise;
    } else {
        throw 'Unknown function type: ' + functionType;
    }

    // Get function
    var functionBody = functionPool[name];
    if (typeof functionBody === 'undefined') {
        throw 'Cannot find ' + functionType + ' named "' + name + '".';
    }

    // Go!
    functionBody.apply(_.assign({Parse: Parse}, global), functionArguments);
    return promise;
};

// Classes Patches
Parse.Cloud.FunctionRequest = function(params) {
    this.installationId = '';
    this.master = false;
    this.params = params || {};
    this.user = null;
    this.body = JSON.stringify(this.params);
};
Parse.Cloud.FunctionResponse = function() {
    this.promise = new Parse.Promise();
    this.error = function(message) {
        this.promise.reject({code: Parse.Error.SCRIPT_FAILED, error: message});
    };
    this.success = function(response) {
        this.promise.resolve({result: response});
    };
};
Parse.Cloud.JobRequest = function(params) {
    this.params = params || {};
    this.installationId = '';
    this.master = false;
    this.user = null;
    this.body = JSON.stringify(this.params);
};
Parse.Cloud.JobStatus = function() {
    this.promise = new Parse.Promise();
    this.error = function(message) {
        this.message(message);
        this.promise.reject(this._message);
    };
    this.success = function(message) {
        this.message(message);
        this.promise.resolve(this._message);
    };
    this._message = '';
    this.message = function(message) {
        this._message = message;
    };
};

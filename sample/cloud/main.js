/*jshint node: true*/
/*globals Parse: true */

'use strict';

if (typeof Parse === 'undefined') {
    /* Replace to
     * ```
     * var parseCloudCodeRunner = require('parse-cloudcode-runner');
     * ```
     * while using in your real code.
     */
    var parseCloudCodeRunner = require('./../../index');
    /*globals require: true */
    require = parseCloudCodeRunner.require;
    var Parse = parseCloudCodeRunner.Parse;

    require('dotenv').load({silent: true});
    Parse.initialize(process.env.PARSE_APPLICATION_ID, process.env.PARSE_JAVASCRIPT_KEY);
}

var _ = require('underscore');
var math = require('cloud/math.js');

Parse.Cloud.job('worker', function(request, status) {
    status.success('xd');
});

Parse.Cloud.define('math', function(request, response) {
    response.success(math.add((request.params.a || 1), (request.params.b || 1)));
});

Parse.Cloud.define('hello', function(request, response) {
  response.success(request.params);
});

Parse.Cloud.define('this', function(request, response) {
  response.success(this);
});

Parse.Cloud.define('httpbin', function(request, response) {
    Parse.Cloud.httpRequest({
        url: 'https://httpbin.org/ip'
    }).then(function(httpResponse) {
        response.success(httpResponse.data);
    }, function(httpResponse) {
        response.success(httpResponse.status);
    });
});

Parse.Cloud.define('error', function(request, response) {
    response.error('gg');
});

Parse.Cloud.define('city', function(request, response) {
    var city_name = request.params.country || 'Japan';
    var query = new Parse.Query('City');
    query.equalTo('country', city_name).find({
        success: function(cities) {
            response.success(_.map(cities, function(city) { return city.get('name'); }));
        }, error: function(error) {
            response.error(error.message);
        }
    });
});

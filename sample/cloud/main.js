/*jshint node: true*/
/*globals Parse: true */

'use strict';

// NOTE: you have to install 'underscore' by yourself.
var _ = require('underscore');

if (typeof Parse === 'undefined') {
    /* Replace to
     * ```
     * var Parse = require('parse-cloudcode-runner').Parse;
     * ```
     * while using in your real code.
     */
    var Parse = require('./../../index').Parse;
    require('dotenv').load({silent: true});
    Parse.initialize(process.env.PARSE_APPLICATION_ID, process.env.PARSE_JAVASCRIPT_KEY);
}

Parse.Cloud.define('hello', function(request, response) {
  response.success(request.params);
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

/*jshint node: true*/
/*globals Parse: true */

'use strict';

var _ = require('underscore');
var math = require('cloud/math.js');

/*
 * Setup Parse credentials if necessary.
 *
 * If you put them in ENVIRONMENT directly, the runner would fetch it automatically.
 * Keys of ENVIROMENT would be:
 *   - PARSE_APPLICATION_ID
 *   - PARSE_JAVASCRIPT_KEY
 *   - PARSE_MASTER_KEY (optional)
 *
 * Or you could just setup it by following lines:
 */
// if (!Parse.applicationId || !Parse.javaScriptKey) {
//     Parse.initialize('YOUR_PARSE_APPLICATION_ID', 'YOUR_PARSE_JAVASCRIPT_KEY');
// }

Parse.Cloud.job('worker', function(request, status) {
    status.success('xd');
});

Parse.Cloud.define('name', function(request, response) {
    response.success(math.name);
});

Parse.Cloud.define('math', function(request, response) {
    console.log('get ' + request.body);
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

#!/usr/bin/env node
'use strict';

var argv = require('yargs')
    .usage('Usage: $0 [<parse cloud path>] <function name> [<json parameters>] [--json-stringify]')
    .demand(1)
    .boolean('s')
    .alias('s', 'json-stringify')
    .describe('s', 'Print result in JSON representation')
    .help('h')
    .alias('h', 'help')
    .argv;
var Path = require('path');
var Parse = require('./index').Parse;

if (argv._.length === 1) {
    var parse_folder = process.cwd();
    var function_name = argv._[0];
    var params = undefined;
} else if (argv._.length === 2) {
    var parse_folder = argv._[0];
    var function_name = argv._[1];
    var params = undefined;
} else if (argv._.length === 3) {
    var parse_folder = argv._[0];
    var function_name = argv._[1];
    try {
        var params = JSON.parse(argv._[2]);
    } catch (err) {
        console.error('Cannot parse JSON parameters. Got:\n' + argv._[2]);
        console.error(err);
        process.exit(1);
    }
} else {
    console.error('Too many arguments');
    process.exit(1);
}

// Register
var parse_cloud_main_path = Path.join(parse_folder, 'cloud/main.js');
var require_parse_cloud_main_path = './' + Path.relative(__dirname, parse_cloud_main_path);
try {
    require(require_parse_cloud_main_path);
} catch (err) {
    console.error('Cannot load cloud functions from "' + parse_folder + '".');
    console.error(err);
    process.exit(1);
}

// Run
try {
    Parse.Cloud.debugRun(function_name, params).then(function(response) {
        console.log(argv.jsonStringify ? JSON.stringify(response) : response);
    }, function(error) {
        console.error(argv.jsonStringify ? JSON.stringify(error) : error);
    });
} catch (err) {
    console.error(err);
    process.exit(1);
}

#!/usr/bin/env node
'use strict';

var argv = require('yargs')
    .usage('Usage: $0 <function name> [Options]')
    .demand(1, 'You should specify a function name')
    .option('p', {
        alias: 'parse-path',
        describe: 'Source root of your Parse app',
        default: '.'
    })
    .option('s', {
        alias: 'json-stringify',
        descibe: 'Print result in JSON representation',
        type: 'boolean',
        default: false
    })
    .option('a', {
        alias: 'arguments',
        describe: 'Arguments (JSON String)',
        type: 'string',
        default: '{}'
    })
    .help('h')
    .alias('h', 'help')
    .argv;
var Path = require('path');
var Parse = require('./index').Parse;

// Process arguments
var parse_folder = Path.normalize(Path.join(process.cwd(), argv.parsePath));
var function_name = argv._[0];
try {
    var params = JSON.parse(argv.arguments);
} catch (err) {
    console.error('Failed to parse arguments.');
    console.error(err);
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

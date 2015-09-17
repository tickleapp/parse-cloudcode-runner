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
        describe: 'Print result in JSON representation',
        type: 'boolean',
        default: false
    })
    .option('a', {
        alias: 'arguments',
        describe: 'Arguments (JSON String)',
        type: 'string',
        default: '{}'
    })
    .option('t', {
        alias: 'type',
        describe: 'Type of function to run',
        type: 'string',
        default: 'function',
        choices: ['function', 'job']
    })
    .help('h')
    .alias('h', 'help')
    .argv;
var clc = require('cli-color');
var Parse = require('./index').Parse;
var Path = require('path');
var _ = require('lodash');

// Process arguments
var parseFolder = Path.normalize(Path.join(process.cwd(), argv.parsePath));
var functionName = argv._[0];
var functionType = argv.type;
try {
    var params = JSON.parse(argv.arguments);
} catch (err) {
    console.error('Failed to parse arguments.');
    console.error(err);
    process.exit(1);
}

// Setup
Parse.setRequireBasePath(parseFolder);

// Register
var parseCloudMainPath = Path.join(parseFolder, 'cloud/main.js');
try {
    require('./' + Path.relative(__dirname, parseCloudMainPath));
} catch (err) {
    console.error('Cannot load "' + parseFolder + '".');
    console.error(err);
    process.exit(1);
}

// Run
try {
    Parse.Cloud.debugRun(functionName, params, functionType).then(function(response) {
        console.log(clc.cyan('Final output ' + _.repeat('=', 67)));
        console.log(argv.jsonStringify ? JSON.stringify(response) : response);
    }, function(error) {
        console.log(clc.red( 'Error output ' + _.repeat('=', 67)));
        console.error(argv.jsonStringify ? JSON.stringify(error) : error);
    });
} catch (err) {
    console.error(err);
    process.exit(1);
}

#!/usr/bin/env node
/*
 *  Copyright 2015 Tickle Labs, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
*/

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

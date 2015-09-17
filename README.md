# Parse CloudCode Runner

## Setup

### Install
```
npm install parse-cloudcode-runner -g
```

### Change code
Modify your `cloud/main.js` by adding following lines before calling `Parse`
```javascript
if (typeof Parse === 'undefined') {
    var Parse = require('parse-cloudcode-runner').Parse;
    Parse.initialize('YOUR_PARSE_APPLICATION_ID', 'YOUR_PARSE_JAVASCRIPT_KEY');
}
```
(In Parse's CloudCode environment, `Parse` is globally available. But in local development environment, 
you have to import it by yourself. Check `sample/cloud/main.js` for example.)

_Note: you could use [motdotla/dotenv](https://github.com/motdotla/dotenv)
to load your Parse credentials from environment._

### Run
Run your cloud code function by
```
./runner.js [parse source root] [cloud function name] [argument in json]
```
like
```
./runner.js sample hello '{"answer": 42}'
```
or if your `cwd` is at the source root of your Parse app and you don't have to put any arguments
for your function, then just
```
./runner.js [cloud function name]
```

## Current support of `Parse.Cloud` module

* function `Parse.Cloud.define`
* function `Parse.Cloud.httpRequest` (by [flovilmart/parse-cloud](https://github.com/flovilmart/parse-cloud))
* class `Parse.Cloud.FunctionRequest`
* class `Parse.Cloud.FunctionResponse`

## TODO

1. Support of callbacks like `afterDelete` and etc.

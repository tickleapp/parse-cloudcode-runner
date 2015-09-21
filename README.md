# Parse CloudCode Runner

## Setup

### Install
```
npm install parse-cloudcode-runner
```

### Set Parse credentials
If you put them in ENVIRONMENT directly, the runner would fetch it automatically.
Keys of ENVIROMENT would be:
  - `PARSE_APPLICATION_ID`
  - `PARSE_JAVASCRIPT_KEY`
  - `PARSE_MASTER_KEY` _(optional)_

Or you could check `sample/cloud/main.js` for about how to set them.

### Run
Run your cloud code function by
```
parse-cloudcode-runner <function name> [Options]
```
like
```
parse-cloudcode-runner hello -a '{"answer": 42}'
```

To run background jobs:
```
parse-cloudcode-runner worker -a '{"answer": 42}' -t job
```

Options are
```
  -p, --parse-path      Source root of your Parse app             [default: "."]
  -s, --json-stringify  Print result in JSON representation
                                                      [boolean] [default: false]
  -a, --arguments       Arguments (JSON String)         [string] [default: "{}"]
  -t, --type            Type of function to run
                     [string] [choices: "function", "job"] [default: "function"]
```

## Current support of `Parse.Cloud` module

* Cloud modules (by [flovilmart/parse-develop](https://github.com/flovilmart/parse-develop))
* function `Parse.Cloud.define`
* function `Parse.Cloud.job`
* function `Parse.Cloud.httpRequest` (by [flovilmart/parse-cloud](https://github.com/flovilmart/parse-cloud))
* class `Parse.Cloud.FunctionRequest`
* class `Parse.Cloud.FunctionResponse`
* class `Parse.Cloud.JobRequest`
* class `Parse.Cloud.JobStatus`

## TODO

1. Support of callbacks like `afterDelete` and etc.

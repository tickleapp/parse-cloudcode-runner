# Parse CloudCode Runner

## Setup

1. Modify your `cloud/main.js` by adding following lines before calling `Parse`

```javascript
if (typeof Parse === 'undefined') {
    var Parse = require('./../../index').Parse;
    Parse.initialize('YOUR_PARSE_APPLICATION_ID', 'YOUR_PARSE_JAVASCRIPT_KEY');
}
```

Note:

## TODO

1. Support of callbacks like `afterDelete` and etc.

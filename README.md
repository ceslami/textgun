# textgun [![](https://api.travis-ci.org/ceslami/textgun.svg)](https://travis-ci.org/ceslami/textgun) [![npm version](https://badge.fury.io/js/textgun.svg)](http://badge.fury.io/js/textgun)

Promise-based API for sending free text messages using carrier email gateways.

``npm install textgun``

### Usage

```javascript
var textgun = require('textgun');

var transport = textgun({
    email: $YOUR_EMAIL,
    password: $YOUR_PASSWORD
});

transport.send({
    to: '1234567890',
    text: 'Hey!'
}).then(function() {
    console.log('success!');
}).fail(function(error) {
    console.log(error);
});
```

### Getting Started

You'll notice the `$YOUR_EMAIL` and `$YOUR_PASSWORD` placeholders in the example above. You can use any credentials with a valid SMTP provider. The library and API are very small. There are no additional configuration and message sending options beyond what is showcased in the above example. Enjoy!

### Limitations

- Only supports US Carriers
- Does not format/validate phone numbers
- Must use full 10-digit phone number

### License (MIT)

Copyright (c) 2014 Cyrus Eslami <ceslami@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
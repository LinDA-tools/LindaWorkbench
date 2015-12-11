request-then
============

A mashup of [request](https://github.com/mikeal/request) with [then/promise](https://github.com/then/promise)

[![Build Status](https://travis-ci.org/js-inside/request-then.svg?branch=master)](https://travis-ci.org/js-inside/request-then) [![NPM version](https://badge.fury.io/js/request-then.svg)](http://badge.fury.io/js/request-then)

Install
=======

`npm install request-then --save`

Example
=======

```javascript
var request = require('request-then');

request('http://example.com')
  .then(function handleResponse (response) {
    console.log(response);
  }, function handleError (error) {
    console.log(error);
  });
```

'use strict';

var request = require('request');
var Promise = require('promise');

module.exports = function makeRequest (options) {
  if (typeof options === 'string')
    options = {
      uri: options,
      method: 'GET'
    };

  return new Promise(function resolver (resolve, reject) {
    request(options, function (error, response) {
      if (error)
        reject(error);
      else
        resolve(response);
    });
  });
};

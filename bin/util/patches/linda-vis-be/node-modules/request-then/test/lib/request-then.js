'use strict';

var mockery = require('mockery');

describe('request-then', function () {
  var options, request, requestThen;

  beforeEach(function () {
    options = {
      uri: 'http://example.com',
      method: 'HEAD'
    };

    request = jasmine.createSpy('request');

    var Promise = require('promise');

    mockery.registerAllowable('../../lib/request-then');
    mockery.registerMock('request', request);
    mockery.registerMock('promise', Promise);
    mockery.enable({ useCleanCache: true });
    requestThen = require('../../lib/request-then');
  });

  it('should request with string arguments', function () {
    requestThen('http://example.com');

    expect(request).toHaveBeenCalledWith({
      uri: 'http://example.com',
      method: 'GET'
    }, jasmine.any(Function));
  });

  it('should request with an object', function () {
    requestThen(options);

    expect(request).toHaveBeenCalledWith(options, jasmine.any(Function));
  });

  it('should resolve on success', function (done) {
    request.andCallFake(function(options, cb) {
      cb(null, {
        body: {
          foo: 'bar'
        }
      });
    });

    requestThen(options)
      .then(function (response) {
        expect(response).toEqual({
          body: {
            foo: 'bar'
          }
        });
        done();
      });
  });

  it('should reject on error', function (done) {
    request.andCallFake(function(options, cb) {
      cb(new Error('foo'));
    });

    requestThen(options)
      .catch(function (error) {
        expect(error).toEqual(jasmine.any(Error));
        done();
      });
  });

  afterEach(function () {
    mockery.disable();
    mockery.deregisterAll();
  });
});

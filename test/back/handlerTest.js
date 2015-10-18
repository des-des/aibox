var test = require('tape');
var shot = require('shot');
var fs = require('fs');

var handler = require('../../server/handler.js');
var fileReader = require('../../server/fileReader.js');
var caller = require('../../server/database.js').createCaller();
var fileLoader = fileReader.loadFilesTo;
var fileRequestBuilder = fileReader.makeFileRequestFor;
var finalCall;
var newUserData = createNewUserStringFrom('eoin', 'pass');
var fileData;

caller.add(function(next) {
  fileReader.loadFiles(function(handlerFileData) {
    handler.setFileData(handlerFileData);
    fileData = handlerFileData;
    next();
  });
}).add(function(next) {
  testHandlerGetResponse('<>', createStatusCodeTest(404), next);
}).add(function(next) {
  console.log('test2!');
  testHandlerGetResponse('/woah/', createStatusCodeTest(404), next);
}).add(function(next) {
  testHandlerGetResponse('?', createStatusCodeTest(404), next);
}).add(function(next) {
  testHandlerGetResponse('/public/notHere.js', createStatusCodeTest(404), next);
}).add(function(next) {
  testHandlerGetResponse('/auth/secret.html', createStatusCodeTest(404), next);
}).add(function(next) {
  testHandlerGetResponse('/public/index.html',
    createResponseTest(fileData['index.html'].toString(), 200), next);
}).add(function(next) {
  testHandlerGetResponse('/data/nowhere', createStatusCodeTest(404), next);
}).add(function(next) {
  testHandlerPostResponse(
      '/data/newuser', createResponseTest('success!', 200), newUserData, next);
}).add(function(next) {
  testHandlerPostResponse(
      '/data/newuser', createResponseTest('nah m8', 200), newUserData, next);
}).add(function(next) {
  testHandlerPostResponse(
      '/data/newusers', createStatusCodeTest(404), newUserData, next);
}).add(function(next) {
  testHandlerGetResponse(
      '/data/newusers', createStatusCodeTest(404), next);
}).add(function(next) {
  test('checking file loader can handle bad file name', function(tester) {
    fileLoader({}, [fileRequestBuilder('main.html')], function(badFiles) {
      badFilesTest(badFiles, tester);
      next();
    });
  });
}).add(function(next) {
  test('checking file loader has correct keys in output', function(tester) {
    var expectedFileKeys = [
      'index.html',
      'custom.css',
      'main.js'
    ];
    expectedFileKeys.forEach(function(fileKey) {
      tester.ok(fileData[fileKey]);
    });
    tester.equal(Object.keys(fileData).length, expectedFileKeys.length);
    tester.end();
    next();
  });
}).add(function(next) {
  lastCall();
});

function badFilesTest(badFiles, tester) {
  tester.equal(Object.keys(badFiles).length, 0, 'Yo');
  tester.end();
};

var testHandlerResponse = function(request, responseTest, next) {
  test('handler test', function(tester) {
    shot.inject(handler.handler, request, function(response) {
      responseTest(request, response, tester);
      tester.end();
      next();
    });
  });
}

var testHandlerGetResponse = function(requestUrl, responseTest, next) {
  var getRequest = {
    url: requestUrl,
    method: 'GET'
  };
  testHandlerResponse(getRequest, responseTest, next);
}

function testHandlerPostResponse(requestUrl, responseTest, payload, next) {
  var getRequest = {
    url: requestUrl,
    method: 'POST',
    payload: payload
  };
  testHandlerResponse(getRequest, responseTest, next);
}

var createStatusCodeTest = function(expectedStatusCode) {
  return function(request, response, tester) {
    // test('testing if url ' + request.url +
    //   ' returns status code ' + expectedStatusCode, function(t) {
        tester.equal(response.statusCode, expectedStatusCode);
        // tester.end();
        // next();
      // });
  }
}

function createResponseTest(expectedPayload, expectedStatusCode) {
  return function(request, response, tester) {
    tester.equal(response.statusCode, expectedStatusCode,
      'correct status code');
    tester.equal(response.payload, expectedPayload, 'correct response payload');
  };
}

function createNewUserStringFrom(username, password) {
  return JSON.stringify({
    username: username,
    password: password
  });
}

module.exports = function(last) {
  lastCall = last;
  caller();
};

var test = require('tape');
var shot = require('shot');
var fs = require('fs');

var handler = require('../../server/handler.js');
var fileReader = require('../../server/fileReader.js');
var fileLoader = fileReader.loadFilesTo;
var fileRequestBuilder = fileReader.makeFileRequestFor;

fileReader.loadFiles(function(fileData) {
  handler.setFileData(fileData);
  var testHandlerResponse = function(request, responseTest) {
    shot.inject(handler.handler, request, function(response) {
      responseTest(request, response);
    });
  }

  var testHandlerGetResponse = function(requestUrl, responseTest) {
    var getRequest = {
      url: requestUrl,
      method: 'GET'
    };
    testHandlerResponse(getRequest, responseTest);
  }

  var testHandlerPostResponse = function(requestUrl, responseTest) {
    var getRequest = {
      url: requestUrl,
      method: 'POST'
    };
    testHandlerResponse(getRequest, responseTest);
  }

  var createStatusCodeTest = function(expectedStatusCode) {
    return function(request, response) {
      test('testing if url ' + request.url +
        ' returns status code ' + expectedStatusCode, function(t) {
          t.equal(response.statusCode, expectedStatusCode);
          t.end();
        });
    }
  }
  var createResponseTest = function(expectedPayload, expectedStatusCode) {
    return function(request, response) {
      test('testing if url ' + request.url +
        ' returns correct response ', function(t) {
          t.equal(response.statusCode, expectedStatusCode, 'correct status code');
          t.equal(response.payload, expectedPayload, 'correct response payload');
          t.end();
        });
    }
  }


  testHandlerGetResponse('<>', createStatusCodeTest(404));
  testHandlerGetResponse('/woah/', createStatusCodeTest(404));
  testHandlerGetResponse('?', createStatusCodeTest(404));
  testHandlerGetResponse('/public/notHere.js', createStatusCodeTest(404));
  testHandlerGetResponse('/auth/secret.html', createStatusCodeTest(404));
  testHandlerGetResponse('/public/index.html',
    createResponseTest(fileData['index.html'].toString(), 200));

  testHandlerGetResponse('/data/nowhere', createStatusCodeTest(404));
  testHandlerPostResponse('/data/newuser', createStatusCodeTest(200));
  testHandlerPostResponse('/data/newusers', createStatusCodeTest(404));
  testHandlerGetResponse('/data/newusers', createStatusCodeTest(404));

  test('checking file loader can handle bad file name', function(tester) {
    fileLoader({}, [fileRequestBuilder('main.html')], function(badFiles) {
      badFilesTest(badFiles, tester);
    });
  });

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
  });

  function badFilesTest(badFiles, tester) {
    tester.equal(Object.keys(badFiles).length, 0, 'Yo');
    tester.end();
  };
});

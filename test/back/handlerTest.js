var test = require('tape');
var shot = require('shot');
var fs = require('fs');

var index = fs.readFileSync(__dirname + '/../../public/html/index.html').toString();

var handler = require('../../server/handler.js');

handler.readFiles(function(fileData) {
  console.log(fileData);

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
  testHandlerGetResponse('/data/nowhere', createStatusCodeTest(404));
  testHandlerGetResponse('/auth/secret.html', createStatusCodeTest(404));
  testHandlerGetResponse('/public/index.html',
    createResponseTest(fileData['index.html'].toString(), 200));

  var fileLoader = handler.LoadFilesTo;

  test('checking file loader can handle bad file name', function(tester) {
    var badFiles = {};
    fileLoader(badFiles, [handler.buildFileRequest('main.html')], function(badFiles) {
      tester.equal(Object.keys(badFiles).length, 0, 'Yo');
      tester.end();
    });
  });
});

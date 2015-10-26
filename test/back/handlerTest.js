var test = require('tape');
var shot = require('shot');

var handler = require('../../server/handler.js');
var fileReader = require('../../server/fileReader.js');
var createCaller = require('../../server/helpers').createCaller;

function main(callback) {
  var databaseTestsArray = [
    [testHandlerPostResponse, '/data/newuser',
      createResponseTest('success!', 200),
      createNewUserStringFrom('eoin', 'pass')],
    [testHandlerPostResponse, '/data/newuser',
      createResponseTest('nah m8', 200),
      createNewUserStringFrom('eoin', 'pass')]
  ];
  var handerTestsArray = [
    [testHandlerGetResponse, '<>', createStatusCodeTest(404)],
    [testHandlerGetResponse, '/woah/', createStatusCodeTest(404)],
    [testHandlerGetResponse, '?', createStatusCodeTest(404)],
    [testHandlerGetResponse, '/public/notHere.js', createStatusCodeTest(404)],
    [testHandlerGetResponse, '/auth/secret.html', createStatusCodeTest(404)],
    [testHandlerGetResponse, '/public/index.html',
      createResponseTest(handler.getFileData()['index.html'].toString(), 200)],
    [testHandlerGetResponse, '/data/nowhere', createStatusCodeTest(404)],
    [testHandlerPostResponse, '/data/newusers',
      createStatusCodeTest(404), createNewUserStringFrom('eoin', 'pass')],
    [testHandlerGetResponse, '/data/newusers', createStatusCodeTest(404)],
    [badFilesTest],
    [testFileKeys],
    [createCaller(databaseTestsArray).series]
  ];

  createCaller(handerTestsArray).parallel(callback);
}

function testFileKeys(next) {
  test('checking file loader has correct keys in output', function(tester) {
    var expectedFileKeys = [
      'index.html',
      'custom.css',
      'main.js',
      'login.html',
      'signup.html'
    ];
    expectedFileKeys.forEach(function(fileKey) {
      tester.ok(handler.getFileData()[fileKey], 'key ' + fileKey + ' exists');
    });
    tester.equal(Object.keys(handler.getFileData()).length,
      expectedFileKeys.length, 'correct number of keys');
    tester.end();
    next();
  });
}

function badFilesTest(next) {
  test('checking file loader can handle bad file name', function(tester) {
    fileReader.loadFiles(['main.html'], function(badFiles) {
      tester.equal(Object.keys(badFiles).length, 0, 'Yo');
      tester.end();
      next();
    });
  });
}

function testHandlerResponse(request, responseTest, next) {
  test('handler test', function(tester) {
    shot.inject(handler.handler, request, function(response) {
      responseTest(request, response, tester);
      tester.end();
      next();
    });
  });
}

function testHandlerGetResponse(requestUrl, responseTest, next) {
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

function createStatusCodeTest(expectedStatusCode) {
  return function(request, response, tester) {
        tester.equal(response.statusCode, expectedStatusCode);
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

module.exports = main;

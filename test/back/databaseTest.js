var test = require('tape');

var authenticator = require('../../server/authenticator.js');
var database = require('../../server/database.js');
var createCaller = require('../../server/helpers').createCaller;

var main = function(finalCall) {
  database.flush();
  var putUserTestArray = [
    [putUserTest, 'eoin', 'pass', true],
    [putUserTest, 'eoin', 'pass', false],
    [deleteUserTest, 'eoin']
  ];

  var authenticatorTestArray = [
    [valitdateTest, 'eoinmc', 'pass', false],
    [authenticateNewUserTest, 'eoinmc', 'pass', true],
    [authenticateNewUserTest, 'eoinmc', 'pass', false],
    [valitdateTest, 'eoinmc', 'pass', true],
    [valitdateTest, 'eoinmc', 'password', false],
    [deleteUserTest, 'eoinmc']
  ];

  var parallelTestArray = [
    [createCaller(putUserTestArray).series],
    [createCaller(authenticatorTestArray).series]
  ]
  createCaller(parallelTestArray).parallel(finalCall);
};

function deleteUserTest(username, next) {
  test('try to delete user', function(tester) {
    database.deleteUser(username, function(response) {
      tester.equal(response, 1, 'user ' + username + 'successfully deleted');
      tester.end();
      next();
    });
  });
}

function authenticateNewUserTest(username, password, expected, next) {
  test('try to create new user', function(tester){
    authenticator.createNewUser(username, password, function(reply){
      tester.equal(reply, expected,
        'create new user ' + username + 'test passed');
      tester.end();
      next();
    });
  });
}

function putUserTest(username, password, expected, next) {
  test('Trying to store new user', function(tester) {
    database.putUser(username, password, function(reply) {
      tester.equal(reply, expected, 'put new user ' + username + ' returns ' + expected);
      tester.end();
      next();
    });
  });
}

function valitdateTest(username, password, expected, next) {
  test('Testing user validation', function(tester){
    authenticator.validateUser(username, password, function(reply){
      tester.equal(reply, expected,
        'username ' + username +
        ' password ' + password +
        ' returns ' + expected);
      tester.end();
      next();
    });
  });
}

module.exports = main;

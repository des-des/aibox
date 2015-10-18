var test = require('tape');

var authenticator = require('../../server/authenticator.js');
var database = require('../../server/database.js');

var finalCall;

var caller = database.createCaller();
caller.add(function(next) {
  database.flush();
  // database.startDB();
  test('Trying to store new user in database returns true', function(tester) {
    database.putUser('eoin', 'secret', function(reply) {
      tester.ok(reply, 'put new user returns true');
      tester.end();
      next();
    });
  });
}).add(function(next) {
  test('Trying to store existing user in database returns false', function(tester) {
    database.putUser('eoin', 'secret', function(reply) {
      tester.ok(!reply, 'put existing user returns false');
      tester.end();
      next();
    });
  });
}).add(function(next) {
  test('can delete user again', function(tester) {
    database.deleteUser('eoin', function(response) {
      tester.equal(response, 1, 'user successfully deleted');
      tester.end();
      next();
    });
  })
}).add(function(next) {
  test('attempt to create new user returns true', function(tester){
    authenticator.createNewUser('eoin', 'pass', function(reply){
      tester.ok(reply, 'new user created');
      tester.end();
      next();
    });
  });
}).add(function(next) {
  test('attempt to create existing user returns false', function(tester){
    authenticator.createNewUser('eoin', 'pass', function(reply){
      tester.ok(!reply, 'new user not created');
      tester.end();
      next();
    });
  });
}).add(function(next) {
  test('new user successfully validated', function(tester){
    authenticator.validateUser('eoin', 'pass', function(reply){
      tester.ok(reply, 'password match');
      tester.end();
      next();
    });
  });
}).add(function(next) {
  test('incorrect password fails', function(tester){
    authenticator.validateUser('eoin', 'password', function(reply){
      tester.ok(!reply, 'password do not match');
      tester.end();
      next();
    });
  });
}).add(function(next) {
  test('new user successfully deleted', function(tester){
    authenticator.validateUser('eoin', 'pass', function(reply){
      if (reply) {
        database.deleteUser('eoin');
      }
      tester.ok(reply, 'new user deleted');
      tester.end();
      finalCall();
    });
  });
});

module.exports = function(final) {
  finalCall = final;
  caller();
}

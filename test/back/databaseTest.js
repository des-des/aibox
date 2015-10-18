var test = require('tape');

var db = require('../../server/database.js');

var caller = db.createCaller();
caller.add(function(next) {
  db.startDB();
  test('Trying to store existing user in database returns false', function(tester) {
    db.putUser('eoin', 'secret', function(reply) {
      console.log('in putuser callback');
      tester.ok(reply, 'put new user returns true');
      tester.end();
      next();
    });
  });
}).add(function(next) {
  test('Trying to store existing user in database returns false', function(tester) {
    db.putUser('eoin', 'secret', function(reply) {
      tester.ok(!reply, 'put existing user returns false');
      tester.end();
      next();
    });
  });
}).add(function() {
  test('can delete user again', function(tester) {
    db.deleteUser('eoin', function(response) {
      tester.equal(response, 1, 'user successfully deleted');
      tester.end();
      db.stopDB();
    });
  });
});

caller();

var databaseTest = require('./databaseTest.js');
var handlerTest = require('./handlerTest.js');
var database = require('../../server/database.js')
var createCaller = require('../../server/helpers.js').createCaller;
var handler = require('../../server/handler.js')
var fileReader = require('../../server/fileReader.js');
var authenticator = require('../../server/authenticator.js');


var test = require('tape');

var startTests = function(next) {
  database.startDB();
  fileReader.loadAllFiles(function(handlerFileData) {
    handler.setFileData(handlerFileData);
    next();
  });
};

var callsArray = [
  [startTests],
  [handlerTest],
  [databaseTest],
  [database.stopDB],
  [testErrors]
];

createCaller(callsArray).series(function() {
  console.log('tests finished');
});

function testErrors(next) {
  // test('check redis/bcrypt errors do not crash server', function(tester) {
  console.log('check redis/bcrypt errors do not crash server')
  var crashTestArray = [
    [database.putUser, 'eoinmcc', 'hash'],
    [database.getHash, 'eoinmcc'],
    [database.deleteUser, 'eoinmcc', 'hash'],
    [database.stopDB, '??err']
  ];
  createCaller(crashTestArray).parallel(next);
    // ;
  // })
}

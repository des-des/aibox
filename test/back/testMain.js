var databaseTest = require('./databaseTest.js');
var handlerTest = require('./handlerTest.js');
var database = require('../../server/database.js')
var createCaller = require('../../server/helpers.js').createCaller;
var handler = require('../../server/handler.js')
var fileReader = require('../../server/fileReader.js');

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
  [database.stopDB]
];

createCaller(callsArray).series(function() {
  console.log('tests finished');
});

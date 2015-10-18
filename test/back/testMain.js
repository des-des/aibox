var databaseTest = require('./databaseTest.js');
var handlerTest = require('./handlerTest.js');

var database = require('../../server/database.js');

var caller = database.createCaller();

caller.add(function(next) {
  database.startDB();
  next();
}).add(handlerTest)
  .add(databaseTest)
  .add(database.stopDB);

caller();

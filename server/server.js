var http = require('http');

var handler = require('./handler.js');
var fileReader = require('./fileReader.js');
var database = require('./database.js');

database.startDB();

var port = process.env.port || 4000;

fileReader.loadFiles(function(fileData){
  handler.setFileData(fileData);
  server = http.createServer(handler.handler);
  server.listen(port, function() {
    console.log('server is listening on port ' + port);
  });
});

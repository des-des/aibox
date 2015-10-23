var http = require('http');

var handler = require('./server/handler.js');
var fileReader = require('./server/fileReader.js');
var database = require('./server/database.js');
var server;

database.startDB();

var port = process.env.port || 4000;

fileReader.loadAllFiles(function(fileData){
  handler.setFileData(fileData);
  server = http.createServer(handler.handler);
  server.listen(port, function() {
    console.log('server is listening on port ' + port);
  });
});

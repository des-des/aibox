var http = require('http');

var handler = require('./handler.js');
var port = 4000;

handler.readFiles(function(){
  server = http.createServer(handler.handler);
  server.listen(port, function() {
    console.log('server is listening on port ' + port);
  });
});

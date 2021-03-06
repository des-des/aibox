var fs = require('fs');
var path = require('path');

var Hapi = require('hapi');
var Inert = require('inert');
var ampl = require('ampl');

var port = process.env.PORT || 3000;
var server = new Hapi.Server();

server.connection({ port: port });

server.register(Inert, function (err) {
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, '../public'),
        listing: true
      }
    }
  });
});

server.start(function(){
  console.log('server listening on port', port);
});

module.exports = server;

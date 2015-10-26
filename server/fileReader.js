var fs = require('fs');

var createCaller = require('./helpers.js').createCaller;

function loadAllFiles(callback) {
    loadFiles([
      'index.html',
      'signup.html',
      'login.html',
      'custom.css',
      'main.js'
    ], callback);
}


function loadFiles(fileNames, callback) {
  var loadRequests = fileNames.map(function(fileName) {
    return [readFileFrom, makeFileRequestFor(fileName)];
  });
  createCaller(loadRequests, {}).parallel(callback);
}

function makeFileRequestFor(filePath) {
  var fileType = filePath.split('.')[1];
  return {
    fileKey: filePath,
    filePath: __dirname + '/../public/' + fileType + '/' + filePath
  }
}

function readFileFrom(loadRequest, finalCallback) {
  var that = this;
  fs.readFile(loadRequest.filePath, function(err, fileData) {
    if (!err) {
      that[loadRequest.fileKey] = fileData;
    } else {
      console.log('bad file path in fileReader ' +
        loadRequest.filePath + " ignored");
    }
    finalCallback(that);
  });
}

 module.exports = {
   loadFiles: loadFiles,
   loadAllFiles: loadAllFiles,
}

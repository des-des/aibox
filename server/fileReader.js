fs = require('fs');

var createCaller = require('./helpers.js').createCaller;

function loadAllFiles(callback) {
    loadFiles(['index.html', 'custom.css', 'main.js'], callback);
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
//
// function loadFiles(callback) {
//   var loadRequest = [
//     makeFileRequestFor('index.html'),
//     makeFileRequestFor('custom.css'),
//     makeFileRequestFor('main.js'),
//   ];
//   loadFilesTo({}, loadRequest, callback);
// }
//
// function loadFilesTo(files, loadRequests, callback) {
//   var loaded = 0;
//   loadRequests.forEach(function(loadRequest) {
//     fs.readFile(loadRequest.filePath, function(err, fileData) {
//       putFile(loadRequest, files, err, fileData);
//     });
//   });
//
//   function putFile(loadRequest, files, err, fileData) {
//     if (!err) {
//       files[loadRequest.fileKey] = fileData;
//       callbackIfFinished();
//     } else {
//       console.log(err);
//       callbackIfFinished();
//     }
//   }
//
//   function callbackIfFinished() {
//     loaded += 1;
//     if (loaded === loadRequests.length) {
//       callback(files);
//     }
//   }
// }

 module.exports = {
   loadFiles: loadFiles,
   loadAllFiles: loadAllFiles,
  //  loadFilesTo: loadFilesTo,
   makeFileRequestFor: makeFileRequestFor,
}

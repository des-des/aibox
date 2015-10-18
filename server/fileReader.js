fs = require('fs');


function loadFiles(callback) {
  var loadRequest = [
    makeFileRequestFor('index.html'),
    makeFileRequestFor('custom.css'),
    makeFileRequestFor('main.js'),
  ];
  loadFilesTo({}, loadRequest, callback);
}

function makeFileRequestFor (filePath) {
  var fileType = filePath.split('.')[1];
  return {
    fileKey: filePath,
    filePath: __dirname + '/../public/' + fileType + '/' + filePath
  }
}

function loadFilesTo(files, loadRequests, callback) {
  var loaded = 0;
  loadRequests.forEach(function(loadRequest) {
    fs.readFile(loadRequest.filePath, function(err, fileData) {
      putFile(loadRequest, files, err, fileData);
    });
  });

  function putFile(loadRequest, files, err, fileData) {
    if (!err) {
      files[loadRequest.fileKey] = fileData;
      callbackIfFinished();
    } else {
      console.log(err);
      callbackIfFinished();
    }
  }

  function callbackIfFinished() {
    loaded += 1;
    if (loaded === loadRequests.length) {
      callback(files);
    }
  }
}

 module.exports = {
   loadFiles: loadFiles,
   loadFilesTo: loadFilesTo,
   makeFileRequestFor: makeFileRequestFor,
}

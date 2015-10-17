var fs = require('fs');

var fileData = {};
var server;
var port = 4000;

var makeFileRequestFrom = function(filePath) {
  var fileType = filePath.split('.')[1];
  return {
    fileKey: filePath,
    filePath: __dirname + '/../public/' + fileType + '/' + filePath
  }
}

var LoadFilesTo = function(files, loadRequests, callback) {
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
  };

  var callbackIfFinished = function() {
    if (callback) {
      loaded += 1;
      if (loaded === loadRequests.length) {
        callback(files);
      }
    };
  }
}

var readFiles = function(callback) {
  LoadFilesTo(fileData, [
    makeFileRequestFrom('index.html'),
    makeFileRequestFrom('custom.css'),
    makeFileRequestFrom('main.js'),
  ], callback);
}

var handler = function(request, response) {
  console.log('sup yo')
  console.log(request.url);
  var tokenisedUrl = tokeniseRequestUrl(request);
  var urlRoot = tokenisedUrl[0];
  if (urlRoot === 'public') {
    handlerPublicUrl(request, response)
  } else {
    serve404(response);
  }
}

var tokeniseRequestUrl = function(request) {
  var tokenisedUrl = request.url.split('/');
  return tokenisedUrl[0].length ? tokenisedUrl : tokenisedUrl.slice(1);
}

var handlerPublicUrl = function(request, response) {
  console.log('sup')
  var tokenisedUrl = tokeniseRequestUrl(request);
  var requestedFileType, dotsArray;
  var requestedFileData = tokenisedUrl.length === 2 &&
    fileData[tokenisedUrl[1]];
  if (requestedFileData) {
    requestedFileType = getTypeFromName(tokenisedUrl[1]);
    sendResponse(response, 'text/' + requestedFileType, 200, requestedFileData);
  } else {
    serve404(response);
  }
}

var getTypeFromName = function(name) {
  var dots = name.split('.');
  return dots[dots.length-1];
}

var sendResponse = function(response, contentType, statusCode, responseData) {
  writeHeadTo(response, 'text/html', 200);
  response.end(responseData);
}

var writeHeadTo = function(response, contentType, statusCode) {
  response.writeHead(statusCode, {
    'contentType' : contentType
  });
}

var serve404 = function(response) {
  response.writeHead(404);
  response.end();
}

module.exports = {
  handler: handler,
  LoadFilesTo: LoadFilesTo,
  readFiles: readFiles,
  buildFileRequest: makeFileRequestFrom,
  readFiles: readFiles
}

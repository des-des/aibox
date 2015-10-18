var fs = require('fs');

var fileData;

function setFileData(data) {
  fileData = data;
}

function handler(request, response) {
  console.log(request.url);
  var tokenisedUrl = tokeniseRequestUrl(request);
  var urlRoot = tokenisedUrl[0];
  if (urlRoot === 'public') {
    handlerPublicRequest(request, response)
  } else if (urlRoot === 'data') {
    handleDataRequest(request, response);
  } else {
    serve404(response);
  }
}

////////////////////////////////////////////////////////////////////////////////
//                             PUBLIC REQUEST HANDLER                         //
////////////////////////////////////////////////////////////////////////////////

var handlerPublicRequest = function(request, response) {
  var tokenisedUrl = tokeniseRequestUrl(request)
    , requestedFileType;
  var requestedFileData = tokenisedUrl.length === 2 &&
    fileData[tokenisedUrl[1]];
  if (requestedFileData) {
    requestedFileType = getTypeFromName(tokenisedUrl[1]);
    sendResponse(response, 'text/' + requestedFileType, 200, requestedFileData);
  } else {
    serve404(response);
  }
}

////////////////////////////////////////////////////////////////////////////////
//                              DATA REQUEST HANDLER                          //
////////////////////////////////////////////////////////////////////////////////

function handleDataRequest(request, response) {
  var requestMethod = request.method;
  if (requestMethod === 'POST') {
    handleDataPostRequest(request, response);
  } else {
    serve404(response);
  }
}

function handleDataPostRequest(request, response) {
  var tokenisedUrl = tokeniseRequestUrl(request);
  var postTarget = tokenisedUrl[1];
  if (postTarget === 'newuser') {
    sendResponse(response, 'text/plain', 200, 'Yo!');
  } else {
    serve404(response);
  }
}

////////////////////////////////////////////////////////////////////////////////
//                                     HELPERS                                //
////////////////////////////////////////////////////////////////////////////////

function tokeniseRequestUrl(request) {
  var tokenisedUrl = request.url.split('/');
  return tokenisedUrl[0].length ? tokenisedUrl : tokenisedUrl.slice(1);
}

function getTypeFromName(name) {
  var dots = name.split('.');
  return dots[dots.length-1];
}

function sendResponse(response, contentType, statusCode, responseData) {
  writeHeadTo(response, contentType, 200);
  response.end(responseData);
}

function writeHeadTo(response, contentType, statusCode) {
  response.writeHead(statusCode, {
    'contentType' : contentType
  });
}

function serve404(response) {
  response.writeHead(404);
  response.end();
}

////////////////////////////////////////////////////////////////////////////////
//                                    EXPORTS                                 //
////////////////////////////////////////////////////////////////////////////////


module.exports = {
  handler: handler,
  setFileData: setFileData
};

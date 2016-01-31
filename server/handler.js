var fs = require('fs');

var authenticator = require('./authenticator.js');

var fileData;

function setFileData(data) {
  fileData = data;
}

function getFileData() {
  return fileData;
}

function handler(request, response) {
  console.log(request.url);
  console.log(request);
  var tokenisedUrl = tokeniseRequestUrl(request);
  var urlRoot = tokenisedUrl[0];
  console.log(urlRoot);
  if (urlRoot === 'public') {
    handlerPublicRequest(tokenisedUrl, response);
  } else if (urlRoot === 'data') {
    handleDataRequest(request, response);
  } else {
    serve404(response);
  }
}

////////////////////////////////////////////////////////////////////////////////
//                          PUBLIC REQUEST HANDLER                            //
////////////////////////////////////////////////////////////////////////////////

function handlerPublicRequest(tokenisedUrl, response) {
  var requestedFileData = getFileUsing(tokenisedUrl);
  if (requestedFileData) {
    servePublicRequest(response, requestedFileData, tokenisedUrl);
  } else {
    serve404(response);
  }
}

function servePublicRequest(response, requestedFileData, tokenisedUrl) {
  var requestedFileMeme = 'text/' + getTypeFromName(tokenisedUrl[1]),
    statusCodeOk = 200;
  sendResponse(
    response, requestedFileMeme, statusCodeOk, requestedFileData);
}

function getFileUsing(tokenisedUrl) {
  return tokenisedUrl.length === 2 && fileData[tokenisedUrl[1]];
}

////////////////////////////////////////////////////////////////////////////////
//                            DATA REQUEST HANDLER                            //
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
    handleNewUserRequest(request, response);
  } else {
    serve404(response);
  }
}

function handleNewUserRequest(request, response) {
  var userData, name, pass;
  getRequestBody(request, function(body) {
    userData = JSON.parse(body);
    name = userData.username;
    pass = userData.password;
    authenticator.createNewUser(name, pass, function(newUserJWT) {
      serveNewUserResponse(response, newUserJWT, name);
    });
  });
}

function serveNewUserResponse(response, createNewUserResult) {
  if (createNewUserResult) {
    writeHeadTo(response, 'text/plain', 200);
    response.end('success!');
  } else {
    writeHeadTo(response, 'text/plain', 200);
    response.end('nah m8');
  }
}

////////////////////////////////////////////////////////////////////////////////
//                                   HELPERS                                  //
////////////////////////////////////////////////////////////////////////////////

function getRequestBody(request, callback) {
  var body = '';
  request.on('data', function(chunk) {
    body += chunk;
  });
  request.on('end', function() {
    callback(body);
  });
}

function tokeniseRequestUrl(request) {
  var tokenisedUrl = request.url.split('/');
  return tokenisedUrl[0].length ? tokenisedUrl : tokenisedUrl.slice(1);
}

function getTypeFromName(name) {
  var dots = name.split('.');
  return dots[dots.length-1];
}

function sendResponse(response, contentType, statusCode, responseData) {
  writeHeadTo(response, contentType, statusCode);
  response.end(responseData);
}

function writeHeadTo(response, contentType, statusCode) {
  response.writeHead(statusCode, {
    'contentType' : contentType
  });
}

function serve404(response) {
  console.log('serving 404');
  response.writeHead(404);
  response.end('404');
}

////////////////////////////////////////////////////////////////////////////////
//                                    EXPORTS                                 //
////////////////////////////////////////////////////////////////////////////////


module.exports = {
  handler: handler,
  setFileData: setFileData,
  getFileData: getFileData
};

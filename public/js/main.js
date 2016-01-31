/*global document*/
/*global XMLHttpRequest*/

window.onload = function() {

  (function init() {
    var authButtonsArray =
      document.getElementsByClassName('navbar')[0].
      getElementsByTagName('button');

  }());

  function signupSubmit(event) {
    var form = event.srcElement;
    var username = getFirstElementByNameFrom(form, 'username').value;
    var password = getFirstElementByNameFrom(form, 'password').value;

    event.preventDefault();

    sendCreateUserRequest(username, password, function(postNewUserRequest) {
      console.log('account creation success');
      console.log(postNewUserRequest.responseText);
    });
  }

  function sendCreateUserRequest(username, password, callback) {
    var userData = JSON.stringify({
      username: username,
      password: password
    });
    var postNewUserRequest = new XMLHttpRequest();
    postNewUserRequest.open('POST', '../data/newuser');
    postNewUserRequest.onreadystatechange = function() {
      postNewUserResponseHandler(postNewUserRequest, callback)
    };
    postNewUserRequest.send(userData);
  }

  function postNewUserResponseHandler(postNewUserRequest, callback) {
    var responseReadyState = postNewUserRequest.readyState;
    var responseStatusCode;
    if (responseReadyState === 4) {
      responseStatusCode = postNewUserRequest.status;
      if (responseStatusCode === 200) {
        callback(postNewUserRequest);
      } else {
        logRequestError(postNewUserRequest, 'New user');
      }
    }
  }

  function arrayFrom(enumerable) {
    return [].slice.apply(enumerable);
  }

  function logRequestError(request, requestDescription) {
    console.log(requestDescription + ' request failed with status code ' +
      request.status);
  }

  function getFirstElementByNameFrom(elementCollection, nameToFind) {
    var elementArray = arrayFrom(elementCollection);
    var matches = [];
    elementArray.forEach(function(element) {
      if (element.name === nameToFind) {
        matches.push(element);
      }
    });
    if (matches.length === 1) {
      return matches[0];
    }
  }
};

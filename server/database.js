var redis = require('redis');

var client;

var keys = {
  userPasswordHashes: 'usrH'
};

var createCaller = function () {
  var middlewareStore = [];

  function caller () {
    (function next(){
      middlewareStore.shift()(next);
    }());
  }

  caller.add = function (fn) {
    middlewareStore.push(fn);
    return this;
  };

  return caller;
};

function startDB() {
  client = redis.createClient(process.env.REDIS_URL, {no_ready_check: true});
}

function stopDB() {
  client.quit();
}

function putUser(username, passwordHash, callback) {
  checkUserExists(username, function(userExists) {
    if (!userExists) {
      client.SET(createUserKeyFrom(username), passwordHash, function(err, reply) {
        callback(!userExists);
      });
    } else {
      callback(!userExists);
    }
  });
}

function createUserKeyFrom(username) {
  return keys.userPasswordHashes + username;
}

function checkUserExists(username, callback) {
  client.GET(createUserKeyFrom(username), function(err, reply) {
    if (reply) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

function deleteUser(username, callback) {
  client.DEL(createUserKeyFrom(username), function(err, reply) {
    callback(reply);
  });
}

module.exports = {
  stopDB: stopDB,
  startDB: startDB,
  createCaller: createCaller,
  putUser: putUser,
  deleteUser: deleteUser
};

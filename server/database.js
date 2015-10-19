var redis = require('redis');

var client;

var keys = {
  userPasswordHashes: 'usrH'
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

function getHash(username, callback) {
  client.GET(createUserKeyFrom(username), function(err, reply) {
    callback(reply);
  });
}

function deleteUser(username, callback) {
  client.DEL(createUserKeyFrom(username), function(err, reply) {
    callback && callback(reply);
  });
}

function flush() {
  client.FLUSHDB();
}

module.exports = {
  stopDB: stopDB,
  startDB: startDB,
  putUser: putUser,
  deleteUser: deleteUser,
  getHash: getHash,
  flush: flush
};

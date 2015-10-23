var redis = require('redis');

var client;

var keys = {
  userPasswordHashes: 'usrH'
};

function startDB() {
  client = redis.createClient(process.env.REDIS_URL, {no_ready_check: true});
}

function stopDB(callback) {
  client.quit();
  if (typeof callback === 'function') {
    callback();
  }
}

function putUser(username, passwordHash, callback) {
  checkUserExists(username, function(userExists) {
    if (!userExists) {
      client.SET(createUserKeyFrom(username), passwordHash, function(error, reply) {
        if (error) {
          console.log(error);
          callback()
        } else {
          callback(!userExists);
        }
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
  console.log(username);
  client.GET(createUserKeyFrom(username), function(error, reply) {
    if (error) {
      console.log(error);
    }
    if (reply) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

function getHash(username, callback) {
  client.GET(createUserKeyFrom(username), function(error, reply) {
    if (error) {
      console.log(error);
    }
    callback(reply);
  });
}

function deleteUser(username, callback) {
  client.DEL(createUserKeyFrom(username), function(error, reply) {
    if (error) {
      console.log(error);
    }
    if (typeof callback === 'function') {
      callback(reply);
    }
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

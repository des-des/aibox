var bcrypt = require('bcrypt');

var database = require('./database.js');

// TODO: error handling

function createNewUser(username, password, callback) {
  bcrypt.genSalt(12, function(error, salt) {
    bcrypt.hash(password, salt, function(error, hash) {
      database.putUser(username, hash, callback);
    });
  });
}

function validateUser(username, password, callback) {
  database.getHash(username, function(hash) {
    bcrypt.compare(password, hash, function(error, result) {
      callback(result);
    });
  });
}

module.exports = {
  createNewUser: createNewUser,
  validateUser: validateUser
};

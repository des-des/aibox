var bcrypt = require('bcrypt');

var database = require('./database.js');

function createNewUser(username, password, callback) {
  bcrypt.genSalt(12, function(error, salt) {
    bcrypt.hash(password, salt, function(error, hash) {
      database.putUser(username, hash, function(result) {
        if (error || typeof result === 'undefined') {
          console.log('validate user failed due to db or bcypt failure');
        }
        callback(result);
      });
    });
  });
}

function validateUser(username, password, callback) {
  database.getHash(username, function(hash) {
    bcrypt.compare(password, hash, function(error, result) {
      if (error || !hash) {
        console.log('validate user failed due bad username or bcypt failure');
      }
      callback(result || false);
    });
  });
}

module.exports = {
  createNewUser: createNewUser,
  validateUser: validateUser
};

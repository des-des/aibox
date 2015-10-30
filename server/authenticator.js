var bcrypt = require('bcrypt');

var database = require('./database.js');

function createNewUser(username, password, callback) {
  bcrypt.genSalt(12, function(saltError, salt) {
    bcrypt.hash(password, salt, function(hashError, hash) {
      database.putUser(username, hash, function(result) {
        if (saltError || hashError || typeof result === 'undefined') {
          console.log('validate user failed due to db or bcypt failure');
          console.log(saltError || hashError || "putUser failed");
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

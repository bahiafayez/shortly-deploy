var timestamps = require('mongoose-timestamp');
var mongoose = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var UsersSchema = mongoose.Schema({
  username: String,
  password: String
});
UsersSchema.plugin(timestamps);

UsersSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

UsersSchema.methods.hashPassword =  function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash;
      });
  }

UsersSchema.pre('save', function(next, done) {
  this.hashPassword();
  next();
  done();
});

var User = mongoose.model('Users', UsersSchema);

module.exports = User;

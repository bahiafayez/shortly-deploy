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
    console.log('attempt');
    callback(isMatch);
  });
};

UsersSchema.methods.hashPassword =  function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash;
        console.log('#2:', this);
      });
  }

UsersSchema.pre('save', function(next, done) {
  console.log("about to save");


  console.log('next:', next);
  console.log('done:', done);
  this.hashPassword();
  next();
  done();

  //console.log("hashed password!!");

});

var User = mongoose.model('Users', UsersSchema);

// var noisey = new User({ username: 'Noisey', password:'fella' });
//     noisey.save();
//     console.log("TABLE USERS");
//     console.log(User);
// User.find().exec().then(function(users){
//   console.log(users[0].username);
// });

module.exports = User;
     // var silence = new Users({ username: 'Silence', password:'fella' })
    // console.log('#1:', silence);
    // silence.save();
//console.log('IN USERS:',  db.model('Users'));




// var User = mongoose.model('User', Users)

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

// module.exports = User;

var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');
var getUrlTitleAsync = Promise.promisify(util.getUrlTitle);

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');



exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().exec().then(function(links) {
    res.send(200, links);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    return res.send(404);
  }

  Link.findOne({ url: uri }).exec().then(function(found) {
    if (found) {
      res.send(200, found);
    } else {
      getUrlTitleAsync(uri).then(function(title){
        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save().then(function(newLink) {
          res.send(200, link);
        });
      }).catch(function(err){
        console.log('Error reading URL heading: ', err);
        return res.send(404);
      });

    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User
    .findOne({ username: username }).exec()
    .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        var comparePassword = Promise.promisify(user.comparePassword).bind(user);
        comparePassword(password).then(function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        }).catch(function(err) { console.log(err); });
      }
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;


  User.findOne({ username: username }).exec()
    .then(function(user) {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save()
          .then(function(x) {
            util.createSession(req, res, newUser);
          });
      } else {
        res.redirect('/signup');
      }
    })
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }).exec().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1 ;
      link.save()
        .then(function() {
          return res.redirect(link.url);
        });
    }
  });
};

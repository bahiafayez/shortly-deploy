var timestamps = require('mongoose-timestamp');
var mongoose = require('../config');
var crypto = require('crypto');

var Links = mongoose.Schema({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: { type: Number, default: 0 }
  });
Links.plugin(timestamps);

Links.pre('save', function(next) {
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
    next();
});

var Link = mongoose.model('Links', Links);

module.exports = Link;

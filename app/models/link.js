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
    console.log("about to save");
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
});

var Link = mongoose.model('Links', Links);


module.exports = Link;


// var db = require('../config');
// var crypto = require('crypto');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });



// // client.open(function(err, client){
// //     var Link = new mongodb.Collection(client, 'links');
// //     Link.findAndModify()
// //     client.close();
// // });

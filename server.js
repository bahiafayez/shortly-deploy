var app = require('./server-config.js');

var port = 4568;

app.listen(process.env.PORT || port);

console.log(process.env.PORT);
console.log('Server now listening on port ' + port);

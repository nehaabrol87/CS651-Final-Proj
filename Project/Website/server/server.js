'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port =  8080;
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(express.static('./app/'));
app.use(express.static('./.tmp/'));
app.use(express.static('./'));


console.log('About to crank up node');
console.log('PORT: ' + port);


app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
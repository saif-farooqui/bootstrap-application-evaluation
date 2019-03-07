var express = require('express');
var app = express();
var path = require('path');

app.use('/img', express.static(__dirname + "/img"));
app.use('/css', express.static(__dirname + "/css"));
app.use('/html', express.static(__dirname + "/html"));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8089);
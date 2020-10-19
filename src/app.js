var express = require('express');
var app = express();
var path = require('path');
var db = require('./database');


// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + '/index.html'));    
// });

app.use('/', express.static('public'));

app.get('/users', function(req, res) {
  db.query('SELECT * FROM Kayttajat', function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
});

app.get('/points', function(req, res) {
  db.query('SELECT * FROM Koordinaatit WHERE Segmentti = 1', function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
});

console.log("listening to port 3000")
app.listen(3000);

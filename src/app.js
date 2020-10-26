const express = require('express');
const app = express();
const path = require('path');
const db = require('./routers/db');
const session = require('express-session');

app.use(session({
  secret: 'Lumimies',
  resave: false,
  saveUninitialized: false
}));


// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + '/index.html'));    
// });

app.use('/', express.static('public'));

//router for payments
app.use('/db/', db);


console.log("listening to port 3000")
app.listen(3000);

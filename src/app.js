const express = require('express');
const app = express();
const db = require('./routers/db');
const bodyParser = require('body-parser');

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + '/index.html'));    
// });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/', express.static('public'));


//router for payments
app.use('/db/', db);


console.log("listening to port 3000")
app.listen(3000);

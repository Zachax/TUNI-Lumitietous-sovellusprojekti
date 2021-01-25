/*
**Backendin pohja.
**Avaa expressin ja lähettää kutsut, joko käyttöliittymälle tai API:lle
*/
const express = require('express');
const app = express();
const api = require('./routers/api');
const bodyParser = require('body-parser');
const path = require('path');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '/map-app/build')));


app.use('/', express.static('public'));


app.use('/api/', api);

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '/map-app/build/index.html'));
});

console.log("listening to port 3000")
app.listen(3000);

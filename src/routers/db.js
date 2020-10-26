const express = require('express');
const router = express.Router();
const database = require('./database');


router.get('/users', function(req, res) {
  database.query('SELECT * FROM Kayttajat', function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
});

router.get('/points', function(req, res) {
  database.query('SELECT * FROM Koordinaatit ORDER BY Segmentti', function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
});



module.exports = router;
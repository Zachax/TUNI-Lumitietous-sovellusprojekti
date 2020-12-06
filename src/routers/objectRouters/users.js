/**
API kutsut käyttäjälle

Päivityshistoria
Arttu Lakkala 15.11 Lisätty segmentit delete
Arttu Lakkala 22.11 Lisätty segmentit muutos
Arttu Lakkala 25.11 Lisätty segmentit lisäys
Arttu Lakkala 1.12  Rollback lisätty segmentin muutokseen
Arttu Lakkala 5.12 Rollback lisätty segmentin lisäykseen
Arttu Lakkala 5.12 uudelleennimettiin api.js
-----------------------------------------
Arttu Lakkala 6.12 Refactoroitiin API:sta

*/

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const database = require('./database');

const saltRounds = 15;
const secret = "Lumihiriv0"
//alusta tarkistus
const { body, validationResult } = require('express-validator');


//kaikkien käyttäjien haku
router.get('/all', function(req, res) {
  database.query('SELECT * FROM Kayttajat', function (err, result, fields) {
      if (err) throw err;
      res.json(result);
      res.status(200);
  });
});

//yhden käyttäjän haku
router.get('/', function(req, res) {
  database.query('SELECT * FROM Kayttajat WHERE ID = ?',
  [
    req.decoded.id
  ],
  function (err, result, fields) {
      if (err) throw err;
      res.json(result);
      res.status(200);
  });
});

//käyttäjän teko



router.put('/:id', function(req, res) {
  bcrypt.hash(req.body.Salasana, saltRounds, function(err, hash) {
    database.query(
    `UPDATE Kayttajat
     SET 
     Etunimi=?,
     Sukunimi=?,
     Sähköposti=?,
     Salasana=?
     WHERE ID = ?
    `,
    [
      req.body.Etunimi,
      req.body.Sukunimi,
      req.body.Sähköposti,
      hash,
      req.params.id
    ],
    function (err, result, fields) {
        if (err) throw err;
        res.json(result);
        res.status(200);
    });
  });
});


router.delete('/:id', function(req, res) {
  database.query(
  `DELETE FROM Kayttajat
   WHERE ID = ?
  `,
  [
    req.params.id
  ],
  function (err, result, fields) {
      if (err) throw err;
      res.json(result);
      res.status(200);
  });
});

module.exports = router;
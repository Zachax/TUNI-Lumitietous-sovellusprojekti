const express = require('express');
const router = express.Router();
const database = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//alusta salaukset
const saltRounds = 15;
const secret = "Lumihiriv0"
//alusta tarkistus
const { body, validationResult } = require('express-validator');

router.post('/:id', function(req, res) {

  if(req.body.Segmentti != req.params.id)
  {
    res.json("Segmentti numerot eivät täsmää");
    res.status(400);
  }
  database.query('INSERT INTO Paivitykset(Tekija, Segmentti, Lumilaatu, Teksti, Aika) VALUES(?, ?, ?, ?, NOW())',
  [
    req.decoded.id,
    req.body.Segmentti,
    req.body.Lumilaatu,
    req.body.Teksti
  ],
  function (err, points, fields) {
    if (err) throw err;
    res.json("Insert was succesfull");
    res.status(204);
  });
});



module.exports = router;